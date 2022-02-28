import React, {useContext} from 'react';
import {View, Text, Button, SafeAreaView, TouchableOpacity} from 'react-native';
import {Map} from '../../components/Map';
import {StackScreenProps} from '@react-navigation/stack';
import {styles} from '../../theme/appTheme';
import LocationLight from '../../../assets/imagenes/iconos-otros/Location.svg';
import Filter from '../../../assets/imagenes/iconos-otros/Filter.svg';
import {AuthContext} from '../../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}
export const MapaScreen = ({navigation}: Props) => {
  const {datosUsuario} = useContext(AuthContext);

  const paisYestado = `${datosUsuario.estado}, ${datosUsuario.pais}`.slice(
    0,
    20,
  );

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        {/* Primer Div */}
        <View style={{...styles.globalMargin}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* Letras del header */}
            <View>
              <Text style={{...styles.fontBold, fontSize: 34, color: 'black'}}>
                Mapa
              </Text>
            </View>
          </View>

          {/* Segundo Div */}
          <View
            style={{
              marginTop: 12,
              marginBottom: 22,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PaisScreen2Logueado', {
                  tipo: 'logueado',
                  paisOriginal: datosUsuario.pais,
                  estadoOriginal: datosUsuario.estado,
                });
              }}
              style={{
                ...styles.colorBackground,
                flex: 1,
                borderRadius: 10,

                padding: 9,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <LocationLight style={{marginRight: 4}}></LocationLight>

                <Text
                  style={{
                    ...styles.fontRegular,
                    ...styles.color3,
                    fontSize: 17,
                  }}>
                  {paisYestado + (paisYestado.length > 19 ? '...' : '')}
                </Text>
              </View>

              <Filter />
            </TouchableOpacity>
          </View>
        </View>
        <Map navigation={navigation} />

        {/* Tinder Cards */}
      </SafeAreaView>
      {/* <PantallaTinder /> */}
    </View>
  );
};
