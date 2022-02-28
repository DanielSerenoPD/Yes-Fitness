//Definir como luce la informacion que tendre aqui

import React, {createContext, useReducer} from 'react';
import {useAbrirModal} from '../hooks/useAbrirModal';
import useAutenticacion from '../hooks/useAutenticacion';
import {authReducer} from './authReducer';

export interface AuthState {
  isLoggedIn: boolean;
  userName?: string;
  favoriteIcon?: string;
}
// el signo de interrogacion es para definir que son opcionales

//Estado Inicial
// Undefined es como decir opcional no forzosamente las tienes que poner
export const authInitialState: AuthState = {
  isLoggedIn: false,
  userName: undefined,
  favoriteIcon: undefined,
};

// Lo usaremos para decirle a react como luce y que expone el context
export interface AuthContextProps {
  authState: AuthState;
  signIn: () => void;
  changeIcon: (nombre: string) => void;
  usuarioAutenticado: boolean | null;
  datosUsuario: any;
  setDatosUsuarioPerfil: any;
  completoTutorial: null | boolean;
  guardarCompletoTutorial: any;
  abrirModal: any;
  modal: boolean;

  abrirBottomSheet: any;
  bottomSheetModalRef: any;
  cerrarBottomSheet: any;
  datosMascotas: any[];

  arrayDias: any;
  setArrayDias: any;
  setArrayCategorias: any;
  arrayCategorias: any;

  diaSeleccionado: any;
  setDiaSeleccionado: any;
  categoriaSeleccionada: any;
  setCategoriaSeleccionada: any;
  clasesActivas: any;
  setClasesActivas: any;
  clasesPersonalizadas: any;
  setClasesPersonalizadas: any;
  clasesDescubrimientoSemanal: any;
  setClasesDescubrimientoSemanal: any;
  sucursalesCercanas: any;
  clasesActivasOriginal: any;
  setClasesActivasOriginal: any;
  datosRecargar: any;
  setDatosRecargar: any;
  setDatosRecargarFuturas: any;
  datosRecargarFuturas: any;
  clasesActivasFuturas: any;
  clasesActivasFuturasCopia: any;
  setClasesActivasFuturas: any;
  setClasesActivasFuturasCopia: any;
  traerMasDatosHoy: any;
  traerMasDatosFuturos: any;
  sucursales: any;
  setSucursales: any;
  setSucursalesFavoritas: any;
  sucursalesFavoritas: any;
  clasesRecomendadas: any;
  setClasesRecomendadas: any;
  proximasClases: any;
  setProximasClases: any;
  clasesDeLaSemana: any;
  setClasesDeLaSemana: any;
  diaSeleccionadoGenerico: any;
  setDiaSeleccionadoGenerico: any;
  filtrosQuery: any;
  setFiltrosQuery: any;
  filtroActivado: any;
  setFiltroActivado: any;
}

//Crear el contexto
export const AuthContext = createContext({} as AuthContextProps);

//componente provedor del estado
export const AuthProvider = ({children}: any) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  let {
    usuarioAutenticado,
    datosUsuario,
    setDatosUsuarioPerfil,
    completoTutorial,
    guardarCompletoTutorial,
    arrayDias,
    setArrayDias,
    setArrayCategorias,
    arrayCategorias,
    diaSeleccionado,
    setDiaSeleccionado,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    clasesActivas,
    setClasesActivas,
    clasesPersonalizadas,
    setClasesPersonalizadas,
    clasesDescubrimientoSemanal,
    setClasesDescubrimientoSemanal,
    sucursalesCercanas,
    clasesActivasOriginal,
    setClasesActivasOriginal,
    datosRecargar,
    setDatosRecargar,
    setDatosRecargarFuturas,
    datosRecargarFuturas,
    clasesActivasFuturas,
    clasesActivasFuturasCopia,
    setClasesActivasFuturas,
    setClasesActivasFuturasCopia,
    traerMasDatosHoy,
    traerMasDatosFuturos,
    sucursales,
    setSucursales,
    setSucursalesFavoritas,
    sucursalesFavoritas,
    clasesRecomendadas,
    setClasesRecomendadas,
    proximasClases,
    setProximasClases,
    clasesDeLaSemana,
    setClasesDeLaSemana,
    diaSeleccionadoGenerico,
    setDiaSeleccionadoGenerico,
    filtrosQuery,
    setFiltrosQuery,
    filtroActivado,
    setFiltroActivado,
  } = useAutenticacion();

  let {
    modal,
    abrirModal,

    abrirBottomSheet,
    bottomSheetModalRef,
    cerrarBottomSheet,
  } = useAbrirModal();

  const signIn = () => {
    dispatch({type: 'signIn'});
  };

  const changeIcon = (nombre: string) => {
    dispatch({type: 'changeIcon', payload: nombre});
  };

  return (
    <AuthContext.Provider
      value={{
        authState: authState,
        signIn: signIn,
        changeIcon: changeIcon,
        usuarioAutenticado,
        datosUsuario,
        setDatosUsuarioPerfil,
        completoTutorial,
        guardarCompletoTutorial,
        modal,

        abrirModal,

        abrirBottomSheet,
        bottomSheetModalRef,
        cerrarBottomSheet,
        arrayDias,
        setArrayDias,
        setArrayCategorias,
        arrayCategorias,
        diaSeleccionado,
        setDiaSeleccionado,
        categoriaSeleccionada,
        setCategoriaSeleccionada,
        clasesActivas,
        setClasesActivas,
        clasesPersonalizadas,
        setClasesPersonalizadas,
        clasesDescubrimientoSemanal,
        setClasesDescubrimientoSemanal,
        sucursalesCercanas,

        datosMascotas: [],
        clasesActivasOriginal,
        setClasesActivasOriginal,
        datosRecargar,
        setDatosRecargar,
        setDatosRecargarFuturas,
        datosRecargarFuturas,
        clasesActivasFuturas,
        clasesActivasFuturasCopia,
        setClasesActivasFuturas,
        setClasesActivasFuturasCopia,
        traerMasDatosHoy,
        traerMasDatosFuturos,
        sucursales,
        setSucursales,
        setSucursalesFavoritas,
        sucursalesFavoritas,
        clasesRecomendadas,
        setClasesRecomendadas,
        proximasClases,
        setProximasClases,
        clasesDeLaSemana,
        setClasesDeLaSemana,
        diaSeleccionadoGenerico,
        setDiaSeleccionadoGenerico,
        filtrosQuery,
        setFiltrosQuery,
        filtroActivado,
        setFiltroActivado,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
