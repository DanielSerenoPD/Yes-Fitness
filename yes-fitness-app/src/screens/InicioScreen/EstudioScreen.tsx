import React, {useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {Footer} from '../../components/Footer';
import HeaderNormal from '../../components/Header/HeaderNormal';
import CorazonChico from '../../../assets/imagenes/utiles/CorazonChico.svg';
import CorazonNegro from '../../../assets/imagenes/utiles/CorazonNegro.svg';
import TelefonoChico from '../../../assets/imagenes/utiles/TelefonoChico.svg';
import InstagramChico from '../../../assets/imagenes/utiles/InstagramChico.svg';

//iconos servicios
import Estacionamiento from '../../../assets/imagenes/iconos-servicios/Estacionamiento.svg';
import {FadeInImage} from '../../components/FadeInImage';
import MapView, {Marker} from 'react-native-maps';
import {Slider} from '../../components/Slider/Slider';
import {AuthContext} from '../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

interface Props extends StackScreenProps<any, any> {}

export const EstudioScreen = ({navigation, route}: Props) => {
  const insets = useSafeAreaInsets();

  const {
    datosEstudio,
    datosClase,
    datosCoach,
    coordenadas,
    horario,
    horarioValor,
    datosHorario,
    nombreSucursal,
    idSucursal,
  } = route.params?.datosClase;

  const {
    fotosGaleria,
    descripcionEstudio,

    fotoPortada,
    instagram,
    medidasSalud,
    facebook,
    servicios,
    numeroTelefono,
  } = datosEstudio;

  let {
    datosUsuario,
    setDatosUsuarioPerfil,
    sucursalesFavoritas,
    setSucursalesFavoritas,
    sucursales,
  } = useContext(AuthContext);

  //funcion para marcar favorito
  const marcarFavorito = async () => {
    try {
      //añadimos el estudio a la lista actual de favoritos
      let copiaFavoritos = [idSucursal, ...datosUsuario.estudiosFavoritos];

      //actualizamos los datos del usuario en firebase
      await firestore()
        .collection('usuarios')
        .doc(datosUsuario.idDocumento)
        .update({
          estudiosFavoritos: copiaFavoritos,
        });

      //actualizamos en local los datos el usuario
      setDatosUsuarioPerfil({
        ...datosUsuario,
        estudiosFavoritos: copiaFavoritos,
      });

      //actualizamos los datos locales

      let datosLocales: any = {};
      sucursales.forEach((dato: any) => {
        if (dato.idSucursal === idSucursal) {
          datosLocales = dato;
        }
      });
      setSucursalesFavoritas([datosLocales, ...sucursalesFavoritas]);
    } catch (error) {
      Alert.alert('hubo un error');
    }
  };

  //funcion para desmarcar favorito
  const desmarcarFavorito = async () => {
    console.log('ejecutar');
    try {
      //añadimos el estudio a la lista actual de favoritos
      let copiaFavoritos = datosUsuario.estudiosFavoritos.filter(
        (dato: any) => dato !== idSucursal,
      );

      //actualizamos los datos del usuario en firebase
      await firestore()
        .collection('usuarios')
        .doc(datosUsuario.idDocumento)
        .update({
          estudiosFavoritos: copiaFavoritos,
        });

      //actualizamos en local los datos el usuario
      setDatosUsuarioPerfil({
        ...datosUsuario,
        estudiosFavoritos: copiaFavoritos,
      });

      //actualizamos en local los datos del usuario
      const resultadoLocal = sucursalesFavoritas.filter(
        (datos: any) => datos.idSucursal !== idSucursal,
      );

      setSucursalesFavoritas(resultadoLocal);
    } catch (error) {
      Alert.alert('hubo un error');
    }
  };

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <View style={{marginBottom: 20.4, marginHorizontal: 24}}>
        <HeaderNormal
          tieneFlecha={true}
          action={() => {
            navigation.pop();
          }}
          iconoDerecha={
            datosUsuario.estudiosFavoritos.includes(idSucursal) ? (
              <CorazonNegro fill="black" />
            ) : (
              <CorazonChico fill="black" />
            )
          }
          actionDerecha={
            datosUsuario.estudiosFavoritos.includes(idSucursal)
              ? () => {
                  desmarcarFavorito();
                }
              : () => {
                  marcarFavorito();
                }
          }
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <FadeInImage
          uri="https://firebasestorage.googleapis.com/v0/b/yes-fitness-f2c41.appspot.com/o/fotosPrueba%2FDSC04778-HDReditLR.png?alt=media&token=0d3a4abe-8d69-4466-8479-2a53b67fd7b6"
          style={styles.imagen}
        /> */}

        <Slider arrayFotos={fotosGaleria} />

        {/*  */}
        <View style={{marginHorizontal: 24, marginBottom: 20}}>
          <Text style={styles.titulo}>{nombreSucursal}</Text>
          <Text style={styles.texto1}>Providencia</Text>
          <View style={styles.linea} />

          <Text style={styles.textoInformacion}>{descripcionEstudio}</Text>

          {/* Direccion */}

          <Text style={styles.titulo2}>Dirección</Text>
          <Text style={styles.textoDireccion}>
            Avenida México #3040, Guadalajara, Jalisco. México
          </Text>
          <MapView
            initialRegion={{
              latitude: coordenadas.latitude,
              longitude: coordenadas.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            style={styles.mapa}>
            <Marker
              coordinate={{
                latitude: coordenadas.latitude,
                longitude: coordenadas.longitude,
              }}
            />
          </MapView>
          <View style={styles.linea}></View>

          {/* Servicios */}
          <Text style={styles.tituloServicios}>Servicios</Text>

          {servicios.length === 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20.2,
              }}>
              <Text style={styles.textoServicios}>
                No hay ningun servicio registrado
              </Text>
            </View>
          ) : (
            <>
              {servicios.includes('Estacionamiento') && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 20.2,
                  }}>
                  <Text style={styles.textoServicios}>Estacionamiento</Text>
                  <Estacionamiento fill="black" />
                </View>
              )}

              {servicios.includes('Regaderas') && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 20.2,
                  }}>
                  <Text style={styles.textoServicios}>Regaderas</Text>
                  <Estacionamiento fill="black" />
                </View>
              )}

              {servicios.includes('Lockers') && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 34,
                  }}>
                  <Text style={styles.textoServicios}>Lockers</Text>
                  <Estacionamiento fill="black" />
                </View>
              )}
            </>
          )}
          <View style={styles.linea} />

          {/* Medidas de higiene */}
          <Text style={styles.tituloMedidas}>
            Medidas de seguridad e higiene
          </Text>
          <Text style={styles.textoMedidas}>{medidasSalud}</Text>
          <View style={styles.linea} />

          {/* Contacto */}
          <Text style={styles.contactoTitulo}>Contacto</Text>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              alignItems: 'center',
            }}>
            <TelefonoChico />
            <Text style={styles.contactoTexto}>{numeroTelefono}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              alignItems: 'center',
            }}>
            <InstagramChico />
            <Text style={styles.contactoTexto}>@noisemx</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer
        title="Ver horarios"
        action={() => {
          navigation.navigate('HorariosEstudioScreen', {
            datosEstudio: {
              idSucursal,
              nombreSucursal,
            },
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagen: {
    height: 507,
    marginBottom: 31,
  },
  linea: {
    height: 0.25,
    backgroundColor: '#707070',
    marginBottom: 21,
  },
  titulo: {
    fontSize: 26,
    color: 'black',
    marginBottom: 8.5,
  },
  textoInformacion: {
    lineHeight: 22,
    fontSize: 14,
    color: '#909090',
    marginBottom: 34,
  },

  texto1: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 21,
  },

  titulo2: {
    fontSize: 16,
    color: 'black',
    marginBottom: 6.7,
  },
  textoDireccion: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 23,
  },
  mapa: {
    height: 200,
    borderRadius: 4,
    marginBottom: 34,
  },
  tituloServicios: {
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
  },
  textoServicios: {
    fontSize: 14,
    color: '#909090',
  },

  tituloMedidas: {
    fontSize: 16,
    color: 'black',
    marginBottom: 6.7,
  },
  textoMedidas: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 22,
  },
  contactoTitulo: {
    fontSize: 16,
    color: 'black',
    marginBottom: 18.4,
  },
  contactoTexto: {
    fontSize: 14,
    color: '#909090',
    marginLeft: 10,
  },
});
