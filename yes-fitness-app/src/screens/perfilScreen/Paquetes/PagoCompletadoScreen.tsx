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

import Candado from '../../../../assets/imagenes/utiles/Candado.svg';
import {FormInputPagos} from '../../../components/FormInputPagos';
import auth from '@react-native-firebase/auth';
import {Footer} from '../../../components/Footer';

interface Props extends StackScreenProps<any, any> {}

export const PagoCompletadoScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.texto}>
          ¡Tu pago ha sido realizado correctamente!
        </Text>
      </View>

      {/* Footer */}
      <Footer
        title="Regresar a inicio"
        action={() => {
          navigation.popToTop();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  texto: {
    fontSize: 20,
    lineHeight: 34,
    color: 'black',
    width: 220,
    textAlign: 'center',
  },
});
