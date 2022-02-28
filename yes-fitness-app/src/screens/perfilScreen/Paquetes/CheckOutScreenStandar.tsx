import React, {useState, useContext} from 'react';
import HeaderLogo from '../../../components/Header/HeaderLogo';
import {TecladoSalvador} from '../../../components/TecladoSalvador';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {WebView } from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import Candado from '../../../../assets/imagenes/utiles/Candado.svg';
import {FormInputPagos} from '../../../components/FormInputPagos';
import auth from '@react-native-firebase/auth';
import {FooterPagar} from '../../../components/FooterPagar';
import CookieManager from "@react-native-community/cookies";
import {AuthContext} from '../../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
interface Props extends StackScreenProps<any, any> {}

export const CheckOutScreenStandar = ({navigation}: Props) => {
  const {datosUsuario, setDatosUsuarioPerfil, abrirModal} =
    useContext(AuthContext);
  let webView:any = null;
  const insets = useSafeAreaInsets();
  const actualizarSuscripcion = async(data:any)=>{
    //Actualizamos en firebase
    await firestore()
    .collection('usuarios')
    .doc(datosUsuario.idDocumento)
    .update({
      clases:20,
      suscripcionActual:{
        id:data.subscriptionID.value,
        dateStart:data.subscriptionStart.value,
        dateEnd: data.subscriptionEnd.value,
        customerId: data.customerId.value,
        plan:{name:"20 Clases", price:data.plan.value},
        status: true,
      }, 
    });
  }
  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
     
  <WebView
        source ={{uri:'https://client-stripe-integration.herokuapp.com/premium'}}
        ref = {(ref)=>webView=ref}
        onNavigationStateChange = {state=>{
            if (state.url.includes('success')) {
              CookieManager.get('https://client-stripe-integration.herokuapp.com/basic')
              .then((cookies) => {
                actualizarSuscripcion(cookies);
              });
                webView.stopLoading();
                navigation.popToTop();
            }
            if (state.url.includes('close')) {
              webView.stopLoading();
              navigation.popToTop();
          }
        }}
        thirdPartyCookiesEnabled={true}
       />
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
    backgroundColor: 'gray',
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
    marginLeft: 10.9,
  },
  titulo2: {
    fontSize: 24,
    color: '#0B0B0B',
    marginBottom: 43,
    marginTop: 32,
  },

  texto1: {
    fontSize: 16,
    marginBottom: 8,
  },
  texto2: {
    fontSize: 28,
    marginBottom: 11,
    fontWeight: '300',
  },
  texto3: {
    fontSize: 14,
    color: '#909090',
  },

  textoCerrarSesion: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  linea: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#C3C3C3ed',
    marginBottom: 48,
  },
});
