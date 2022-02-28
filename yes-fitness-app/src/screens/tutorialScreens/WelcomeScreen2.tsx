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

interface Props extends StackScreenProps<any, any> {}
export const WelcomeScreen2 = ({navigation}: Props) => {
  let {datosUsuario, setDatosUsuarioPerfil} = useContext(AuthContext);
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
      <Text style={styles.titulo1}>¿Cuál es tu género?</Text>

      {['Mujer', 'Hombre', 'Otro'].map((dato, index) => (
        <TouchableOpacity
          onPress={() => {
            setDatosUsuarioPerfil({
              ...datosUsuario,
              datosPersonales: {...datosUsuario.datosPersonales, genero: dato},
            });
            navigation.navigate('WelcomeScreen3');
          }}
          key={index}
          activeOpacity={0.6}
          style={styles.containerGenero}>
          <Text style={styles.containerGeneroTexto}>{dato}</Text>
        </TouchableOpacity>
      ))}
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

  containerGeneroTexto: {
    fontSize: 16,
  },
});
