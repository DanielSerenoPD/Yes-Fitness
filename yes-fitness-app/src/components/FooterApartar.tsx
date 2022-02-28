import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

type TipoBoton = 'apartar' | 'cancelar';

interface Props {
  textoBoton: string;
  action: () => void;
  tipo: TipoBoton;
  horaFormato: string;
  action2?: () => void;
}

export const FooterApartar = ({
  textoBoton,
  action,
  tipo,
  horaFormato,
  action2,
}: Props) => {
  return (
    <View style={styles.footerView}>
      <View>
        <Text style={styles.texto1}>{horaFormato}</Text>
        <TouchableOpacity onPress={action2} activeOpacity={0.6}>
          <Text style={styles.texto2}>Ver más horarios</Text>
        </TouchableOpacity>
      </View>

      {/* Boton */}
      <TouchableOpacity
        activeOpacity={0.6}
        style={tipo === 'apartar' ? styles.botonNegro : styles.botonRojo}
        onPress={action}>
        <Text style={tipo === 'apartar' ? styles.textButon : styles.textRojo}>
          {textoBoton}
        </Text>
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
  texto1: {
    fontSize: 14,
    color: 'black',
    marginBottom: 3,
  },
  texto2: {
    color: '#909090',
    textDecorationLine: 'underline',
    fontSize: 14,
  },

  botonNegro: {
    width: 180,
    height: 50,
    borderRadius: 6,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButon: {
    color: 'white',
    fontSize: 14,
  },
  botonRojo: {
    width: 180,
    height: 50,
    borderRadius: 6,

    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#D70915',
  },
  textRojo: {
    color: '#D90000',
    fontSize: 14,
  },
});
