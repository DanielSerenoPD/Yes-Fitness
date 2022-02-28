import React, {useContext, useEffect} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {Tabs} from './Tabs';

import {EditarPerfilScreen} from '../screens/perfilScreen/EditarPerfil/EditarPerfilScreen';
import {HistorialScreen} from '../screens/perfilScreen/Historial/HistorialScreen';
import {FavoritosScreen} from '../screens/perfilScreen/Favoritos/FavoritosScreen';
import {PaquetesScreen} from '../screens/perfilScreen/Paquetes/PaquetesScreen';
import {CanjearCodigoScreen} from '../screens/perfilScreen/CanjearCodigo/CanjearCodigoScreen';
import {CodigoReferirScreen} from '../screens/perfilScreen/CodigoReferir/CodigoReferirScreen';
import {BillingScreen} from '../screens/perfilScreen/Billing/BillingScreen';
import {Terminos} from '../screens/perfilScreen/Terminos/Terminos';
import {Politicas} from '../screens/perfilScreen/Politicas/Politicas';
import {AyudaScreen} from '../screens/perfilScreen/Ayuda/AyudaScreen';
import {EstudioScreen} from '../screens/InicioScreen/EstudioScreen';

import {CheckOutScreen} from '../screens/perfilScreen/Paquetes/CheckOutScreen';
import {CheckOutScreenStandar} from '../screens/perfilScreen/Paquetes/CheckOutScreenStandar';
import {CheckOutScreenPremium} from '../screens/perfilScreen/Paquetes/CheckOutScreenPremium';
import {PagoCompletadoScreen} from '../screens/perfilScreen/Paquetes/PagoCompletadoScreen';
import {ApartarClaseScreen} from '../screens/buscarScreen/ApartarClaseScreen';
import {CancelarClaseScreen} from '../screens/buscarScreen/CancelarClaseScreen';
import {ReservaExitosaScreen} from '../screens/buscarScreen/ReservaExitosaScreen';

import {FiltrosScreen} from '../screens/buscarScreen/FiltrosScreen';
import {HorariosEstudioScreen} from '../screens/InicioScreen/HorariosEstudioScreen';
import {ReservaCanceladaScreen} from '../screens/buscarScreen/ReservaCanceladaScreen';
import {ApartarClaseGenericoScreen} from '../screens/buscarScreen/ApartarClaseGenericoScreen';
import {NuevoUsuario} from '../screens/InicioScreen/NuevoUsuario';
import {EstudioScreen2} from '../screens/buscarScreen/EstudioScreen2';
import {BuscarEstudioScreen} from '../screens/buscarScreen/BuscarEstudioScreen';
import WView from '../screens/WebView'

export type RootStackParams = {
  TabGeneral: undefined;

  PaisesListaScreenLogueado: undefined;
  EditarPerfilScreen: undefined;
  HistorialScreen: undefined;
  FavoritosScreen: undefined;
  PaquetesScreen: undefined;
  CanjearCodigoScreen: undefined;
  CodigoReferirScreen: undefined;
  BillingScreen: undefined;
  Terminos: undefined;
  Politicas: undefined;
  AyudaScreen: undefined;
  CheckOutScreen: undefined;
  CheckOutScreenPremium: undefined;
  CheckOutScreenStandar: undefined;
  PagoCompletadoScreen: undefined;
  ApartarClaseScreen: undefined;
  CancelarClaseScreen: undefined;
  FiltrosScreen: undefined;
  HorariosEstudioScreen: undefined;
  ReservaExitosaScreen: undefined;
  ReservaCanceladaScreen: undefined;
  ApartarClaseGenericoScreen: undefined;
  NuevoUsuario: undefined;
  EstudioScreen2: undefined;
  BuscarEstudioScreen: undefined;

  //informacion
  EstudioScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const StackGeneral = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen name="TabGeneral" component={Tabs} />

      {/* Stack de Inicio ***************************/}

      {/* Screen de inicio */}
      <Stack.Screen name="EstudioScreen" component={EstudioScreen} />
      <Stack.Screen name="EstudioScreen2" component={EstudioScreen2} />
      <Stack.Screen
        name="HorariosEstudioScreen"
        component={HorariosEstudioScreen}
      />
      <Stack.Screen
        name="ApartarClaseGenericoScreen"
        component={ApartarClaseGenericoScreen}
      />

      <Stack.Screen name="NuevoUsuario" component={NuevoUsuario} />

      {/* Stack de Busqueda **************************/}
      <Stack.Screen name="ApartarClaseScreen" component={ApartarClaseScreen} />
      <Stack.Screen name="FiltrosScreen" component={FiltrosScreen} />
      <Stack.Screen
        name="ReservaExitosaScreen"
        component={ReservaExitosaScreen}
      />
      <Stack.Screen
        name="ReservaCanceladaScreen"
        component={ReservaCanceladaScreen}
      />

      <Stack.Screen
        name="BuscarEstudioScreen"
        component={BuscarEstudioScreen}
      />

      {/* Stack de Proximas **************************/}
      <Stack.Screen
        name="CancelarClaseScreen"
        component={CancelarClaseScreen}
      />

      {/* Stack de perfil *****************************/}

      {/* Editar Perfil */}
      <Stack.Screen name="EditarPerfilScreen" component={EditarPerfilScreen} />

      {/* Historial*/}
      <Stack.Screen name="HistorialScreen" component={HistorialScreen} />

      {/* Favoritos*/}
      <Stack.Screen name="FavoritosScreen" component={FavoritosScreen} />

      {/* Paquetes*/}
      <Stack.Screen name="PaquetesScreen" component={PaquetesScreen} />
      {/* Checkout*/}
      <Stack.Screen name="CheckOutScreen" component={CheckOutScreen} />
      <Stack.Screen name="CheckOutScreenStandar" component={CheckOutScreenStandar} />
      <Stack.Screen name="CheckOutScreenPremium" component={CheckOutScreenPremium} />
      
      {/* Pago completado*/}
      <Stack.Screen
        name="PagoCompletadoScreen"
        component={PagoCompletadoScreen}
      />

      {/* Canjear Codigo*/}
      <Stack.Screen
        name="CanjearCodigoScreen"
        component={CanjearCodigoScreen}
      />

      {/* Referir Codigo*/}
      <Stack.Screen
        name="CodigoReferirScreen"
        component={CodigoReferirScreen}
      />

      {/* Billing*/}
      <Stack.Screen name="BillingScreen" component={BillingScreen} />

      {/* Ayuda*/}
      <Stack.Screen name="AyudaScreen" component={AyudaScreen} />

      {/* Terminos*/}
      <Stack.Screen name="Terminos" component={Terminos} />

      {/* Politicas*/}
      <Stack.Screen name="Politicas" component={Politicas} />
    </Stack.Navigator>
  );
};
