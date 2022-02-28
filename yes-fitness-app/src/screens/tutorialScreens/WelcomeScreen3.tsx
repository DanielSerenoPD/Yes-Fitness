import React, {useState, useContext, useEffect} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';

import {AuthContext} from '../../context/AuthContext';

import {StackScreenProps} from '@react-navigation/stack';
import {BotonBlanco} from '../../components/Botones/BotonBlanco';
import HeaderLogo from '../../components/Header/HeaderLogo';
import {TecladoSalvador} from '../../components/TecladoSalvador';
import {stylesYes} from '../../theme/appTheme';
import {PermissionsContext} from '../../context/Permissions/PermissionsContext';
import firestore from '@react-native-firebase/firestore';
import {ModalCargando} from '../../components/ModalCargando';

interface Props extends StackScreenProps<any, any> {}

export const WelcomeScreen3 = ({navigation}: Props) => {
  const {askLocationPermission, permissions} = useContext(PermissionsContext);
  let {
    datosUsuario,
    setDatosUsuarioPerfil,
    abrirModal,
    guardarCompletoTutorial,
  } = useContext(AuthContext);

  const iniciarApp = async (dato: any) => {
    abrirModal(true);
    try {
      await firestore()
        .collection('usuarios')
        .doc(datosUsuario.idDocumento)
        .update({
          ...datosUsuario,
          completoTutorial: true,
          datosPersonales: {
            ...datosUsuario.datosPersonales,
            intensidadEntrenamientos: dato.titulo1,
          },
        });

      //actualizamos las estadisticas
      await firestore()
        .collection('datosGenerales')
        .doc('datos')
        .update({
          hombres: firestore.FieldValue.increment(
            datosUsuario.datosPersonales.genero === 'Hombre' ? 1 : 0,
          ),

          mujeres: firestore.FieldValue.increment(
            datosUsuario.datosPersonales.genero === 'Mujer' ? 1 : 0,
          ),
          otro: firestore.FieldValue.increment(
            datosUsuario.datosPersonales.genero === 'Otro' ? 1 : 0,
          ),
          leve: firestore.FieldValue.increment(
            dato.titulo1 === 'De 0 a 1 entrenamiento' ? 1 : 0,
          ),
          moderado: firestore.FieldValue.increment(
            dato.titulo1 === 'De 2 a 4 entrenamientos' ? 1 : 0,
          ),
          intenso: firestore.FieldValue.increment(
            dato.titulo1 === 'Más de 5 entrenamientos' ? 1 : 0,
          ),
        });

      //traemos y actualizamos los datos de la app

      abrirModal(false);
      guardarCompletoTutorial(true);
    } catch (e) {
      Alert.alert('Hubo un error');
      abrirModal(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 24,
        marginTop: 56.8,
      }}>
      {/* Titulos */}
      <HeaderLogo action={() => navigation.pop()} tieneFlecha={true} />
      <Text style={styles.titulo1}>¿Cuántas veces entrenas a la semana?</Text>

      {[
        {
          titulo1: 'De 0 a 1 entrenamiento',
          titulo2: 'De 0 a 1 entrenamiento',
        },
        {
          titulo1: 'De 2 a 4 entrenamientos',
          titulo2: 'Hago ejercicio habitualmente',
        },
        {
          titulo1: 'Más de 5 entrenamientos',
          titulo2: 'Hago ejercicio todos los días',
        },
      ].map((dato, index) => (
        <TouchableOpacity
          onPress={() => {
            setDatosUsuarioPerfil({
              ...datosUsuario,
              datosPersonales: {
                ...datosUsuario.datosPersonales,
                genero: dato.titulo1,
              },
            });

            if (permissions.locationStatus !== 'granted') {
              askLocationPermission(() => iniciarApp(dato));
            } else {
              iniciarApp(dato);
            }

            //arrancamos la app
            //navigation.navigate('WelcomeScreen4');
          }}
          key={index}
          activeOpacity={0.6}
          style={styles.containerGenero}>
          <Text style={styles.containerGeneroTexto1}>{dato.titulo1}</Text>
          <Text style={styles.containerGeneroTexto2}>{dato.titulo2}</Text>
        </TouchableOpacity>
      ))}
      <ModalCargando />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginBottom: 69,
    marginTop: 51.3,
  },

  containerGenero: {
    ...stylesYes.containerStyle,
    borderColor: '#828282',
    height: 84,
    paddingLeft: 31,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  containerGeneroTexto1: {
    fontSize: 16,
    marginBottom: 6,
  },
  containerGeneroTexto2: {
    fontSize: 14,
    color: '#909090',
  },
});
