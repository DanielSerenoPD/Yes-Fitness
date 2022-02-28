import React, {useEffect, useState, useContext} from 'react';
import {AuthContext, AuthProvider} from './src/context/AuthContext';

import {PermissionsContext} from './src/context/Permissions/PermissionsContext';
import {StackGeneral} from './src/navigator/StackGeneral';
import {StackLogin} from './src/navigator/StackLogin';
import {StackTutorial} from './src/navigator/StackTutorial';
import {CargandoExample} from './src/screens/CargandoExample';
import {LocationScreen} from './src/screens/LocationScreen';
import SplashScreen from 'react-native-splash-screen';

export const Home = () => {
  const {permissions} = useContext(PermissionsContext);
  const {usuarioAutenticado, completoTutorial} = useContext(AuthContext);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Primer paso: se valida el token de firebase y luego se valida
  // que se hayan bajado los datos de usuario

  if (usuarioAutenticado === null) return <CargandoExample></CargandoExample>;

  if (usuarioAutenticado === false) return <StackLogin />;

  // Segundo paso: si el primer paso es validado, se verifica
  // si el usuario ya tomo el tutorial (almacenado en una variable de firebas)
  // si ya se tomo se dirige a la app y si no se dirige al tutorial
  // una vez finalizado el tutorial la variable de firebase se cambia a true
  // dejando validado que el usuario ya tomo el tutorial

  if (usuarioAutenticado === true && completoTutorial === true) {
    if (permissions.locationStatus !== 'granted') {
      return <LocationScreen />;
    } else {
      return <StackGeneral />;
    }
  } else {
    return <StackTutorial />;
  }
};
