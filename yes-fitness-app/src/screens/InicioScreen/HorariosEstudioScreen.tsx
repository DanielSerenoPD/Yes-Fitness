import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {DiasActuales} from '../../components/DiasActuales';
import {AuthContext} from '../../context/AuthContext';
import {StackScreenProps} from '@react-navigation/stack';
import {ClaseDisponible} from '../buscarScreen/ClaseDisponible';
import HeaderNormal from '../../components/Header/HeaderNormal';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import {getKilometros} from '../../funciones/getKilometros';
import {filtrarClasesActivas} from '../../funciones/filtrarClasesActivas';
import {ModalCargando} from '../../components/ModalCargando';

interface Props extends StackScreenProps<any, any> {}

export const HorariosEstudioScreen = ({navigation, route}: Props) => {
  const {abrirModal, setDiaSeleccionadoGenerico} = useContext(AuthContext);

  const {
    nombreSucursal,

    idSucursal,
  } = route.params?.datosEstudio;

  //aray de los dias de esta sucursal

  const [arrayDias, setArrayDias] = useState<any>([]);

  //state propio de los horarios de Estudio
  const [diaSeleccionado, setDiaSeleccionado] = useState<any>({
    fecha: 'mie29',
    activo: true,
    dias: 'lunes',
    id: 0,
    fechaFormato: new Date(),
    horaActual: new Date().getHours(),
  });

  //esta copia sirve para poder hacer el filtrado
  const [clasesActivasOriginal, setClasesActivasOriginal] = useState<any>([]);

  //lista de clases activas
  const [clasesActivas, setClasesActivas] = useState<any>([]);

  //lista de clases activas futuras
  const [clasesActivasFuturas, setClasesActivasFuturas] = useState<any>([]);

  //copia de clases activas futuras
  const [clasesActivasFuturasCopia, setClasesActivasFuturasCopia] =
    useState<any>([]);

  //ESTE trigger confirma si en la base de datos hay mas clases con el criterio de busqueda
  const [datosRecargar, setDatosRecargar] = useState<any>({
    puedeRecargar: false,
    ultimoDocumento: '',
  });

  //Lo mismo pero para clases futuras
  const [datosRecargarFuturas, setDatosRecargarFuturas] = useState<any>({
    puedeRecargar: false,
    ultimoDocumento: '',
  });

  //funciones para el infinite Scroll
  const traerMasDatosHoy = async () => {
    if (datosRecargar.puedeRecargar === false) {
      return;
    }

    let horaActualFormato = new Date();
    let horaActual =
      horaActualFormato.getHours() + horaActualFormato.getMinutes() / 100;

    let diaSemana = diaSeleccionado.fechaFormato
      .toLocaleDateString('es-ES', {
        weekday: 'long',
      })
      .slice(0, 3);

    console.log(datosRecargar.ultimoDocumento);

    const paso1: any = await firestore()
      .collection('clasesActivas')
      .where('idSucursal', '==', idSucursal)
      .where('horarioValor', '>=', horaActual)
      .where('diasActivos', 'array-contains', diaSemana)
      .orderBy('horarioValor', 'asc')
      .startAfter(datosRecargar.ultimoDocumento)
      .limit(5)
      .get();

    let arrayResultado: any = [];
    let idUltimoDocumento = '';

    //obtenemos la localizacion del usuario para el calculo de las distancias
    let locationUsuario = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };

    Geolocation.getCurrentPosition(info => {
      locationUsuario = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.201,
        longitudeDelta: 0.201,
      };
    });

    paso1.forEach((datos: any, index: any) => {
      if (index === 4) {
        idUltimoDocumento = datos.id;
      }

      const {latitude, longitude} = datos.data().coordenadas;

      arrayResultado.push({
        ...datos.data(),
        idDocumento: datos.id,

        distancia: parseFloat(
          getKilometros(
            latitude,
            longitude,
            locationUsuario.latitude,
            locationUsuario.longitude,
          ),
        ),
      });
    });

    console.log(idUltimoDocumento);

    if (idUltimoDocumento !== '') {
      setDatosRecargar({
        puedeRecargar: true,
        ultimoDocumento: paso1.docs[4],
      });
    } else {
      setDatosRecargar({
        ...datosRecargar,
        puedeRecargar: false,
      });
    }

    //sumamos al array copia
    setClasesActivasOriginal([...clasesActivasOriginal, ...arrayResultado]);

    //filtramos

    const resultadoFinal = filtrarClasesActivas(
      arrayResultado,
      diaSeleccionado.fechaFormato,
    );
    setClasesActivas([...clasesActivas, ...resultadoFinal]);
  };

  const traerMasDatosFuturos = async () => {
    if (datosRecargarFuturas.puedeRecargar === false) {
      return;
    }

    let horaActualFormato = new Date();

    const paso1: any = await firestore()
      .collection('clasesActivas')
      .where('idSucursal', '==', idSucursal)
      .orderBy('horarioValor', 'asc')
      .startAfter(datosRecargarFuturas.ultimoDocumento)
      .limit(5)
      .get();

    console.log(paso1.docs.length);

    let arrayResultado: any = [];
    let idUltimoDocumento = '';

    //obtenemos la localizacion del usuario para el calculo de las distancias
    let locationUsuario = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };

    Geolocation.getCurrentPosition(info => {
      locationUsuario = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.201,
        longitudeDelta: 0.201,
      };
    });

    paso1.forEach((datos: any, index: any) => {
      if (index === 4) {
        idUltimoDocumento = datos.id;
      }

      const {latitude, longitude} = datos.data().coordenadas;

      arrayResultado.push({
        ...datos.data(),
        idDocumento: datos.id,

        distancia: parseFloat(
          getKilometros(
            latitude,
            longitude,
            locationUsuario.latitude,
            locationUsuario.longitude,
          ),
        ),
      });
    });

    console.log('llegue');

    if (idUltimoDocumento !== '') {
      setDatosRecargarFuturas({
        puedeRecargar: true,
        ultimoDocumento: paso1.docs[4],
      });
    } else {
      setDatosRecargarFuturas({
        ...datosRecargar,
        puedeRecargar: false,
      });
    }

    //sumamos al array copia
    setClasesActivasFuturasCopia([
      ...clasesActivasFuturasCopia,
      ...arrayResultado,
    ]);

    //filtramos

    const resultadoFinal = filtrarClasesActivas(
      arrayResultado,
      diaSeleccionado.fechaFormato,
    );
    setClasesActivasFuturas([...clasesActivasFuturas, ...resultadoFinal]);
  };

  //---------------------------------------------

  const insets = useSafeAreaInsets();
  //esta variable se encarga de monitorear si el dia actual es el de hoy
  // o si es un dia futuro
  const [diaVerificador, setDiaVerificador] = useState(true);

  const calcularDias = () => {
    let arrayResultado: any = [];

    const diaSiguiente = (dias: number) => {
      let hoy = new Date();
      let resultado = new Date(hoy.getTime() + 24 * 60 * 60 * dias);

      //output mie23
      let fecha =
        resultado
          .toLocaleDateString('es-ES', {
            weekday: 'long',
          })
          .slice(0, 3) +
        resultado.toLocaleDateString('es', {
          day: 'numeric',
        });

      //output miercoles
      let nombreDia = resultado.toLocaleDateString('es-ES', {
        weekday: 'long',
      });

      //output 4/11/2021
      let fechaCompleta = resultado.toLocaleDateString('es-ES');

      return {
        fecha,
        nombreDia,
        fechaCompleta,
        fechaFormato: resultado,
      };
    };

    [
      0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
      12000, 13000, 14000,
    ].forEach((dias, index) => {
      arrayResultado.push({
        ...diaSiguiente(dias),
        activo: dias === 0 ? true : false,
        dias: 'lunes',
        id: index,
      });

      //esto es para poner activo siempre el primer dia
      const tiempoActual: any = new Date();
      if (dias === 0) {
        setDiaSeleccionado({
          ...diaSiguiente(dias),
          activo: true,
          dias: 'lunes',
          id: index,
          fechaFormato: tiempoActual,
          horaActual: tiempoActual.getHours() + tiempoActual.getMinutes() / 100,
          hayMasDatos: true,
        });
      }

      setArrayDias(arrayResultado);
    });
  };

  useEffect(() => {
    calcularDias();

    const traerDatosEstudio = async () => {
      try {
        abrirModal(true);

        let arrayDatos: any = [];

        //traemos la ubicacion del usuario
        let locationUsuario = {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };

        Geolocation.getCurrentPosition(info => {
          locationUsuario = {
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
            latitudeDelta: 0.201,
            longitudeDelta: 0.201,
          };
        });

        //traemos los datos de inteligencia artificial
        let tiempoActual: any = new Date();
        //verificamos si ya se tomo como minimo una coase

        //-----------------------------------------

        //traemos las clases acomodadas por hora de menor a mayor
        // y que contenga minimo el dia de hoy esto aplica
        //para cuando el usuario esta buscando clases de hoy

        let diaSemana = diaSeleccionado.fechaFormato
          .toLocaleDateString('es-ES', {
            weekday: 'long',
          })
          .slice(0, 3);

        const tiempoFormato =
          tiempoActual.getHours() + tiempoActual.getMinutes() / 100;
        const clasesActivas = await firestore()
          .collection('clasesActivas')
          .where('idSucursal', '==', idSucursal)
          .where('horarioValor', '>=', tiempoFormato)
          .where('diasActivos', 'array-contains', diaSemana)
          .orderBy('horarioValor', 'asc')
          .limit(5)
          .get();

        //Traemos las clases acomodadas por hora de menor a mayor
        //sin el filtro de la hora actual
        //esto sirve para cuando el usuario esta buscando clases de
        //otro dia que no sea hoy
        const clasesActivasFuturas = await firestore()
          .collection('clasesActivas')
          .where('idSucursal', '==', idSucursal)
          .orderBy('horarioValor', 'asc')
          .limit(5)
          .get();

        //USA ESTA OPCION PARA HACER PRUEBAS EN CASO DE SER NECESARIO
        // const clasesActivas = await firestore()
        //   .collection('clasesActivas')

        //   .orderBy('horarioValor', 'asc')
        //   .limit(15)
        //   .get();

        //empezamos haciendo el filtro de las clases para hoy

        const clasesActivasResultado: any = [];
        console.log('comenzamos pinguu 33');
        clasesActivas.forEach((datos: any, index: number) => {
          //solo si se obtuvieron exactamente 15 documentos del query original
          //se puede volver a llamara a la base de datos

          if (index === 4) {
            setDatosRecargar({
              puedeRecargar: true,
              ultimoDocumento: clasesActivas.docs[4],
            });
          }
          const {latitude, longitude} = datos.data().coordenadas;
          clasesActivasResultado.push({
            ...datos.data(),
            idDocumento: datos.id,
            distancia: parseFloat(
              getKilometros(
                latitude,
                longitude,
                locationUsuario.latitude,
                locationUsuario.longitude,
              ),
            ),
          });
        });

        //guardamos una copia de los datos sin filtrar
        setClasesActivasOriginal(clasesActivasResultado);

        //filtramos las clases por la fecha de hoy
        const resultadoFinal = filtrarClasesActivas(
          clasesActivasResultado,
          diaSeleccionado.fechaFormato,
        );

        setClasesActivas(resultadoFinal);

        //hacemos lo mismo pero para las clases futuras

        const clasesActivasResultadoFuturas: any = [];

        clasesActivasFuturas.forEach((datos: any, index: number) => {
          //solo si se obtuvieron exactamente 15 documentos del query original
          //se puede volver a llamara a la base de datos

          if (index === 4) {
            setDatosRecargarFuturas({
              puedeRecargar: true,
              ultimoDocumento: clasesActivasFuturas.docs[4],
            });
          }
          const {latitude, longitude} = datos.data().coordenadas;

          clasesActivasResultadoFuturas.push({
            ...datos.data(),
            idDocumento: datos.id,
            distancia: parseFloat(
              getKilometros(
                latitude,
                longitude,
                locationUsuario.latitude,
                locationUsuario.longitude,
              ),
            ),
          });
        });

        //guardamos una copia de los datos sin filtrar
        setClasesActivasFuturasCopia(clasesActivasResultadoFuturas);

        //filtramos las clases por la fecha de hoy

        const resultadoFinalFuturas = filtrarClasesActivas(
          clasesActivasResultadoFuturas,
          diaSeleccionado.fechaFormato,
        );

        setClasesActivasFuturas(resultadoFinalFuturas);

        //-----Fin -----------
        abrirModal(false);
      } catch (e) {
        abrirModal(false);
        Alert.alert('Hubo un error');
        console.log(e);
      }
    };

    traerDatosEstudio();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        marginTop: insets.top + 19.8,
        marginBottom: insets.bottom,
      }}>
      {/* Header */}

      <View style={styles.headerContainer}>
        <HeaderNormal
          tieneFlecha
          action={() => {
            navigation.pop();
          }}
          titulo={nombreSucursal}
        />
      </View>

      <View>
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

                        //si no esta el filtro por categorias no hay ningun problema
                        setClasesActivas(resultadoFiltrado);
                      } else {
                        const resultadoFiltrado = filtrarClasesActivas(
                          clasesActivasFuturasCopia,
                          arrayDias[i].fechaFormato,
                        );

                        setClasesActivasFuturas(resultadoFiltrado);
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
            onEndReached={traerMasDatosHoy}
            data={clasesActivas}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <ClaseDisponible
                index={index}
                action={() => {
                  setDiaSeleccionadoGenerico(diaSeleccionado);

                  navigation.navigate('ApartarClaseGenericoScreen', {
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
            onEndReached={traerMasDatosFuturos}
            data={clasesActivasFuturas}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <ClaseDisponible
                index={index}
                action={() => {
                  setDiaSeleccionadoGenerico(diaSeleccionado);
                  navigation.navigate('ApartarClaseGenericoScreen', {
                    datosClase: item,
                  });
                }}
                dato={item}
                key={index}
              />
            )}
            onEndReachedThreshold={0.5}
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
      <ModalCargando />
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

    marginBottom: 50,
  },
  linea: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#C3C3C3ed',
  },
});
