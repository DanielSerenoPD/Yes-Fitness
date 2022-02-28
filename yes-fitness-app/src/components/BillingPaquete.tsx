import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {stylesYes} from '../theme/appTheme';

interface Props {
  nombrePaquete: string;
  fechaCompra: string;
  fechaExpiracion: string;
  idNumero: string;
  clasesDisponibles: number;
}

export const BillingPaquete = ({
  nombrePaquete,
  fechaCompra,
  fechaExpiracion,
  idNumero,
  clasesDisponibles,
}: Props) => {
  return (
    <View style={styles.container}>
      {/* Caja 1 */}

      <View style={styles.caja1}>
        <Text style={styles.nombrePaquete}>{nombrePaquete}</Text>

        {/*  */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 11,
          }}>
          <Text style={styles.textoCompra}>{`Compra: ${fechaCompra}`}</Text>

          {/* Leyenda de activo */}
          <View style={styles.containerCirculoVerde}>
            <View style={styles.circuloVerde}></View>

            <Text style={styles.circuloVerdeTexto}>Activo</Text>
          </View>
        </View>

        {/*  */}

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.textoExpiracion}>
            {`Expiración: ${fechaExpiracion}`}
          </Text>

          <Text style={styles.textoExpiracion}>{`ID-${idNumero}`}</Text>
        </View>
      </View>

      {/* Caja 2 */}
      <View style={styles.caja2}>
        <Text
          style={{
            fontSize: 14,
          }}>{`Clases disponibles: ${clasesDisponibles}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...stylesYes.containerStyle,
    height: 178,

    borderColor: '#828282',
  },
  nombrePaquete: {
    color: 'black',
    fontSize: 22,
    marginBottom: 16,
  },
  caja1: {
    paddingTop: 17.4,
    paddingLeft: 29,
    paddingRight: 35,
    paddingBottom: 18.6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#828282',
  },
  caja2: {
    paddingLeft: 29,
    paddingTop: 21,
  },

  textoCompra: {
    fontSize: 12,
    color: 'black',
  },
  textoExpiracion: {
    fontSize: 12,
    color: '#909090',
  },
  containerCirculoVerde: {
    flexDirection: 'row',

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
});
