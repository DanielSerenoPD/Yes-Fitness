import React from 'react';
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
import {BotonBlanco} from '../../../components/Botones/BotonBlanco';
import {Footer} from '../../../components/Footer';
import Lapiz from '../../../../assets/imagenes/utiles/Lapiz.svg';
import {FormInput} from '../../../components/FormInput';
import auth from '@react-native-firebase/auth';

interface Props extends StackScreenProps<any, any> {}

export const AyudaScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <TecladoSalvador>
        <View style={{flex: 1, marginHorizontal: 24}}>
          <View style={{marginBottom: 51.3}}>
            <HeaderLogo
              tieneFlecha={true}
              action={() => {
                navigation.pop();
              }}
            />
          </View>

          {/* Titulo1 */}
          <Text style={styles.titulo1}>Envíanos un correo </Text>

          {/* Nombre de perfil */}

          <FormInput
            titulo="Nombre"
            placeholder="Ingresa tu nombre..."
            alert={''}
            onChange={() => {}}
            onEndEditing={() => {}}
            name="nombre"
            value={''}
            tipoInput="nombre"
          />

          <FormInput
            titulo="Correo"
            placeholder="Ingresa tu correo..."
            alert={''}
            onChange={() => {}}
            onEndEditing={() => {}}
            name="correo"
            value={''}
            tipoInput="correo"
          />
        </View>
      </TecladoSalvador>

      {/* Footer */}
      <Footer title="Enviar" action={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    color: '#0B0B0B',
    marginBottom: 48,
  },
  titulo2: {
    fontSize: 24,
    color: '#0B0B0B',
    marginBottom: 43,
    marginTop: 32,
  },
});
