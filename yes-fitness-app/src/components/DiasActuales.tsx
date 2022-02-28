import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

interface Props {
  fecha: string;
  datos: {};
  action: () => void;
  activo: boolean;
  esUltimo?: boolean;
}

export const DiasActuales = ({
  fecha,
  datos,
  action,
  activo,
  esUltimo,
}: Props) => {
  return (
    <>
      <TouchableOpacity
        onPress={action}
        activeOpacity={0.6}
        style={activo ? styles.containerActivo : styles.container}>
        <Text
          style={activo ? styles.textoFechaActivo : styles.textoFechaInactivo}>
          {fecha}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 39,
    height: 25,
    marginLeft: 23,
    marginRight: 12,
  },

  containerActivo: {
    width: 39,
    height: 25,
    marginLeft: 23,
    marginRight: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  containerUltimo: {
    width: 39,
    height: 25,
    marginLeft: 23,
    marginRight: 23,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  textoFechaInactivo: {
    textAlign: 'center',
    fontSize: 12,
    color: '#C3C3C3',
  },
  textoFechaActivo: {
    textAlign: 'center',
    fontSize: 12,
    color: '#0B0B0B',
  },
  linea: {
    backgroundColor: '#C3C3C3',
    height: 0.5,
  },
});
