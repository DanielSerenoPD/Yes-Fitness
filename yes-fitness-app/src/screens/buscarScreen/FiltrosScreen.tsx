import React, {useState, useContext} from 'react';
import HeaderLogo from '../../components/Header/HeaderLogo';
import {TecladoSalvador} from '../../components/TecladoSalvador';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {Footer} from '../../components/Footer';
import Lapiz from '../../../../assets/imagenes/utiles/Lapiz.svg';
import PalomitaChiquita from '../../../assets/imagenes/utiles/PalomitaChiquita.svg';
import {FormInput} from '../../components/FormInput';
import auth from '@react-native-firebase/auth';
import HeaderNormal from '../../components/Header/HeaderNormal';
import PropTypes from 'prop-types';
import Slider from '@react-native-community/slider';
import firestore from '@react-native-firebase/firestore';
import {FooterFiltro} from '../../components/FooterFiltro';
import {MultiSliderComponent} from '../../components/MultiSliderComponent';
import {ModalCargando} from '../../components/ModalCargando';
import {AuthContext} from '../../context/AuthContext';
import Geolocation from '@react-native-community/geolocation';
import {filtrarClasesActivas} from '../../funciones/filtrarClasesActivas';
import {getKilometros} from '../../funciones/getKilometros';

interface Props extends StackScreenProps<any, any> {}

export const FiltrosScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();

  const {
    abrirModal,
    setClasesActivas,
    setClasesActivasOriginal,
    setClasesActivasFuturas,
    setClasesActivasFuturasCopia,
    filtrosQuery,
    setFiltrosQuery,
    datosUsuario,
    diaSeleccionado,
    setProximasClases,
    setDatosRecargar,
    setDatosRecargarFuturas,
    setFiltroActivado,
    filtroActivado,
    sucursalesFavoritas,
  } = useContext(AuthContext);

  const [servicio3, setServicio3] = useState(false);

  const [scrollStatus, setScrollStatus] = useState(true);

  const transformarDistancia = (valor: number) => {
    if (valor === 0) {
      return 2;
    }

    if (valor === 1) {
      return 5;
    }

    if (valor === 2) {
      return 10;
    }

    if (valor === 3) {
      return 20;
    }
  };

  const aplicarFiltro = async () => {
    //convertimos el dato de dist ancia a su debido kilometro
    let distanciaFinal: any = transformarDistancia(filtrosQuery.distancia);
    let horaActualFormato = new Date();
    let horaActual =
      horaActualFormato.getHours() + horaActualFormato.getMinutes() / 100;

    let tiempoActual: any = new Date();

    //aplicamos el filtro para los datos para firebase
    try {
      abrirModal(true);

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

      //hoy
      let diaSemana = diaSeleccionado.fechaFormato
        .toLocaleDateString('es-ES', {
          weekday: 'long',
        })
        .slice(0, 3);

      const tiempoFormato =
        tiempoActual.getHours() + tiempoActual.getMinutes() / 100;
      const clasesActivas = await firestore()
        .collection('clasesActivas')
        .where('horarioValor', '>=', tiempoFormato)
        .where('horarioValor', '>=', filtrosQuery.primeraHora)
        .where('horarioValor', '<=', filtrosQuery.segundaHora)
        .where('diasActivos', 'array-contains', diaSemana)
        .orderBy('horarioValor', 'asc')
        .limit(5)
        .get();

      //futuras
      const clasesActivasFuturas = await firestore()
        .collection('clasesActivas')
        .where('horarioValor', '>=', filtrosQuery.primeraHora)
        .where('horarioValor', '<=', filtrosQuery.segundaHora)
        .orderBy('horarioValor', 'asc')
        .limit(5)
        .get();

      //empezamos haciendo el filtro de las clases para hoy

      const clasesActivasResultado: any = [];

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

        //comprobamos que tenga la distancia minima requerida
        //y ademas que contenga los servicios ingresados
        if (
          parseFloat(
            getKilometros(
              latitude,
              longitude,
              locationUsuario.latitude,
              locationUsuario.longitude,
            ),
          ) <= distanciaFinal
          //  &&
          // datos.data().datosEstudio.servicios.includes
        ) {
          //comprobamos si esta en favoritos
          if (filtrosQuery.favoritos === true) {
            const contieneFavoritos = sucursalesFavoritas.some(
              (datosF: any) => {
                return datosF.idSucursal === datos.data().idSucursal;
              },
            );

            console.log(contieneFavoritos);

            if (contieneFavoritos === false) {
              console.log('papush');
              return;
            }
          }

          //comprobamos que tenga el array de servicios del filtro
          // y el del documento sea igual
          let verificadorServicios = false;
          function arrayEquals(a: any, b: any) {
            if (
              Array.isArray(a) &&
              Array.isArray(b) &&
              a.length === b.length &&
              a.every((val, index) => val === b[index])
            ) {
              verificadorServicios = true;
            }
          }

          //NOTA: el sort es para acomodarlos por
          //letras del abecedarios
          //esto es para evitar problemas

          arrayEquals(
            filtrosQuery.servicios.sort(),
            datos.data().datosEstudio.servicios.sort(),
          );

          if (verificadorServicios === false) {
            return;
          }

          // false

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
        }
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

        //comprobamos que tenga la distancia minima requerida
        //y ademas que contenga los servicios ingresados
        if (
          parseFloat(
            getKilometros(
              latitude,
              longitude,
              locationUsuario.latitude,
              locationUsuario.longitude,
            ),
          ) <= distanciaFinal
          //  &&
          // datos.data().datosEstudio.servicios.includes
        ) {
          //comprobamos si esta en favoritos
          if (filtrosQuery.favoritos === true) {
            const contieneFavoritos = sucursalesFavoritas.some(
              (datosF: any) => {
                return datosF.idSucursal === datos.data().idSucursal;
              },
            );

            console.log(contieneFavoritos);

            if (contieneFavoritos === false) {
              console.log('papush');
              return;
            }
          }

          //comprobamos que tenga el array de servicios del filtro
          // y el del documento sea igual
          let verificadorServicios = false;
          function arrayEquals(a: any, b: any) {
            if (
              Array.isArray(a) &&
              Array.isArray(b) &&
              a.length === b.length &&
              a.every((val, index) => val === b[index])
            ) {
              verificadorServicios = true;
            }
          }

          //NOTA: el sort es para acomodarlos por
          //letras del abecedarios
          //esto es para evitar problemas

          arrayEquals(
            filtrosQuery.servicios.sort(),
            datos.data().datosEstudio.servicios.sort(),
          );

          if (verificadorServicios === false) {
            return;
          }

          // false

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
        }
      });

      //guardamos una copia de los datos sin filtrar
      setClasesActivasFuturasCopia(clasesActivasResultadoFuturas);

      //filtramos las clases por la fecha de hoy
      console.log(clasesActivasResultadoFuturas);

      const resultadoFinalFuturas = filtrarClasesActivas(
        clasesActivasResultadoFuturas,
        diaSeleccionado.fechaFormato,
      );

      setClasesActivasFuturas(resultadoFinalFuturas);

      abrirModal(false);
      setFiltroActivado(true);
    } catch (error) {
      abrirModal(false);
    }
  };

  const borrarFiltro = async () => {
    let horaActualFormato = new Date();
    let horaActual =
      horaActualFormato.getHours() + horaActualFormato.getMinutes() / 100;

    let tiempoActual: any = new Date();

    //aplicamos el filtro para los datos para firebase
    try {
      abrirModal(true);

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

      //hoy
      let diaSemana = diaSeleccionado.fechaFormato
        .toLocaleDateString('es-ES', {
          weekday: 'long',
        })
        .slice(0, 3);

      const tiempoFormato =
        tiempoActual.getHours() + tiempoActual.getMinutes() / 100;
      const clasesActivas = await firestore()
        .collection('clasesActivas')
        .where('horarioValor', '>=', tiempoFormato)
        .where('diasActivos', 'array-contains', diaSemana)
        .orderBy('horarioValor', 'asc')
        .limit(5)
        .get();

      //futuras
      const clasesActivasFuturas = await firestore()
        .collection('clasesActivas')
        .orderBy('horarioValor', 'asc')
        .limit(5)
        .get();

      //empezamos haciendo el filtro de las clases para hoy

      const clasesActivasResultado: any = [];

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

      abrirModal(false);
      setFiltroActivado(false);
    } catch (error) {
      abrirModal(false);
    }
  };

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <ScrollView
        scrollEnabled={scrollStatus}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, marginHorizontal: 24}}>
          <View style={{marginBottom: 64.8}}>
            <HeaderNormal
              tieneFlecha={true}
              action={() => {
                navigation.pop();
              }}
            />
          </View>

          {/* Favoritos */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 64,
            }}>
            <Text style={styles.favoritosTexto}>Favoritos</Text>
            <Switch
              trackColor={{true: 'black', false: 'rgba(120, 120, 128,0.25)'}}
              onValueChange={() => {
                setFiltrosQuery({
                  ...filtrosQuery,
                  favoritos: !filtrosQuery.favoritos,
                });
              }}
              value={filtrosQuery.favoritos}
              ios_backgroundColor="rgba(120, 120, 128,0.25)"
            />
          </View>

          {/* range Slide */}
          <Text style={styles.titulo1}>Hora de inicio</Text>

          <View style={{marginBottom: 31}}>
            {/* <Slider
              style={{height: 40}}
              minimumValue={7}
              maximumValue={20}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#C3C3C3"
            /> */}

            <MultiSliderComponent
              scrollStatus={scrollStatus}
              setScrollStatus={setScrollStatus}
              filtrosQuery={filtrosQuery}
              setFiltrosQuery={setFiltrosQuery}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 45,
            }}>
            <Text style={styles.textoHora}>{`${
              filtrosQuery.primeraHora === 13
                ? '1'
                : filtrosQuery.primeraHora === 14
                ? '2'
                : filtrosQuery.primeraHora === 15
                ? '3'
                : filtrosQuery.primeraHora === 16
                ? '4'
                : filtrosQuery.primeraHora === 17
                ? '5'
                : filtrosQuery.primeraHora === 18
                ? '6'
                : filtrosQuery.primeraHora === 19
                ? '7'
                : filtrosQuery.primeraHora === 20
                ? '8'
                : filtrosQuery.primeraHora === 21
                ? '9'
                : filtrosQuery.primeraHora === 22
                ? '10'
                : filtrosQuery.primeraHora
            }:00 ${filtrosQuery.primeraHora > 11 ? 'pm' : 'am'}`}</Text>
            <Text style={styles.textoHora}>{`${
              filtrosQuery.segundaHora === 13
                ? '1'
                : filtrosQuery.segundaHora === 14
                ? '2'
                : filtrosQuery.segundaHora === 15
                ? '3'
                : filtrosQuery.segundaHora === 16
                ? '4'
                : filtrosQuery.segundaHora === 17
                ? '5'
                : filtrosQuery.segundaHora === 18
                ? '6'
                : filtrosQuery.segundaHora === 19
                ? '7'
                : filtrosQuery.segundaHora === 20
                ? '8'
                : filtrosQuery.segundaHora === 21
                ? '9'
                : filtrosQuery.segundaHora === 22
                ? '10'
                : filtrosQuery.segundaHora
            }:00 ${filtrosQuery.segundaHora > 11 ? 'pm' : 'am'}`}</Text>
          </View>

          <View style={styles.linea} />

          {/* range Slide */}
          <Text style={{...styles.titulo1, marginTop: 31}}>Distancia</Text>

          <View style={{marginBottom: 31}}>
            <Slider
              onValueChange={data => {
                setFiltrosQuery({
                  ...filtrosQuery,
                  distancia: data,
                });
              }}
              style={{height: 40}}
              minimumValue={0}
              maximumValue={3}
              value={filtrosQuery.distancia}
              step={1}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#C3C3C3"
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 45,
            }}>
            <Text style={styles.textoHora}>2 km</Text>
            <Text style={styles.textoHora}>5 km</Text>
            <Text style={styles.textoHora}>10 km</Text>
            <Text style={styles.textoHora}>20 km</Text>
          </View>

          <View style={styles.linea} />

          {/* Servicios */}
          <Text style={styles.servicioTexto}>Servicio</Text>

          {['Estacionamiento', 'Lockers', 'Regaderas'].map((dato, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.6}
              onPress={() => {
                if (filtrosQuery.servicios.includes(dato)) {
                  const filtrarServicio = filtrosQuery.servicios.filter(
                    (datoFiltro: any) => datoFiltro !== dato,
                  );

                  setFiltrosQuery({
                    ...filtrosQuery,
                    servicios: filtrarServicio,
                  });
                } else {
                  setFiltrosQuery({
                    ...filtrosQuery,
                    servicios: [...filtrosQuery.servicios, dato],
                  });
                }
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 24,
                alignItems: 'center',
              }}>
              <Text
                style={
                  filtrosQuery.servicios.includes(dato)
                    ? styles.textServicioActivo
                    : styles.textServicioInactivo
                }>
                {dato}
              </Text>
              <View
                style={
                  filtrosQuery.servicios.includes(dato)
                    ? styles.checkServicioActivo
                    : styles.checkServicioInactivo
                }>
                {filtrosQuery.servicios.includes(dato) && <PalomitaChiquita />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ModalCargando />

      {/* Footer */}
      <FooterFiltro
        action={() => {
          if (filtroActivado === false) {
            navigation.pop();
          } else {
            borrarFiltro();
          }
        }}
        action2={() => {
          aplicarFiltro();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  favoritosTexto: {
    fontSize: 20,
    color: 'black',
  },
  titulo1: {
    fontSize: 20,
    color: 'black',
    marginBottom: 40,
  },
  textoHora: {
    fontSize: 16,
    color: 'black',
  },
  linea: {
    backgroundColor: '#707070',
    height: 0.29,
  },
  servicioTexto: {
    fontSize: 20,
    marginTop: 19,
    marginBottom: 26,
  },
  textServicioInactivo: {
    fontSize: 16,
    color: '#909090',
  },
  textServicioActivo: {
    fontSize: 16,
    color: 'black',
  },
  checkServicioActivo: {
    width: 25,
    height: 25,
    borderRadius: 3,
    backgroundColor: '#000000',

    justifyContent: 'center',
    alignItems: 'center',
  },
  checkServicioInactivo: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#707070',
  },
});
