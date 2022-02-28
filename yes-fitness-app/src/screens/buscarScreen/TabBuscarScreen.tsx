import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HeaderLogo from '../../components/Header/HeaderLogo';
import LupaChica from '../../../assets/imagenes/utiles/LupaChica.svg';
import Ajustes from '../../../assets/imagenes/utiles/Ajustes.svg';

//clases

import {HistorialClase} from '../../components/HistorialClase';
import {ClaseDisponible} from './ClaseDisponible';
import MapView from 'react-native-maps';
import {DiasActuales} from '../../components/DiasActuales';
import {AuthContext} from '../../context/AuthContext';
import {StackScreenProps} from '@react-navigation/stack';
import {Categorias} from '../../components/Categorias';
import {verificadorClaseHorario} from '../../funciones/verificadorClaseHorario';
import {filtrarClasesActivas} from '../../funciones/filtrarClasesActivas';
import {filtrarCategoriasClase} from '../../funciones/filtrarCategoriasClase';
import useFuncionesFirebase from '../../hooks/useFuncionesFirebase';

interface Props extends StackScreenProps<any, any> {}

export const TabBuscarScreen = ({navigation}: Props) => {
  const {
    arrayDias,
    setArrayDias,
    diaSeleccionado,
    setDiaSeleccionado,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    clasesActivas,
    setClasesActivas,
    clasesActivasOriginal,
    clasesActivasFuturas,
    clasesActivasFuturasCopia,
    setClasesActivasFuturas,
    traerMasDatosHoy,
    datosRecargar,
    traerMasDatosFuturos,
    datosRecargarFuturas,
    filtroActivado,
  } = useContext(AuthContext);

  let {traerMasDatosFuturosFiltro, traerMasDatosHoyFiltro} =
    useFuncionesFirebase();

  const insets = useSafeAreaInsets();

  //esta variable se encarga de monitorear si el dia actual es el de hoy
  // o si es un dia futuro
  const [diaVerificador, setDiaVerificador] = useState(true);

  useEffect(() => {
    console.log(insets.top);
  }, []);

  return (
    <View style={{flex: 1, marginTop: insets.top + 19.8}}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor="white"
      />
      {/* Header */}

      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate('BuscarEstudioScreen');
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <LupaChica fill="black" />
          <Text style={styles.barraBusquedaText}>Buscar clase o estudio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('FiltrosScreen')}
          activeOpacity={0.6}>
          <Ajustes fill="black" />
        </TouchableOpacity>
      </View>

      {/* Linea */}
      <View style={styles.linea} />

      {/* Categorias de las clases */}
      <View>
        <ScrollView
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: '#C3C3C3ed',
            paddingBottom: 20,
          }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
          <Categorias />
        </ScrollView>
        {/* Linea */}
      </View>

      {/* Dias de las clases acomodados por fecha */}
      <View>
        <ScrollView
          style={{
            marginTop: 11,
            borderBottomWidth: 0.5,
            borderBottomColor: '#C3C3C3ed',
          }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
          {arrayDias.map((dato: any, i: number) =>
            i + 1 === arrayDias.length ? (
              <DiasActuales
                fecha={dato.fecha}
                datos={{}}
                action={() => {
                  //esta funcion sirve para actualizar a activo
                  // el dia que se selecciona
                  if (i !== diaSeleccionado.id) {
                    let ejemplo = [...arrayDias];
                    ejemplo[i] = {
                      ...arrayDias[i],
                      activo: true,
                    };

                    //actualizamos el dia seleccionado
                    ejemplo[diaSeleccionado.id] = {
                      ...arrayDias[diaSeleccionado.id],

                      activo: false,
                    };

                    //sacamos la hora actual
                    const tiempoActual: any = new Date();

                    setArrayDias(ejemplo);
                    setDiaSeleccionado({
                      ...arrayDias[i],
                      activo: true,
                      horaActual:
                        tiempoActual.getHours() +
                        tiempoActual.getMinutes() / 100,
                      id: i,
                    });

                    const resultadoFiltrado = filtrarClasesActivas(
                      clasesActivasOriginal,
                      arrayDias[i].fechaFormato,
                    );

                    setClasesActivas(resultadoFiltrado);
                  }
                }}
                activo={dato.activo}
                key={i}
                esUltimo
              />
            ) : (
              <DiasActuales
                fecha={dato.fecha}
                datos={{}}
                action={() => {
                  if (i !== diaSeleccionado.id) {
                    //Aqui pueden pasar dos cosas
                    //que el dia elegido sea el dia de hoy
                    // o que el dia elegido sea un dia futuro osea
                    // cualquier otro dia menos hoy

                    //sacamos el formato de fecha actual
                    const tiempoActual: any = new Date();

                    let esHoy: boolean;

                    if (
                      arrayDias[i].fechaFormato.toLocaleDateString() ===
                      tiempoActual.toLocaleDateString()
                    ) {
                      //significa que el dia elegido es el de hoy
                      esHoy = true;
                    } else {
                      //significa que el dia elegido no es el de hou
                      esHoy = false;
                    }

                    //actualizamos la variable verificadora
                    console.log(clasesActivasFuturas);
                    setDiaVerificador(esHoy);

                    //sacamos una copia del array de los 15 dias
                    let ejemplo = [...arrayDias];
                    ejemplo[i] = {
                      ...arrayDias[i],
                      activo: true,
                    };

                    //actualizamos el dia seleccionado
                    ejemplo[diaSeleccionado.id] = {
                      ...arrayDias[diaSeleccionado.id],
                      activo: false,
                    };

                    setArrayDias(ejemplo);
                    setDiaSeleccionado({
                      ...arrayDias[i],
                      activo: true,
                      horaActual:
                        tiempoActual.getHours() +
                        tiempoActual.getMinutes() / 100,
                      id: i,
                    });

                    if (esHoy) {
                      //hacemos el primer filtro para los dias
                      const resultadoFiltrado = filtrarClasesActivas(
                        clasesActivasOriginal,
                        arrayDias[i].fechaFormato,
                      );

                      //hacemos el filtro para las segundas clases
                      //si es que es diferente de todas
                      if (categoriaSeleccionada.categoria !== 'todos') {
                        const resultadoFiltradoCategorias =
                          filtrarCategoriasClase(
                            resultadoFiltrado,
                            categoriaSeleccionada.categoria,
                          );

                        setClasesActivas(resultadoFiltradoCategorias);
                      }

                      //si no esta el filtro por categorias no hay ningun problema
                      if (categoriaSeleccionada.categoria === 'todos') {
                        setClasesActivas(resultadoFiltrado);
                      }
                    } else {
                      const resultadoFiltrado = filtrarClasesActivas(
                        clasesActivasFuturasCopia,
                        arrayDias[i].fechaFormato,
                      );

                      //hacemos el filtro para las segundas clases
                      //si es que es diferente de todas
                      if (categoriaSeleccionada.categoria !== 'todos') {
                        const resultadoFiltradoCategorias =
                          filtrarCategoriasClase(
                            resultadoFiltrado,
                            categoriaSeleccionada.categoria,
                          );

                        setClasesActivasFuturas(resultadoFiltradoCategorias);
                      }

                      //si no esta el filtro por categorias no hay ningun problema
                      if (categoriaSeleccionada.categoria === 'todos') {
                        setClasesActivasFuturas(resultadoFiltrado);
                      }
                    }
                  }
                }}
                activo={dato.activo}
                key={i}
              />
            ),
          )}
        </ScrollView>
        {/* Linea */}
      </View>

      {/* Area de Scroll */}

      {
        //muestra solo clases relacionadas con hoy
        diaVerificador && clasesActivasOriginal.length === 0 ? (
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 164,

              width: 290,
            }}>
            No hemos encontrado ninguna clase, intenta con otra búsqueda.
          </Text>
        ) : diaVerificador && clasesActivas.length > 0 ? (
          <FlatList
            onEndReached={() => {
              if (filtroActivado === false) {
                traerMasDatosHoy();
              } else {
                traerMasDatosHoyFiltro();
              }
            }}
            data={clasesActivas}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <ClaseDisponible
                index={index}
                action={() => {
                  navigation.navigate('ApartarClaseScreen', {
                    datosClase: item,
                  });
                }}
                dato={item}
                key={index}
              />
            )}
            onEndReachedThreshold={0.4}
            keyExtractor={(item: any) => item.idDocumento}
            ListFooterComponent={
              <ActivityIndicator
                animating={datosRecargar.puedeRecargar ? true : false}
                style={{height: datosRecargar.puedeRecargar ? 100 : 0}}
                size={20}
                color="grey"
              />
            }
          />
        ) : //muestra solo clase relacionadas con dias futuros

        !diaVerificador && clasesActivasFuturasCopia.length === 0 ? (
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 164,

              width: 290,
            }}>
            No hemos encontrado ninguna clase, intenta con otra búsqueda.
          </Text>
        ) : !diaVerificador && clasesActivasFuturas.length > 0 ? (
          <FlatList
            onEndReached={distanceFromEnd => {
              if (filtroActivado === false) {
                traerMasDatosFuturos();
              } else {
                traerMasDatosFuturosFiltro();
              }
            }}
            data={clasesActivasFuturas}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            renderItem={({item, index}) => (
              <ClaseDisponible
                index={index}
                action={() => {
                  navigation.navigate('ApartarClaseScreen', {
                    datosClase: item,
                  });
                }}
                dato={item}
                key={index}
              />
            )}
            keyExtractor={(item: any) => item.idDocumento}
            ListFooterComponent={
              <ActivityIndicator
                animating={datosRecargarFuturas.puedeRecargar ? true : false}
                style={{height: datosRecargarFuturas.puedeRecargar ? 100 : 0}}
                size={20}
                color="grey"
              />
            }
          />
        ) : (
          <></>
        )
      }

      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  barraBusquedaText: {
    fontSize: 16,
    marginLeft: 7,
  },
  headerContainer: {
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  linea: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#C3C3C3ed',
  },
});
