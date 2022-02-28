import React, {useEffect, useState, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View} from 'react-native';
import {AuthContext, AuthProvider} from './src/context/AuthContext';

import auth from '@react-native-firebase/auth';
import {PermissionsProvider} from './src/context/Permissions/PermissionsContext';
import {CargandoExample} from './src/screens/CargandoExample';
import {Home} from './Home';
export const App = () => {
  return (
    <NavigationContainer>
      {/* <StackNavigator /> */}
      <AppState>
        {/* En home se encuentra la logica para verificar a que 
        pantalla navegar dependiendo de si el usuario esta autenticado o no
        */}
        <Home />
      </AppState>
    </NavigationContainer>
  );
};

const AppState = ({children}: any) => {
  return (
    <PermissionsProvider>
      <AuthProvider>{children}</AuthProvider>
    </PermissionsProvider>
  );
};

export default App;
