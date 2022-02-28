import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import HeaderLogo from '../../../components/Header/HeaderLogo';
import {AuthContext} from '../../../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export const CodigoReferirScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();

  const {datosUsuario} = useContext(AuthContext);

  const compartir = async () => {
    try {
      const result = await Share.share({
        message: 'Este es un mensaje de prueba de yes fitness',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8, marginHorizontal: 24}}>
      {/*  */}
      <HeaderLogo
        tieneFlecha={true}
        action={() => {
          navigation.pop();
        }}
      />

      <View style={{alignItems: 'center'}}>
        <Text style={styles.titulo1}>Canjear cupón</Text>

        <TouchableOpacity onPress={compartir} activeOpacity={0.6}>
          <Text style={styles.titulo2}>Compartir este código</Text>
        </TouchableOpacity>
        <Text style={styles.codigo}>{datosUsuario.cupones.numero}</Text>

        <Text style={styles.textoAviso}>
          La persona con quien lo compartas, tendrá acceso a un paquete de 5
          clases gratis por 30 días.
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Terminos');
          }}
          activeOpacity={0.6}>
          <Text style={styles.textoLeerMas}>Leer más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginTop: 117.3,
    marginBottom: 22,
  },

  titulo2: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 56,
  },

  codigo: {
    fontSize: 50,
    fontWeight: '300',
    letterSpacing: 24,
    textAlign: 'center',
    paddingLeft: 24,
  },

  fotoTitulo: {
    fontSize: 16,
    marginBottom: 8.7,
  },
  fotoSubtitulo: {
    fontSize: 14,
    color: '#909090',
  },

  textoAviso: {
    textAlign: 'center',
    width: 316,
    color: '#909090',
    marginTop: 56,
    lineHeight: 28,
    fontSize: 16,
    marginBottom: 64,
  },

  textoLeerMas: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
