import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import {Button, Text, View} from 'react-native';
import {styles} from '../theme/appTheme';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const Pagina2Screen = () => {
  const navigator = useNavigation<any>();

  useEffect(() => {
    navigator.setOptions({
      headerBackTitle: 'hola',
    });
  }, []);

  return (
    <View style={styles.globalMargin}>
      <Text>Pagina 2</Text>

      <TouchableOpacity
        onPress={() =>
          navigator.navigate('Pagina3Screen', {
            nombre: 'luis',
            edad: 20,
          })
        }>
        <View
          style={{
            marginTop: 20,
            padding: 20,
            backgroundColor: 'green',
            borderRadius: 30,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              color: 'white',
              fontWeight: 'bold',
            }}>
            Pagina 2
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
