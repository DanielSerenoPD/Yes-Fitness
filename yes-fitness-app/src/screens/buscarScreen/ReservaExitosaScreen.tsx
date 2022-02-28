import React from 'react';

import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import LogoGrande from '../../../assets/imagenes/utiles/LogoGrande.svg';
import {Footer} from '../../components/Footer';

interface Props extends StackScreenProps<any, any> {}

export const ReservaExitosaScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LogoGrande fill="black" />
        <Text style={styles.texto}>
          ¡Tu reservación ha sido exitosamente realizada!
        </Text>
      </View>

      {/* Footer */}
      <Footer
        title="Ir a Mis Reservaciones"
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
    marginTop: 24,
  },
});
