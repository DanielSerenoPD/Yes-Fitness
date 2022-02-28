import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const HistorialClase = ({index, action, datos}: any) => {
  const formatearFechaHoy = () => {
    let fechaCantidad = new Date(datos.fechaFormatoHoyTiempo);

    let diaTexto = fechaCantidad.toLocaleDateString('es', {weekday: 'long'});
    let diaNumero = fechaCantidad.getDate();
    let diaNumeroResultado =
      diaNumero.toString().length === 1 ? `0${diaNumero}` : diaNumero;

    let mesTexto = fechaCantidad.toLocaleDateString('es', {month: 'long'});

    let diaTextoResultado =
      diaTexto.charAt(0).toUpperCase() + diaTexto.slice(1);

    let mesTextoResultado =
      mesTexto.charAt(0).toUpperCase() + mesTexto.slice(1);

    return `${diaTextoResultado.slice(
      0,
      3,
    )} ${diaNumeroResultado} ${mesTextoResultado.slice(0, 3)}`;
  };

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
        {/* Jue 10 Sep */}

        <Text style={styles.caja1Texto1}>{formatearFechaHoy()}</Text>
        <Text style={styles.caja2Texto1}>{datos.datosClase.categoria}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginBottom: 7,
          alignItems: 'center',
        }}>
        <Text style={styles.caja1Texto2}>{datos.horario}</Text>
        <Text style={styles.caja2Texto2}>{datos.nombreSucursal}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',
        }}>
        <Text style={styles.caja1Texto3}>
          {`${datos.datosHorario.duracion} min`}
        </Text>
        <Text
          style={
            styles.caja2Texto3
          }>{`Coach: ${datos.datosCoach.nombreCoach}`}</Text>
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
    color: '#0B0B0B',
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
