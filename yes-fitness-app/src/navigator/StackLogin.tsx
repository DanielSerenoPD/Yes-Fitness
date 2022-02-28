import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {WelcomeScreen} from '../screens/loginScreen/WelcomeScreen';
import {LogInScreen} from '../screens/loginScreen/LogInScreen';
import {SignUpScreen} from '../screens/loginScreen/SignUpScreen';
import {RecuperarContraseña1} from '../screens/loginScreen/RecuperarContraseña1';
import {RecuperarContraseña2} from '../screens/loginScreen/RecuperarContraseña2';

export type RootStackParams = {
  WelcomeScreen: undefined;
  LogInScreen: undefined;
  SignUpScreen: undefined;
  RecuperarContraseña1: undefined;
  RecuperarContraseña2: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const StackLogin = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LogInScreen" component={LogInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen
        name="RecuperarContraseña1"
        component={RecuperarContraseña1}
      />
      <Stack.Screen
        name="RecuperarContraseña2"
        component={RecuperarContraseña2}
      />
    </Stack.Navigator>
  );
};
