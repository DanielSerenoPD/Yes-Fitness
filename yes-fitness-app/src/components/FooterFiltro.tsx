import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {BotonBlanco} from './Botones/BotonBlanco';

interface Props {
  action: () => void;
  action2: () => void;
}

export const FooterFiltro = ({action, action2}: Props) => {
  return (
    <View style={styles.footerView}>
      <TouchableOpacity
        style={styles.botonStyle}
        onPress={action}
        activeOpacity={0.6}>
        <Text style={styles.botonText}>Borrar filtros</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botonStyle2}
        onPress={action2}
        activeOpacity={0.6}>
        <Text style={styles.botonText2}>Aplicar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerView: {
    height: 131,
    borderTopWidth: 1,
    borderTopColor: '#e3e3e6',
    paddingHorizontal: 24,
    paddingTop: 21,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botonStyle: {
    borderWidth: 0.5,
    borderColor: '#000000',

    width: '49%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  botonText: {
    color: 'black',
    fontSize: 14,
  },
  botonStyle2: {
    backgroundColor: '#000000',
    width: '49%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  botonText2: {
    color: 'white',
    fontSize: 14,
  },
});
