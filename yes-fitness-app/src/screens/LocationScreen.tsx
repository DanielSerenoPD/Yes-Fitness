import React, {useContext} from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {PermissionsContext} from '../context/Permissions/PermissionsContext';

import LinearGradient from 'react-native-linear-gradient';

export const LocationScreen = () => {
  const {askLocationPermission} = useContext(PermissionsContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {/* Titulos */}
      <View>
        <View
          style={{
            alignSelf: 'center',
            width: 350,
            height: 350,
            marginTop: 40,
          }}>
          {/* <AnimatedLottieView
            source={require('../../assets/lottie/location_2.json')}
            autoPlay
            loop
          /> */}
        </View>

        <Text
          style={{
            fontSize: 28,
            color: 'black',
            marginBottom: 10,
            textAlign: 'center',
          }}>
          Activar mi ubicacion
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: '#7a7a7a',
            textAlign: 'center',
          }}>
          Activa tu ubicacion para poder usar la app correctamente
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          askLocationPermission(() => {});
        }}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: Platform.OS == 'ios' ? 70 : 40,

          paddingHorizontal: 14,
        }}>
        <LinearGradient
          colors={['black', 'black']}
          start={{x: 1.0, y: 0.0}}
          end={{x: 0.0, y: 0.0}}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,

            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 17,
              color: 'white',
            }}>
            Permitir Localizacion
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
