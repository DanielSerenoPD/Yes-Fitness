import React, {useEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Share,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HeaderLogo from '../../components/Header/HeaderLogo';
import LupaChica from '../../../assets/imagenes/utiles/LupaChica.svg';
import Añadir from '../../../assets/imagenes/utiles/Añadir.svg';
import {HistorialClase} from '../../components/HistorialClase';
import MapView, {Marker} from 'react-native-maps';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthContext} from '../../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export const TabProximasScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();

  const {proximasClases} = useContext(AuthContext);

  useEffect(() => {
    console.log(insets.top);
  }, []);

  const compartir = async () => {
    try {
      const result = await Share.share({
        message: 'Este es un mensaje de prueba de yes fitness',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  //esta funcion sirve para transformar la fecha
  //del primer item al texto requerido
  //ej output: Mie 1 Abril 17:00 - 17:50 hrs.
  const formatearFechaHoy = () => {
    let fechaCantidad = new Date(proximasClases[0].fechaFormatoHoyTiempo);

    let diaTexto = fechaCantidad.toLocaleDateString('es', {weekday: 'long'});
    let diaNumero = fechaCantidad.getDate();
    let diaNumeroResultado =
      diaNumero.toString().length === 1 ? `0${diaNumero}` : diaNumero;

    let mesTexto = fechaCantidad.toLocaleDateString('es', {month: 'long'});

    let diaTextoResultado =
      diaTexto.charAt(0).toUpperCase() + diaTexto.slice(1);

    let mesTextoResultado =
      mesTexto.charAt(0).toUpperCase() + mesTexto.slice(1);

    //formateamos la duracion
    var hours = Math.floor(proximasClases[0].datosHorario.duracion / 60);
    var minutes = proximasClases[0].datosHorario.duracion % 60;

    const valorHoras = hours + ':' + minutes;

    const primerosNumeros = proximasClases[0].horario.split(':').shift();

    const horaFinal = hours + parseInt(primerosNumeros);

    const minutosFinal =
      minutes.toString().length === 1 ? `0${minutes}` : minutes;

    const horaFinalFormato = horaFinal + ':' + minutosFinal;

    return `${diaTextoResultado.slice(
      0,
      3,
    )} ${diaNumeroResultado} de ${mesTextoResultado} ${proximasClases[0].horario.slice(
      0,
      -2,
    )}- ${horaFinalFormato} ${proximasClases[0].datosHorario.tiempo} `;
  };

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor="white"
      />

      <View style={{marginBottom: 25}}>
        <Text style={styles.tituloHeader}>Próximas clases</Text>
      </View>

      {/* Comprobamos que haya clases futuras */}

      {proximasClases.length !== 0 ? (
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 24}}>
            {/* Mapa */}
            <MapView
              initialRegion={{
                latitude: proximasClases[0].coordenadas.latitude,
                longitude: proximasClases[0].coordenadas.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              style={styles.mapa}>
              <Marker
                coordinate={{
                  latitude: proximasClases[0].coordenadas.latitude,
                  longitude: proximasClases[0].coordenadas.longitude,
                }}
              />
            </MapView>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CancelarClaseScreen', {
                  datosClase: {...proximasClases[0], creado: ''},
                  datosFechasClase: {
                    añoActual: proximasClases[0].esLocal
                      ? proximasClases[0].creado.getFullYear()
                      : proximasClases[0].creado.toDate().getFullYear(),
                    mesActual: proximasClases[0].esLocal
                      ? proximasClases[0].creado.getMonth()
                      : proximasClases[0].creado.toDate().getMonth(),
                  },
                });
              }}
              activeOpacity={0.6}>
              <Text style={styles.mapaTexto1}>
                {proximasClases[0].datosClase.categoria}
              </Text>
              {/*  Mie 1 Abril 17:00 - 17:50 hrs. */}
              <Text style={styles.mapaTexto2}>{formatearFechaHoy()}</Text>
              <Text style={styles.mapaTexto3}>
                {proximasClases[0].nombreSucursal}
              </Text>
              <Text style={styles.mapaTexto4}>
                {proximasClases[0].direccion}
              </Text>
            </TouchableOpacity>
            {/* Compartir con amigos */}
            <TouchableOpacity
              onPress={() => compartir()}
              activeOpacity={0.6}
              style={{flexDirection: 'row', marginBottom: 21}}>
              <Añadir fill="black" />
              <Text style={styles.compartirTexto}>Invitar amigos</Text>
            </TouchableOpacity>

            {/* Zona de las clases futuras */}
          </View>
          {proximasClases.slice(1).map((dato: any, i: number) => (
            <HistorialClase
              index={i}
              action={() => {
                navigation.navigate('CancelarClaseScreen', {
                  datosClase: {...dato, creado: ''},
                  datosFechasClase: {
                    añoActual: dato.esLocal
                      ? dato.creado.getFullYear()
                      : dato.creado.toDate().getFullYear(),
                    mesActual: dato.esLocal
                      ? dato.creado.getMonth()
                      : dato.creado.toDate().getMonth(),
                  },
                });
              }}
              datos={dato}
              key={i}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',

              width: 290,
            }}>
            No tienes clases reservadas
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tituloHeader: {
    color: '#0B0B0B',
    fontSize: 16,
    textAlign: 'center',
  },
  mapa: {
    borderRadius: 4,
    height: 200,
    backgroundColor: 'gray',
    marginTop: 5,
  },
  mapaTexto1: {
    marginTop: 23,
    fontSize: 20,
    color: '#0B0B0B',
    marginBottom: 12,
  },
  mapaTexto2: {
    fontSize: 20,
    color: '#0B0B0B',
    marginBottom: 12,
  },
  mapaTexto3: {
    fontSize: 18,
    color: '#909090',
    marginBottom: 12,
  },
  mapaTexto4: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 40,
  },
  compartirTexto: {
    fontSize: 16,
    color: '#0B0B0B',
    marginLeft: 11.5,
  },
});
