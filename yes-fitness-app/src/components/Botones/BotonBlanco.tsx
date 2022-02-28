import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

interface Props {
  title: string;
  action?: () => void;
}

export const BotonBlanco = ({title, action}: Props) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={styles.botonStyle}
      activeOpacity={0.7}>
      <Text style={styles.botonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botonStyle: {
    borderRadius: 6,

    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderWidth: 0.5,
  },
  botonText: {
    color: 'black',
    fontSize: 14,
  },
});
