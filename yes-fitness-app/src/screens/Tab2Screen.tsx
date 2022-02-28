import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Mapa from '../../assets/imagenes/iconos/location.svg';
import {AuthContext} from '../context/AuthContext';

export const Tab2Screen = () => {
  const {authState, changeIcon} = useContext(AuthContext);

  return <SafeAreaView></SafeAreaView>;
};
