import React, {useState, useContext, useEffect} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';

import {AuthContext} from '../../context/AuthContext';

import {StackScreenProps} from '@react-navigation/stack';
import {BotonBlanco} from '../../components/Botones/BotonBlanco';
import HeaderLogo from '../../components/Header/HeaderLogo';
import {TecladoSalvador} from '../../components/TecladoSalvador';
import {stylesYes} from '../../theme/appTheme';
import FlechaAbajo from '../../../assets/imagenes/utiles/FlechaAbajo.svg';
import DatePicker from 'react-native-date-picker';
import {DateTime} from 'luxon';
import firestore from '@react-native-firebase/firestore';
import {PermissionsContext} from '../../context/Permissions/PermissionsContext';

interface Props extends StackScreenProps<any, any> {}
export const WelcomeScreen4 = ({navigation}: Props) => {
  const {askLocationPermission, permissions} = useContext(PermissionsContext);
  let {
    datosUsuario,
    setDatosUsuarioPerfil,
    abrirModal,
    guardarCompletoTutorial,
  } = useContext(AuthContext);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const arrancarApp = async () => {};

  const iniciarApp = async () => {
    abrirModal(true);
    try {
      await firestore()
        .collection('usuarios')
        .doc(datosUsuario.idDocumento)
        .update({
          ...datosUsuario,
          completoTutorial: true,
        });

      abrirModal(false);
      guardarCompletoTutorial(true);
    } catch (e) {
      abrirModal(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',

        marginTop: 56.8,
      }}>
      {/* Titulos */}
      <View
        style={{
          marginHorizontal: 24,
          flex: 1,
        }}>
        <HeaderLogo action={() => navigation.pop()} tieneFlecha={true} />
        <Text style={styles.titulo1}>¿Cuál es tu fecha de nacimiento?</Text>

        <TouchableOpacity
          onPress={() => setOpen(true)}
          activeOpacity={0.6}
          style={styles.containerGenero}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.containerGeneroTexto1}>
              {DateTime.fromJSDate(date)
                .setLocale('es')
                .toLocaleDateString(DateTime.DATE_FULL)}
            </Text>
            <FlechaAbajo
              width={20}
              height={13}
              style={{alignSelf: 'center'}}
              fill={'black'}
            />
          </View>
        </TouchableOpacity>

        {/* Modal para elegir la fecha de nacimiento  */}
        <DatePicker
          locale="es"
          mode="date"
          onDateChange={dato => {
            console.log(dato);
          }}
          modal
          open={open}
          date={
            new Date(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
              date.getUTCHours(),
              date.getUTCMinutes(),
              date.getUTCSeconds(),
            )
          }
          onConfirm={date => {
            setOpen(false);
            setDatosUsuarioPerfil({
              ...datosUsuario,
              datosPersonales: {
                ...datosUsuario.datosPersonales,
                fechaNacimiento: date,
              },
            });
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
      <View style={styles.footerView}>
        <BotonBlanco
          title={'Continuar'}
          action={() => {
            if (permissions.locationStatus !== 'granted') {
              askLocationPermission(() => iniciarApp());
            } else {
              iniciarApp();
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginBottom: 69,
    marginTop: 51.3,
  },
  footerView: {
    height: '14.62%',
    borderTopWidth: 1,
    borderTopColor: '#e3e3e6',
    paddingHorizontal: 24,
    paddingTop: 21,
  },

  containerGenero: {
    ...stylesYes.containerStyle,
    borderColor: '#828282',
    height: 84,
    paddingLeft: 31,
    paddingRight: 26,
    justifyContent: 'center',

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
