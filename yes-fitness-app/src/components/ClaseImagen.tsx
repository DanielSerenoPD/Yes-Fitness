import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {stylesYes} from '../theme/appTheme';
import {FadeInImage} from './FadeInImage';

interface Props {
  nombreEstudio: string;
  nombreClase: string;
  urlFoto: string;
  direccionNombre: string;
  horario: string;
  nombreCoach?: string;

  action: () => void;
}

export const ClaseImagen = ({
  nombreEstudio,
  nombreClase,
  urlFoto,
  direccionNombre,
  horario,
  nombreCoach,
  action,
}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={action} activeOpacity={0.8}>
        <FadeInImage uri={urlFoto} style={styles.sucursalFoto} />
      </TouchableOpacity>
      <Text style={styles.texto1}>{nombreClase}</Text>
      <Text style={styles.texto2}>{nombreEstudio}</Text>
      <Text style={styles.texto2}>{direccionNombre}</Text>
      <Text style={styles.texto2}>{nombreCoach}</Text>

      {/* Boton Hota */}
      <View style={styles.botonContainer}>
        <Text style={styles.botonTexto}>{`Hoy · ${horario.slice(0, -2)}${horario
          .slice(-2)
          .toUpperCase()}`}</Text>
      </View>
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
    lineHeight: 20,
  },
  botonContainer: {
    ...stylesYes.containerStyle,
    width: 118,
    height: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14.5,
    borderRadius: 3,
    borderWidth: 0.5,
  },
  botonTexto: {
    fontSize: 14,
    color: '#0B0B0B',
  },
});
