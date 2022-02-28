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
import {BotonNegro} from '../../components/Botones/BotonNegro';
import firestore from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native-gesture-handler';
import {TecladoSalvador} from '../../components/TecladoSalvador';
import {BotonRedes} from '../../components/Botones/BotonRedes';
import Google from '../../../assets/imagenes/utiles/Google.svg';
import Facebook from '../../../assets/imagenes/utiles/Facebook.svg';
import Apple from '../../../assets/imagenes/utiles/Apple.svg';
import {abrirLink} from '../../funciones/abrirLink';

interface Props extends StackScreenProps<any, any> {}

export const LogInScreen = ({navigation}: Props) => {
  const {loguearGoogle} = useLoguearGoogle();
  const {loguearFacebook} = useLoguearFacebook();

  const {abrirModal} = useContext(AuthContext);

  const [datos, setDatos] = useState({
    correo: '',
    contraseña: '',
  });

  const [alerts, setAlerts] = useState({
    correo: '',
    contraseña: '',
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
    let correo = '';
    let contraseña = '';

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
      contraseña = 'Ingresa tu contraseña';
    }

    //Si todo esta correcto se ejecuta lo siguiente
    if (isEmpty(correo) && isEmpty(contraseña)) {
      try {
        abrirModal(true);
        await auth().signInWithEmailAndPassword(datos.correo, datos.contraseña);

        setTimeout(() => {
          abrirModal(false);
        }, 5000);
      } catch (e) {
        //comprobamos si hay algun error
        if (e.code === 'auth/wrong-password') {
          contraseña = 'La contraseña es incorrecta';
          abrirModal(false);
        }

        if (e.code === 'auth/user-not-found') {
          correo = 'El correo no esta registrado';
          abrirModal(false);
        }

        if (
          e.code !== 'auth/wrong-password' &&
          e.code !== 'auth/user-not-found'
        ) {
          //Aqui va el modal de alert
          Alert.alert('hubo un error');
          abrirModal(false);
        }
      }
    }

    //Al final con esto se activan las alertas que se tengan que activar
    setAlerts({
      correo,
      contraseña,
    });
  };

  //Pasword
  const onChangePassword = (e: any, type: any) => {
    if (datos.contraseña !== '') {
      setAlerts({...alerts, contraseña: ''});
    }
    setDatos({...datos, [type]: e.nativeEvent.text});
  };

  const onEndPassword = () => {
    if (datos.contraseña === '') {
      setAlerts({...alerts, contraseña: 'Ingresa una contraseña'});
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

  return (
    <TecladoSalvador>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          marginHorizontal: 24,
          marginTop: 56.8,
        }}>
        {/* Logo Header */}
        <View style={{alignItems: 'center', marginBottom: 36.3}}>
          <Image
            style={{width: 43, height: 25.9}}
            source={require('../../../assets/imagenes/utiles/LogoHeader.png')}
          />
        </View>

        <Text style={styles.titulo}>¡Hola de nuevo!</Text>

        {/* Zona del formulario */}

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

        {/* Boton de submit */}
        <View style={{marginTop: 10, marginBottom: 30}}>
          <BotonNegro title="Entrar" action={() => validarDatos()} />
        </View>

        {/* */}
        <View style={{flexDirection: 'row', marginBottom: 17}}>
          <Text style={{color: 'black', fontSize: 14}}>
            ¿No tienes cuenta aún?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUpScreen')}
            activeOpacity={0.7}>
            <Text style={{marginLeft: 4, color: 'black', fontSize: 14}}>
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>

        {/* */}
        <View style={{flexDirection: 'row', marginBottom: 17}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RecuperarContraseña1')}
            activeOpacity={0.7}>
            <Text style={{color: 'black', fontSize: 14}}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </View>

        {/* */}
        <TouchableOpacity
          onPress={() => abrirLink('https://google.com')}
          activeOpacity={0.7}>
          <Text style={styles.textoEntrarInvitado}>Aviso de privacidad</Text>
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
      </SafeAreaView>
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
