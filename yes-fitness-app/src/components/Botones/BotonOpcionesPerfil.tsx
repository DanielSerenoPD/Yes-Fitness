import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import FlechaDerecha from '../../../assets/imagenes/utiles/FlechaDerecha.svg';

interface Props {
  //funcion que te manda a otra screen
  action: () => void;
  logo: any;
  texto: string;
}
export const BotonOpcionesPerfil = ({texto, action, logo}: Props) => {
  return (
    <TouchableOpacity
      onPress={action}
      activeOpacity={0.6}
      style={styles.container}>
      {/*  */}
      <View style={{flexDirection: 'row'}}>
        {/*Logo  */}
        {logo}
        {/* <Historial fill="black" style={{marginRight: 23}} /> */}
        <Text style={styles.texto}>{texto}</Text>
      </View>

      <View style={{justifyContent: 'center'}}>
        <FlechaDerecha fill="black" />
      </View>
      {/*  */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 37,
  },
  texto: {
    alignSelf: 'center',
    fontSize: 18,
  },
});
