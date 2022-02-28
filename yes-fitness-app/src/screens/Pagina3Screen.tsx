import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';

import {Button, Text, View} from 'react-native';
import {styles} from '../theme/appTheme';
import {RootStackParams} from '../navigator/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'Pagina3Screen'> {}

export const Pagina3Screen = ({route, navigation}: Props) => {
  const params = route.params;
  const {nombre, edad} = params;

  return (
    <View style={styles.globalMargin}>
      <Text>Pagina 3</Text>
      <Text>{nombre}</Text>
      <Text>{edad}</Text>
      <Button title="Regresar" onPress={() => navigation.pop()} />
      <Button title="Pagina 1" onPress={() => navigation.popToTop()} />
    </View>
  );
};
