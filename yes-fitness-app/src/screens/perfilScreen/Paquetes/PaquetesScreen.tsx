import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import HeaderLogo from '../../../components/Header/HeaderLogo';
import Ajustes from '../../../../assets/imagenes/utiles/Ajustes.svg';
import {HistorialClase} from '../../../components/HistorialClase';
import Favoritos from '../../../../assets/imagenes/iconos-perfil/Favoritos.svg';
import {Paquete} from '../../../components/Paquete';

interface Props extends StackScreenProps<any, any> {}

export const PaquetesScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8, marginHorizontal: 24}}>
      {/*  */}
      <HeaderLogo
        tieneFlecha={true}
        action={() => {
          navigation.pop();
        }}
      />

      {/*Titulos  */}

      <Text style={styles.titulo1}>Paquetes</Text>
      <Text style={styles.titulo2}>
        Actualmente tienes un paquete activo. Si deseas cambiarlo, puedes
        hacerlo desde{' '}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BillingScreen');
          }}
          style={{padding: 0}}
          activeOpacity={0.6}>
          <Text
            style={{
              textDecorationLine: 'underline',
              fontSize: 15,
            }}>
            “Billing”
          </Text>
        </TouchableOpacity>
      </Text>

      {/* Paquetes */}
      <ScrollView style={{paddingTop: 5}}>
        <Paquete
          texto1="$2,100 MXN"
          texto2="30 Clases"
          texto3="Vigencia 30 días. Renovación automática."
          tipoPaquete="activo"
          action={() => {
            navigation.navigate('CheckOutScreenPremium');
          }}
        />

        <Paquete
          texto1="$1,700 MXN"
          texto2="20 Clases"
          texto3="Vigencia 30 días. Renovación automática."
          tipoPaquete="normal"
          action={() => {
            navigation.navigate('CheckOutScreenStandar');
          }}
        />

        <Paquete
          texto1="$1,100 MXN"
          texto2="10 Clases"
          texto3="Vigencia 30 días. Renovación automática."
          tipoPaquete="normal"
          action={() => {
            navigation.navigate('CheckOutScreen');
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginTop: 54.8,
    marginBottom: 23,
  },

  titulo2: {
    fontSize: 15,
    lineHeight: 27,
    marginBottom: 22,
  },

  fotoTitulo: {
    fontSize: 16,
    marginBottom: 8.7,
  },
  fotoSubtitulo: {
    fontSize: 14,
    color: '#909090',
  },
});
