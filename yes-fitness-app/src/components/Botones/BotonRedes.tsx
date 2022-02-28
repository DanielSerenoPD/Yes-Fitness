import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface Props {
  action: () => void;
  logo: any;
}

export const BotonRedes = ({action, logo}: Props) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={styles.circuloBlanco}
      activeOpacity={0.8}>
      {logo}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circuloBlanco: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 69,
    height: 69,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    borderRadius: 100,
    shadowRadius: 6,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#e3e3e3',
  },
});
