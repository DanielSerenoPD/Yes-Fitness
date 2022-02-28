import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {FadeInImage} from './FadeInImage';

interface Props {
  nombreEstudio: string;
  urlFoto: string;
  direccionNombre: string;
  action: () => void;
}

export const Sucursal = ({
  nombreEstudio,
  urlFoto,
  direccionNombre,
  action,
}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={action} activeOpacity={0.8}>
        <FadeInImage uri={urlFoto} style={styles.sucursalFoto} />
      </TouchableOpacity>
      <Text style={styles.texto1}>{nombreEstudio}</Text>
      <Text style={styles.texto2}>{direccionNombre}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 273,

    marginRight: 7,
  },
  sucursalFoto: {
    borderRadius: 4,
    width: 273,
    height: 334,
    marginBottom: 25,
  },
  texto1: {
    marginBottom: 8.7,
    fontSize: 16,
    fontWeight: '500',
  },
  texto2: {
    fontSize: 14,
    color: '#909090',
  },
});
