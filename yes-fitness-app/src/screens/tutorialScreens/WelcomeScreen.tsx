import React, {useState, useContext, useEffect} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AuthContext} from '../../context/AuthContext';

import {StackScreenProps} from '@react-navigation/stack';
import {BotonBlanco} from '../../components/Botones/BotonBlanco';

interface Props extends StackScreenProps<any, any> {}
export const WelcomeScreen = ({navigation}: Props) => {
  let {datosUsuario, setDatosUsuarioPerfil} = useContext(AuthContext);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {/* Titulos */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={
              styles.titulo1
            }>{`¡Bienvenido ${datosUsuario.primerNombre}!`}</Text>
          <Text style={styles.titulo2}>
            Ayúdanos a personalizar tu experiencia
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footerView}>
        <BotonBlanco
          title={'Comenzar'}
          action={() => {
            navigation.navigate('WelcomeScreen2');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginBottom: 12,
  },

  titulo2: {
    fontSize: 16,
  },
  footerView: {
    height: '14.62%',
    borderTopWidth: 1,
    borderTopColor: '#e3e3e6',
    paddingHorizontal: 24,
    paddingTop: 21,
  },
});
