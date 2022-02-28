import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  SafeAreaView,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

import Flecha from '../../../assets/imagenes/iconos-otros/FlechaIzquierda.svg';

import Guardadas from '../../../assets/imagenes/iconos/Heart.svg';
import LogoHeader from '../../../assets/imagenes/utiles/LogoHeader.svg';
import {StackScreenProps} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {FormInput} from '../../components/FormInput';
import {size, isEmpty} from 'lodash';
import {validateEmail} from '../../funciones/validarEmail';
import auth from '@react-native-firebase/auth';
import {ModalCargando} from '../../components/ModalCargando';
import {AuthContext} from '../../context/AuthContext';
import useLoguearGoogle from '../../funciones/useLoguearGoogle';
import useLoguearFacebook from '../../funciones/useLoguearFacebook';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BotonNegro} from '../../components/Botones/BotonNegro';
import firestore from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native-gesture-handler';
import {TecladoSalvador} from '../../components/TecladoSalvador';
import {BotonRedes} from '../../components/Botones/BotonRedes';
import Google from '../../../assets/imagenes/utiles/Google.svg';
import Facebook from '../../../assets/imagenes/utiles/Facebook.svg';
import Apple from '../../../assets/imagenes/utiles/Apple.svg';
import {generarCodigoCupon} from '../../funciones/generarCodigoCupon';

interface Props extends StackScreenProps<any, any> {}

export const SignUpScreen = ({navigation}: Props) => {
  const {loguearGoogle} = useLoguearGoogle();
  const {loguearFacebook} = useLoguearFacebook();
  const insets = useSafeAreaInsets();

  const {abrirModal} = useContext(AuthContext);

  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    contraseñaRepetida: '',
  });

  const [alerts, setAlerts] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    contraseñaRepetida: '',
  });

  const obtenerPrimerNombre = (nombre: string) => {
    let arrayNombre = nombre.split(' ');

    let nombrePila = '';
    let validador = false;

    arrayNombre.forEach(dato => {
      if (dato !== '' && validador === false) {
        nombrePila = dato;
        validador = true;
      }
    });

    return nombrePila;
  };

  const validarDatos = async () => {
    //Este es el truco para validar mas sencillo
    let nombre = '';
    let correo = '';
    let contraseña = '';
    let contraseñaRepetida = '';

    //Validador de nombre
    if (isEmpty(datos.nombre)) {
      nombre = 'Ingresa tu nombre';
    }

    //Validador de correo
    if (isEmpty(datos.correo)) {
      correo = 'Ingresa tu correo';
    } else {
      if (!validateEmail(datos.correo)) {
        correo = 'Ingresa un correo valido';
      }
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
      isEmpty(correo) &&
      isEmpty(contraseña) &&
      isEmpty(contraseñaRepetida)
    ) {
      crearUsuario(datos.nombre, datos.contraseña, datos.correo);
    }

    //Al final con esto se activan las alertas que se tengan que activar
    setAlerts({
      nombre,
      correo,
      contraseña,
      contraseñaRepetida,
    });
  };

  const crearUsuario = async (
    nombre: string,
    contraseña: string,
    correo: string,
  ) => {
    //Esto es para obtener el nombre de pila
    const primerNombre = obtenerPrimerNombre(nombre);
    abrirModal(true);
    try {
      const datosUsuario = await auth().createUserWithEmailAndPassword(
        correo,
        contraseña,
      );

      //creamos al usuario

      //esto sirve para crear la vigencia de las clases gratis
      let hoy = new Date();
      let diasVigencia = 15;
      let cupon = generarCodigoCupon();
      await firestore()
        .collection('usuarios')
        .add({
          nombreCompleto: nombre,
          primerNombre: primerNombre,
          puedeUsarCupon: true,
          completoTutorial: false,
          clases: 0,
          suscripcionActual: null,
          //si tiene suscripcion
          // suscripcionactual:{
          //   informacionPaquete: {

          //   },
          //   corteAnterior: '',
          //   corteSiguiente: ''
          // },
          clasesGratis: {
            activo: true,
            fechaVigencia: hoy.setDate(hoy.getDate() + diasVigencia),
            clasesGratis: 3,
          },
          fechaCreacion: new Date(),
          datosPersonales: {
            fechaNacimiento: new Date(),
            genero: '',
            intensidadEntrenamientos: '',
          },
          idUsuario: datosUsuario.user.uid,
          correo: correo,
          fotoPerfil: '',
          //esta variable sirve para la inteligencia artificial
          categoriaDominante: '',
          nombresClasesTomadas: {},
          categoriasClasesTomadas: {},
          estudiosFavoritos: [],
          cupones: {
            numero: cupon,
            puedeUsar: true,
          },
          ultimaClase: {},
          historialClases: [],
          proximasClases: [],
          clasesDeLaSemana: [],
          clasesRecomendadas: [],

          //subcolecciones
          //clases historial
          //estudios Favoritos
          //historial de cobros
        });

      //funcion para la inteligencia artificial
      //         let obj = { a: 4, b: 0.5 , c: 0.35, d: 5 };

      // let arr = Object.values(obj);
      // let min = Math.min(...arr);
      // let max = Math.max(...arr);

      // acceder al objeto

      //creamos el codigo unico en la base de datos
      await firestore().collection('codigosCupones').add({
        codigo: cupon,
        tipoCodigo: 'usuario',
        dineroDescuento: 200,
        idUsuario: datosUsuario.user.uid,
      });

      //arrancamos la app
      setTimeout(() => {
        abrirModal(false);
      }, 10000);

      abrirModal(false);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('El correo que ingresaste ya fue previamente registrado');
      } else {
        Alert.alert('Hubo un error');
      }
      abrirModal(false);
    }
  };

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

  //Correo
  const onChangeEmail = (e: any, type: any) => {
    if (validateEmail(datos.correo)) {
      setAlerts({...alerts, correo: ''});
    }

    setDatos({...datos, [type]: e.nativeEvent.text});
  };

  const onEndEmail = () => {
    if (!validateEmail(datos.correo)) {
      setAlerts({...alerts, correo: 'Ingresa un correo valido'});
    }

    if (datos.correo === '') {
      setAlerts({...alerts, correo: 'Ingresa un correo'});
    }
  };

  //Nombre

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
    <TecladoSalvador>
      <View
        style={{
          flex: 1,
          marginTop: insets.top + 9.8,
          marginBottom: insets.bottom,
          marginHorizontal: 24,
        }}>
        <StatusBar backgroundColor="white" barStyle={'dark-content'} />
        {/* Logo Header */}
        <View style={{alignItems: 'center', marginBottom: 36.3}}>
          <Image
            style={{width: 43, height: 25.9}}
            source={require('../../../assets/imagenes/utiles/LogoHeader.png')}
          />
        </View>

        <Text style={styles.titulo}>Bienvenido.</Text>

        {/* Zona del formulario */}
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

        <FormInput
          titulo="Correo"
          placeholder="Ingresa tu correo..."
          alert={alerts.correo}
          onChange={onChangeEmail}
          onEndEditing={onEndEmail}
          name="correo"
          value={datos.correo}
          tipoInput="correo"
        />

        <FormInput
          titulo="Crear contraseña"
          placeholder="*********"
          alert={alerts.contraseña}
          onEndEditing={onEndPassword}
          onChange={onChangePassword}
          name="contraseña"
          value={datos.contraseña}
          tipoInput="password"
        />

        <FormInput
          onEndEditing={onEndRepeatPassword}
          titulo="Repetir contraseña"
          placeholder="*********"
          alert={alerts.contraseñaRepetida}
          onChange={onChangeRepeatPassword}
          name="contraseñaRepetida"
          value={datos.contraseñaRepetida}
          tipoInput="repeatPassword"
        />

        {/* Boton de submit */}
        <View style={{marginTop: 10, marginBottom: 30}}>
          <BotonNegro title="Únete" action={() => validarDatos()} />
        </View>

        {/* */}
        <View style={{flexDirection: 'row', marginBottom: 17}}>
          <Text style={{color: 'black', fontSize: 14}}>
            ¿Ya tienes una cuenta?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LogInScreen')}
            activeOpacity={0.7}>
            <Text style={{marginLeft: 9, color: 'black', fontSize: 14}}>
              Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>

        {/* */}
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.textoEntrarInvitado}>Entrar como invitado</Text>
        </TouchableOpacity>
        {/* Linea */}
        <View style={styles.linea} />

        {/* Botones de login */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <BotonRedes
            logo={<Facebook />}
            action={() => {
              loguearFacebook();
            }}
          />
          <BotonRedes
            logo={<Google />}
            action={() => {
              loguearGoogle();
            }}
          />
          <BotonRedes
            logo={<Apple style={{width: 18.83, height: 23.09}} />}
            action={() => {}}
          />
        </View>
        <ModalCargando />
      </View>
    </TecladoSalvador>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    marginBottom: 48,
    color: '#0B0B0B',
  },
  textoEntrarInvitado: {
    fontSize: 14,
    color: '#909090',
    textDecorationLine: 'underline',
    marginBottom: 40,
  },
  linea: {
    backgroundColor: '#707070',
    height: 0.2,
    marginBottom: 30,
  },
});
