import React, {useEffect, useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Platform, StatusBar, Text, View} from 'react-native';
import {styles} from '../theme/appTheme';

import Inicio from '../../assets/imagenes/iconos-navigator/Inicio.svg';
import Buscar from '../../assets/imagenes/iconos-navigator/Buscar.svg';

import Proximas from '../../assets/imagenes/iconos-navigator/Proximas.svg';

import Perfil from '../../assets/imagenes/iconos-navigator/Perfil.svg';

import {PerfilScreen} from '../screens/perfilScreen/PerfilScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Badge} from 'react-native-paper';

import {TabInicioScreen} from '../screens/InicioScreen/TabInicioScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TabProximasScreen} from '../screens/ProximasScreen/TabProximasScreen';
import {TabBuscarScreen} from '../screens/buscarScreen/TabBuscarScreen';

const BottomTabIOS = createBottomTabNavigator();

export const Tabs = () => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('datos: ' + insets.bottom);
  }, []);
  return (
    <BottomTabIOS.Navigator
      sceneContainerStyle={{backgroundColor: 'white'}}
      screenOptions={({route}) => ({
        tabBarInactiveTintColor: '#C3C3C3',
        tabBarActiveTintColor: '#0B0B0B',
        tabBarStyle: {
          borderTopColor: '#e3e3e6',
          borderTopWidth: 1,
          elevation: 0,

          height: Platform.OS === 'ios' ? 92 : 78,
          paddingBottom: Platform.OS === 'ios' ? 16 : 0,
        },
        tabBarLabelStyle: {
          ...styles.fontBold,

          fontSize: 10,
        },

        tabBarIcon: ({color, focused, size}) => {
          let iconName: object = (
            <Inicio color="#1DF0CD" fill="#1DF0CD"></Inicio>
          );

          switch (route.name) {
            case 'Tab1':
              iconName = (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{alignItems: 'center'}}>
                  <Inicio color={color} />
                  <Text
                    style={{
                      color: color,
                      fontSize: 12,
                      marginTop: 6.4,
                    }}>
                    Inicio
                  </Text>
                </TouchableOpacity>
              );
              break;
            case 'Tab2':
              iconName = (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {}}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Buscar color={color} />
                  <Text
                    style={{
                      color: color,
                      fontSize: 12,
                      marginTop: 6.4,
                    }}>
                    Buscar
                  </Text>
                </TouchableOpacity>
              );

              break;
            case 'Tab3':
              iconName = (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{alignItems: 'center'}}>
                  <Proximas color={color} />
                  <Text
                    style={{
                      color: color,
                      fontSize: 12,
                      marginTop: 6.4,
                    }}>
                    Próximas
                  </Text>
                </TouchableOpacity>
              );
              break;

            case 'Tab5':
              iconName = (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{alignItems: 'center'}}>
                  <Perfil color={color} />
                  <Text
                    style={{
                      color: color,
                      fontSize: 12,
                      marginTop: 6.4,
                    }}>
                    Perfil
                  </Text>
                </TouchableOpacity>
              );
              break;

            default:
              break;
          }

          return iconName;
        },
      })}>
      <BottomTabIOS.Screen
        name="Tab1"
        options={{headerShown: false, tabBarShowLabel: false}}
        component={TabInicioScreen}
      />
      <BottomTabIOS.Screen
        name="Tab2"
        options={{tabBarShowLabel: false, headerShown: false}}
        component={TabBuscarScreen}
      />

      <BottomTabIOS.Screen
        name="Tab3"
        options={{tabBarShowLabel: false, headerShown: false}}
        component={TabProximasScreen}
      />

      <BottomTabIOS.Screen
        name="Tab5"
        options={{tabBarShowLabel: false, headerShown: false}}
        component={PerfilScreen}
      />
    </BottomTabIOS.Navigator>
  );
};
