import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {stylesYes} from '../theme/appTheme';

type TipoPaquete = 'normal' | 'activo' | 'promocion';

interface Props {
  texto1: string;
  texto2: string;
  texto3: string;
  tipoPaquete: TipoPaquete;

  //funcion para ir a la pantalla de checkout
  action?: () => void;
}

export const Paquete = ({
  texto1,
  texto2,
  texto3,
  tipoPaquete,
  action,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={action}
      activeOpacity={0.6}
      style={
        tipoPaquete === 'normal' ? styles.container : styles.containerActivo
      }>
      <Text style={styles.texto1}>{texto1}</Text>
      <Text style={styles.texto2}>{texto2}</Text>
      <Text style={styles.texto3}>{texto3}</Text>

      {/*Absolute View  */}

      {tipoPaquete === 'normal' ? (
        <></>
      ) : tipoPaquete === 'activo' ? (
        <BotonActivo />
      ) : (
        <BotonPromocion />
      )}
    </TouchableOpacity>
  );
};

const BotonActivo = () => (
  <View style={styles.containerCirculoVerde}>
    <View style={styles.circuloVerde}></View>

    <Text style={styles.circuloVerdeTexto}>Activo</Text>
  </View>
);

const BotonPromocion = () => (
  <View style={styles.botonPromocion}>
    <Text style={styles.botonPromocionTexto}>Promoción</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderColor: '#828282',
    ...stylesYes.containerStyle,
    height: 145,
    marginBottom: 10,
    paddingLeft: 31,
    paddingTop: 29,
  },
  containerActivo: {
    borderColor: '#2DD75C',
    ...stylesYes.containerStyle,
    height: 145,
    marginBottom: 10,
    paddingLeft: 31,
    paddingTop: 29,
  },
  texto1: {
    fontSize: 16,
    marginBottom: 8,
  },
  texto2: {
    fontSize: 28,
    marginBottom: 11,
    fontWeight: '300',
  },
  texto3: {
    fontSize: 14,
    color: '#909090',
  },

  containerCirculoVerde: {
    flexDirection: 'row',
    position: 'absolute',
    right: 20,
    top: 19,
    alignItems: 'center',
  },

  circuloVerde: {
    width: 10,
    height: 10,
    backgroundColor: '#1AD955',
    marginRight: 6,
    borderRadius: 100,
  },
  circuloVerdeTexto: {
    fontSize: 12,
    color: '#1AD955',
    fontWeight: '500',
  },

  botonPromocion: {
    width: 87,
    height: 31,
    borderWidth: 1,
    borderColor: '#1AD955',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 3,
  },
  botonPromocionTexto: {
    fontSize: 12,
    color: '#1AD955',
  },
});
