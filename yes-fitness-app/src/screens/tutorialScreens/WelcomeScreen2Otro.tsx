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
import {FormInput} from '../../components/FormInput';

interface Props extends StackScreenProps<any, any> {}
export const WelcomeScreen2Otro = ({navigation}: Props) => {
  let {datosUsuario, setDatosUsuarioPerfil} = useContext(AuthContext);

  const [datos, setDatos] = useState({
    genero: '',
  });

  const [alerts, setAlerts] = useState({
    genero: '',
  });

  const onChangeName = (e: any, type: any) => {
    // if (datos.nombre !== '') {
    //   setAlerts({...alerts, nombre: ''});
    // }

    setDatos({...datos, [type]: e.nativeEvent.text});
  };

  const onEndName = () => {};

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
        <HeaderLogo tieneFlecha={true} action={() => navigation.pop()} />
        <Text style={styles.titulo1}>Ingresa tu género</Text>

        <FormInput
          titulo="(Opcional)"
          placeholder="Ingresa tu genero..."
          alert={alerts.genero}
          onChange={onChangeName}
          onEndEditing={onEndName}
          name="genero"
          value={datos.genero}
          tipoInput="nombre"
        />
      </View>

      {/* Footer */}
      <View style={styles.footerView}>
        <BotonBlanco
          title={'Continuar'}
          action={() => {
            if (datos.genero !== '') {
              setDatosUsuarioPerfil({
                ...datosUsuario,
                datosPersonales: {
                  ...datosUsuario.datosPersonales,
                  genero: datos.genero,
                },
              });
            }
            navigation.navigate('WelcomeScreen3');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginBottom: 48,
    marginTop: 58.3,
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
