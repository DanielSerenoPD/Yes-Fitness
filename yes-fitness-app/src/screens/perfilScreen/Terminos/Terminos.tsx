import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import HeaderLogo from '../../../components/Header/HeaderLogo';

interface Props extends StackScreenProps<any, any> {}

export const Terminos = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8, marginHorizontal: 24}}>
      {/*  */}
      <HeaderLogo
        tieneFlecha={true}
        action={() => {
          navigation.pop();
        }}
      />

      {/* Paquetes */}
      <ScrollView style={{paddingTop: 5, marginTop: 43.3}}>
        {/*Titulos  */}

        <Text style={styles.titulo1}>YES S.A. de C.V.</Text>

        <Text style={styles.texto}>
          In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam
          dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus.
          Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
          Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
          Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
          Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.
          Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur
          ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.
        </Text>

        <Text style={styles.texto}>
          Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper
          libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc,
          blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio
          et ante tincidunt tempus. Donec vitae sapien.
        </Text>

        <Text style={styles.texto}>
          Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
          Phasellus viverra nulla ut metus varius laoreet.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 20,

    marginBottom: 25,
    color: '#0B0B0B',
  },
  texto: {
    fontSize: 16,
    lineHeight: 24,
    color: '#909090',
    marginBottom: 30,
  },
});
