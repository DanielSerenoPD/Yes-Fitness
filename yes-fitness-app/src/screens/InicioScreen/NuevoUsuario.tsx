import React, {useState, useContext, useEffect} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {AuthContext} from '../../context/AuthContext';

import {StackScreenProps} from '@react-navigation/stack';
import {BotonBlanco} from '../../components/Botones/BotonBlanco';
import HeaderLogo from '../../components/Header/HeaderLogo';
import {FormInput} from '../../components/FormInput';
import {FadeInImage} from '../../components/FadeInImage';

interface Props extends StackScreenProps<any, any> {}
export const NuevoUsuario = ({navigation}: Props) => {
  let {datosUsuario, setDatosUsuarioPerfil} = useContext(AuthContext);

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
          flex: 1,
        }}>
        <View style={{marginHorizontal: 24, marginBottom: 20}}>
          <HeaderLogo tieneFlecha={true} action={() => navigation.pop()} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <FadeInImage
            uri={
              'https://firebasestorage.googleapis.com/v0/b/yes-fitness-f2c41.appspot.com/o/fotosPrueba%2Fnuevo-usuario.png?alt=media&token=4ffbe4ad-1485-4977-b67f-a6713bd1865d'
            }
            style={{
              width: '100%',
              height: 456,
            }}
          />

          <View style={{marginHorizontal: 24, marginTop: 32}}>
            <Text style={styles.titulo1}>Descripción:</Text>
            <Text style={styles.titulo2}>
              Duis aute veniam veniam qui aliquip irure duis sint magna occaecat
              dolore nisi culpa do. Est nisi incididunt aliquip commodo aliqua
              tempor.Duis aute veniam veniam qui aliquip irure duis sint magna
              occaecat dolore nisi culpa do. Est nisi incididunt aliquip commodo
              aliqua tempor.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footerView}>
        <BotonBlanco
          title={'Conocer Paquetes'}
          action={() => {
            navigation.navigate('PaquetesScreen');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 16,
    marginBottom: 14.3,
    color: 'black',
  },

  titulo2: {
    fontSize: 14,
    color: '#909090',
    lineHeight: 22,
    marginBottom: 20,
  },
  footerView: {
    height: '14.62%',
    borderTopWidth: 1,
    borderTopColor: '#e3e3e6',
    paddingHorizontal: 24,
    paddingTop: 21,
  },
});
