import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

interface Props {
  title: string;
  action?: () => void;
}

export const BotonNegro2 = ({title, action}: Props) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={styles.botonStyle}
      activeOpacity={0.8}>
      <Text style={styles.botonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botonStyle: {
    backgroundColor: '#000000',
    width: 211,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 40,
  },
  botonText: {
    color: 'white',
    fontSize: 14,
  },
});
