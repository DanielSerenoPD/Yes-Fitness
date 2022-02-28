import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

interface Props {
  title: string;
  action?: () => void;
  icono?: any;
}

export const BotonNegro = ({title, action, icono}: Props) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={styles.botonStyle}
      activeOpacity={0.8}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {icono}
        <Text style={styles.botonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botonStyle: {
    backgroundColor: '#000000',
    width: '100%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  botonText: {
    color: 'white',
    fontSize: 14,
  },
});
