import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {FadeInImage} from './FadeInImage';

interface Props {
  nombreEstudio: string;
  urlFoto: string;
  action: () => void;
}

export const Favoritos = ({nombreEstudio, urlFoto, action}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={action} activeOpacity={0.6}>
        <FadeInImage style={styles.circuloFoto} uri={urlFoto} />
      </TouchableOpacity>
      <Text style={styles.textoFooter}>{nombreEstudio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 79,
    height: 79,
    marginRight: 29,
  },
  circuloFoto: {
    borderRadius: 100,
    height: 79,
    width: 79,
  },
  textoFooter: {
    textAlign: 'center',
    marginTop: 11,
    fontSize: 14,
    color: '#0B0B0B',
  },
});
