import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {styles} from '../../theme/appTheme';

interface Datos {
  texto: string | number;
  icono: object;
}

export const BotonInformacion = ({texto, icono}: Datos) => {
  return (
    <View
      style={{
        marginTop: 22,
        flexDirection: 'row',
      }}>
      <View
        style={{
          ...styles.colorBackground,
          flex: 1,
          borderRadius: 10,

          padding: 9,
          flexDirection: 'row',
        }}>
        {icono}

        <Text
          style={{
            marginLeft: 12,
            ...styles.fontRegular,
            ...styles.color3,
            fontSize: 17,
          }}>
          {texto}
        </Text>
      </View>
    </View>
  );
};
