import React, {useContext, useState} from 'react';
import HeaderLogo from '../../../components/Header/HeaderLogo';
import {TecladoSalvador} from '../../../components/TecladoSalvador';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {size, isEmpty} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {BotonBlanco} from '../../../components/Botones/BotonBlanco';
import {Footer} from '../../../components/Footer';
import Lapiz from '../../../../assets/imagenes/utiles/Lapiz.svg';
import {FormInput} from '../../../components/FormInput';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../../context/AuthContext';
import {FadeInImage} from '../../../components/FadeInImage';
import CambiarFoto from '../../../../assets/imagenes/utiles/CambiarFoto.svg';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {obtenerPrimerNombre} from '../../../funciones/obtenerPrimerNombre';
import {reautenticar} from '../../../funciones/reautenticarFirebase';

interface Props extends StackScreenProps<any, any> {}

export const EditarPerfilScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {datosUsuario, setDatosUsuarioPerfil, abrirModal} =
    useContext(AuthContext);
  const [cargandoFoto, setCargandoFoto] = useState(false);

  const [datos, setDatos] = useState({
    nombre: datosUsuario.nombreCompleto,
    contraseñaActual: '',
    contraseña: '',
    contraseñaRepetida: '',
  });

  //Este es el component para actualizar foto de perfil
  const actualizarFotoDePerfil = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      (resp: any) => {
        console.log(resp);
        if (resp.didCancel) return;
        if (!resp.assets[0].uri) return;

        uploadImage(resp.assets[0].uri);
      },
    );
  };

  const uploadImage = async (uri: string) => {
    //EL UID es el uid del usuario el cual sirve
    //para poner un identificador unico a la foto
    // y que este se reemplace y se elimine automaticamente
    // por cada nueva foto

    try {
      setCargandoFoto(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const ref = storage()
        .ref()
        .child(`avatarUsuarios/${datosUsuario.idUsuario}`);

      await ref.put(blob);

      //actualizamos la url en firebase
      const urlNuevaFoto = await storage()
        .ref(`avatarUsuarios/${datosUsuario.idUsuario}`)
        .getDownloadURL();

      //Actualizamos en firebase
      await firestore()
        .collection('usuarios')
        .doc(datosUsuario.idDocumento)
        .update({
          fotoPerfil: urlNuevaFoto,
        });

      //Actualizamos localmente
      setDatosUsuarioPerfil({...datosUsuario, fotoPerfil: urlNuevaFoto});
      setCargandoFoto(false);
    } catch (e) {
      setCargandoFoto(false);
      //Poner aqui modal de error
    }
  };

  const validarDatos = async () => {
    //Este es el truco para validar mas sencillo
    let nombre = '';
    let contraseña = '';
    let contraseñaRepetida = '';
    let contraseñaActual = '';

    //esto funciona solo si quieres cambiar el nombre
    if (
      isEmpty(datos.contraseña) &&
      isEmpty(datos.contraseñaRepetida) &&
      isEmpty(datos.contraseñaActual)
    ) {
      //Validador de nombre
      if (isEmpty(datos.nombre)) {
        nombre = 'Ingresa tu nombre';
      }

      if (isEmpty(nombre)) {
        const primerNombre = obtenerPrimerNombre(datos.nombre);
        abrirModal(true);

        try {
          //Actualizamos Fb
          await firestore()
            .collection(`usuarios`)
            .doc(datosUsuario.idDocumento)
            .update({
              nombreCompleto: datos.nombre,
              primerNombre: primerNombre,
            });

          //Actualizamos Local
          setDatosUsuarioPerfil({
            ...datosUsuario,
            nombreCompleto: datos.nombre,
            primerNombre: primerNombre,
          });

          //navigation.popToTop();
          Alert.alert('Nombre correctamente actualizado');

          abrirModal(false);
        } catch (error) {
          abrirModal(false);
          Alert.alert('Hubo un error');
        }
      }

      return;
    }

    //Validador de nombre
    if (isEmpty(datos.nombre)) {
      nombre = 'Ingresa tu nombre';
    }

    //validador de contraseña actual
    if (isEmpty(datos.contraseñaActual)) {
      contraseñaActual = 'Ingresa tu contraseña actual';
    }

    //Validador de contraseñas
    if (isEmpty(datos.contraseña)) {
      contraseña = 'Ingresa una contraseña';
    }

    if (isEmpty(datos.contraseñaRepetida)) {
      contraseñaRepetida = 'Repite la contraseña';
    }

    //Si todo esta correcto se ejecuta lo siguiente
    if (
      isEmpty(nombre) &&
      isEmpty(contraseña) &&
      isEmpty(contraseñaRepetida) &&
      isEmpty(contraseñaActual)
    ) {
      const primerNombre = obtenerPrimerNombre(datos.nombre);
      abrirModal(true);

      try {
        //actualizamos la contraseña
        await reautenticar(datos.contraseñaActual);
        await auth().currentUser?.updatePassword(datos.contraseña);

        //Actualizamos Fb
        await firestore()
          .collection(`usuarios`)
          .doc(datosUsuario.idDocumento)
          .update({
            nombreCompleto: datos.nombre,
            primerNombre: primerNombre,
          });

        //Actualizamos Local
        setDatosUsuarioPerfil({
          ...datosUsuario,
          nombreCompleto: datos.nombre,
          primerNombre: primerNombre,
        });

        //reiniciamos el state
        setDatos({
          ...datos,
          contraseñaActual: '',
          contraseña: '',
          contraseñaRepetida: '',
        });

        //navigation.popToTop();
        Alert.alert('Datos correctamente actualizados');

        abrirModal(false);
      } catch (error: any) {
        abrirModal(false);
        if (error.code === 'auth/wrong-password') {
          Alert.alert('El password actual es incorrecto');
          abrirModal(false);
        } else {
          Alert.alert('Hubo un error');
        }
      }
    }

    //Al final con esto se activan las alertas que se tengan que activar
    setAlerts({
      nombre,
      contraseña,
      contraseñaRepetida,
      contraseñaActual,
    });
  };

  const [alerts, setAlerts] = useState({
    nombre: '',
    contraseña: '',
    contraseñaRepetida: '',
    contraseñaActual: '',
  });

  //Pasword
  const onChangePassword = (e: any, type: any) => {
    if (size(datos.contraseña) >= 5) {
      setAlerts({...alerts, contraseña: ''});
    }
    setDatos({...datos, [type]: e.nativeEvent.text});
  };

  const onEndPassword = () => {
    if (size(datos.contraseña) <= 5) {
      setAlerts({
        ...alerts,
        contraseña: 'La contraseña tiene que tener minimo 6 caracteres',
      });
    }

    if (datos.contraseña === '') {
      setAlerts({...alerts, contraseña: 'Ingresa una contraseña'});
    }
  };

  //Pasword Repetida
  const onChangeRepeatPassword = (e: any, type: any) => {
    const texto = e.nativeEvent.text;
    if (
      datos.contraseña ===
      datos.contraseñaRepetida + texto.charAt(texto.length - 1)
    ) {
      setAlerts({...alerts, contraseñaRepetida: ''});
    }
    setDatos({...datos, [type]: e.nativeEvent.text});
  };

  const onEndRepeatPassword = () => {
    if (datos.contraseña !== datos.contraseñaRepetida) {
      setAlerts({
        ...alerts,
        contraseñaRepetida: 'Las contraseñas tienen que ser iguales',
      });
    }

    if (datos.contraseñaRepetida === '') {
      setAlerts({...alerts, contraseñaRepetida: 'Repite la contraseña'});
    }
  };

  //contraseña actual
  const onChangeCurrentPassword = (e: any, type: any) => {
    if (datos.contraseñaActual !== '') {
      setAlerts({...alerts, contraseñaActual: ''});
    }

    setDatos({...datos, [type]: e.nativeEvent.text});
  };

  const onEndCurrentPassword = () => {
    if (datos.contraseñaActual === '') {
      setAlerts({...alerts, contraseñaActual: 'Ingresa tu contraseña actual'});
    }
  };

  //nombre actual
  const onChangeName = (e: any, type: any) => {
    if (datos.nombre !== '') {
      setAlerts({...alerts, nombre: ''});
    }

    setDatos({...datos, [type]: e.nativeEvent.text});
  };

  const onEndName = () => {
    if (datos.nombre === '') {
      setAlerts({...alerts, nombre: 'Ingresa un nombre'});
    }
  };

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <TecladoSalvador>
        <View style={{flex: 1, marginHorizontal: 24}}>
          <View style={{marginBottom: 39.8}}>
            <HeaderLogo
              tieneFlecha={true}
              action={() => {
                navigation.pop();
              }}
            />
          </View>

          {/* Titulo1 */}
          <Text style={styles.titulo1}>Editar Perfil</Text>

          {/* Foto de perfil */}
          <TouchableOpacity
            onPress={() => {
              actualizarFotoDePerfil();
            }}
            style={styles.fotoPerfil}
            activeOpacity={0.6}>
            {datosUsuario.fotoPerfil === '' ? (
              <View style={styles.fotoPerfilIcono}>
                <CambiarFoto fill="black" />
              </View>
            ) : cargandoFoto === false ? (
              <FadeInImage
                uri={datosUsuario.fotoPerfil}
                style={styles.fotoPerfil}
              />
            ) : (
              <View
                style={{
                  ...styles.fotoPerfil,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="black" />
              </View>
            )}
            <View style={styles.iconoEditarFoto}>
              <Lapiz fill="black" />
            </View>
          </TouchableOpacity>

          {/* Nombre de perfil */}

          <TouchableOpacity
            onPress={() => {
              console.log(auth().currentUser);
            }}>
            <Text>Hola</Text>
          </TouchableOpacity>

          <FormInput
            titulo="Nombre"
            placeholder="Ingresa tu nombre..."
            alert={alerts.nombre}
            onChange={onChangeName}
            onEndEditing={onEndName}
            name="nombre"
            value={datos.nombre}
            tipoInput="nombre"
          />

          {auth().currentUser?.emailVerified === false && (
            <>
              {/* Titulo 2 */}
              <Text style={styles.titulo2}>Cambiar password</Text>

              {/* Zona de passwords */}
              <FormInput
                titulo="Password actual"
                placeholder="*********"
                alert={alerts.contraseñaActual}
                onEndEditing={onEndCurrentPassword}
                onChange={onChangeCurrentPassword}
                name="contraseñaActual"
                value={datos.contraseñaActual}
                tipoInput="password"
              />

              <FormInput
                onEndEditing={onEndPassword}
                titulo="Nuevo password"
                placeholder="*********"
                alert={alerts.contraseña}
                onChange={onChangePassword}
                name="contraseña"
                value={datos.contraseña}
                tipoInput="password"
              />

              <FormInput
                titulo="Repetir nuevo password"
                placeholder="*********"
                alert={alerts.contraseñaRepetida}
                onEndEditing={onEndRepeatPassword}
                onChange={onChangeRepeatPassword}
                name="contraseñaRepetida"
                value={datos.contraseñaRepetida}
                tipoInput="repeatPassword"
              />
            </>
          )}

          <TouchableOpacity
            activeOpacity={0.6}
            style={{marginTop: 35, marginBottom: 60}}
            onPress={() => auth().signOut()}>
            <Text style={styles.textoCerrarSesion}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </TecladoSalvador>

      {/* Footer */}
      <Footer title="Guardar cambios" action={() => validarDatos()} />
    </View>
  );
};

const styles = StyleSheet.create({
  footerView: {
    height: 131,
    borderTopWidth: 1,
    borderTopColor: '#e3e3e6',
    paddingHorizontal: 24,
    paddingTop: 21,
  },

  fotoPerfil: {
    width: 97,
    height: 97,
    borderRadius: 100,

    marginBottom: 40,
  },

  fotoPerfilIcono: {
    width: 97,
    height: 97,
    borderRadius: 100,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  iconoEditarFoto: {
    height: 32,
    width: 32,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#0B0B0B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },

  titulo1: {
    fontSize: 24,
    color: '#0B0B0B',
    marginBottom: 74,
  },
  titulo2: {
    fontSize: 24,
    color: '#0B0B0B',
    marginBottom: 43,
    marginTop: 32,
  },

  textoCerrarSesion: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
