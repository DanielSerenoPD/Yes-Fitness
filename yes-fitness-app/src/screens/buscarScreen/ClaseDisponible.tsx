import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const ClaseDisponible = ({index, action, dato}: any) => {
  return (
    <TouchableOpacity
      onPress={action}
      activeOpacity={0.6}
      style={
        index === 0
          ? {...styles.container, borderTopColor: 'white'}
          : styles.container
      }>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 7,
          alignItems: 'center',
        }}>
        <Text style={styles.caja1Texto1}>{dato.horario}</Text>
        <Text style={styles.caja2Texto1}>{dato.datosClase.categoria}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginBottom: 7,
          alignItems: 'center',
        }}>
        <Text
          style={
            styles.caja1Texto2
          }>{`${dato.datosHorario.duracion} min`}</Text>
        <Text style={styles.caja2Texto2}>{dato.nombreSucursal}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginBottom: 3,
          alignItems: 'center',
        }}>
        <Text style={styles.caja1Texto3}></Text>
        <Text
          style={
            styles.caja2Texto3
          }>{`Coach: ${dato.datosCoach.nombreCoach}`}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',
        }}>
        <Text style={styles.caja1Texto3}></Text>
        <Text style={styles.caja2Texto3}>
          {`${dato.distancia} km de distancia`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    paddingTop: 15,
    paddingHorizontal: 24,
    borderTopWidth: 0.5,
    borderTopColor: '#C3C3C3',
  },
  //   caja1: {width: 81},
  caja1Texto1: {
    fontSize: 14,
    color: '#0B0B0B',
    width: 71,
    marginRight: 53,
  },
  caja1Texto2: {
    fontSize: 14,
    color: '#909090',
    width: 71,
    marginRight: 53,
  },
  caja1Texto3: {
    fontSize: 14,
    width: 71,
    color: '#909090',
    marginRight: 53,
  },
  caja2: {},
  caja2Texto1: {
    fontSize: 20,
    color: '#0B0B0B',
  },
  caja2Texto2: {
    fontSize: 18,
    color: '#909090',
  },
  caja2Texto3: {
    fontSize: 12,
    color: '#909090',
  },
});
