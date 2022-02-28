import React, {createContext, useEffect, useReducer, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
  openSettings,
} from 'react-native-permissions';
//import RNRestart from 'react-native-restart';

export interface PermissionsState {
  locationStatus: PermissionStatus;
  storageStatus: PermissionStatus;
}

export const permissionsInitialState: PermissionsState = {
  locationStatus: 'unavailable',
  storageStatus: 'unavailable',
};

export interface PermissionsContextProps {
  permissions: PermissionsState;
  askLocationPermission: (action: any) => void;
  checkLocationPermission: () => void;
  // askStoragePermission: (action:any) => void;
  // checkStoragePermission: () => void;
}

//Creacion del contexto
export const PermissionsContext = createContext({} as PermissionsContextProps);

export const PermissionsProvider = ({children}: any) => {
  const [permissions, setPermissions] = useState(permissionsInitialState);

  useEffect(() => {
    //Cuando abres la app por primera vez
    checkLocationPermission();

    //Cuando pasas la aplicacion a segundo plano
    AppState.addEventListener('change', state => {
      //para volver a actualizar los datos por dia
      if (state === 'active') {
        //este reinicia la app cada que el usuarios
        //regresa del segundo plano
        //RNRestart.Restart();
      }

      if (state !== 'active') return;
      checkLocationPermission();
    });
  }, []);

  const askLocationPermission = async (action: any) => {
    let permisionStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      permisionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      console.log('presionado');
      permisionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    if (permisionStatus === 'blocked') {
      openSettings();
    }

    if (permisionStatus === 'granted') {
      action();
    }

    setPermissions({
      ...permissions,
      locationStatus: permisionStatus,
    });
  };

  const checkLocationPermission = async () => {
    let permisionStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      permisionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      console.log('presionado');
      permisionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    setPermissions({
      ...permissions,
      locationStatus: permisionStatus,
    });
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        askLocationPermission,
        checkLocationPermission,
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};
