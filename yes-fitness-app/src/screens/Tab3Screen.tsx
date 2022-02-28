import React, {useContext} from 'react';
import {View, Text, Button, SafeAreaView} from 'react-native';
import {Map} from '../components/Map';
import {StackScreenProps} from '@react-navigation/stack';
import {styles} from '../theme/appTheme';
import AnimatedLottieView from 'lottie-react-native';
import LocationLight from '../../assets/imagenes/iconos-otros/Location.svg';
import Filter from '../../assets/imagenes/iconos-otros/Filter.svg';
import {AuthContext} from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}
export const Tab3Screen = ({navigation}: Props) => {
  const {datosUsuario} = useContext(AuthContext);
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        {/* Primer Div */}
        <View style={{...styles.globalMargin}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* Letras del header */}
            <View>
              <Text style={{...styles.fontBold, fontSize: 34, color: 'black'}}>
                Adoptados
              </Text>
              <Text
                style={{
                  ...styles.fontMedium,
                  ...styles.color1,
                  fontSize: 17,
                }}>
                {'Conoce las estadisticas en el mundo'}
              </Text>
            </View>
            {/*  */}
          </View>
          <View style={{flex: 1}}>
            <View
              style={{
                aspectRatio: 1,
                alignSelf: 'center',
                width: 300,
                height: 250,
                marginTop: 25,
              }}>
              <AnimatedLottieView
                style={{
                  width: 150,

                  flexGrow: 1,
                  alignSelf: 'center',
                }}
                resizeMode="cover"
                source={require('../../assets/lottie/earth.json')}
                autoPlay
                loop
              />
            </View>
            <View
              style={{
                backgroundColor: '#F2F2F2',
                height: 102,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 14,
                width: 260,
                alignSelf: 'center',
              }}>
              <Text style={{color: 'black', ...styles.fontBold, fontSize: 22}}>
                Perros Subidos
              </Text>
              <Text
                style={{color: '#B0B0B0', ...styles.fontBold, fontSize: 22}}>
                0
              </Text>
            </View>

            <View
              style={{
                backgroundColor: 'black',
                height: 102,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 14,
                width: 260,
                alignSelf: 'center',
                marginTop: 20,
              }}>
              <Text style={{color: 'white', ...styles.fontBold, fontSize: 22}}>
                Perros Adoptados
              </Text>
              <Text
                style={{color: '#B0B0B0', ...styles.fontBold, fontSize: 22}}>
                0
              </Text>
            </View>
          </View>
        </View>

        {/* Tinder Cards */}
      </SafeAreaView>
      {/* <PantallaTinder /> */}
    </View>
  );
};
