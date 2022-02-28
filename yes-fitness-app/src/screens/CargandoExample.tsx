import React from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';

export const CargandoExample = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          height: 200,
          width: 300,
          borderRadius: 10,
        }}>
        <LottieView
          source={require('../../assets/lottie/loader_yess.json')}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};
