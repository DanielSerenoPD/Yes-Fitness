import React, {useState, useContext} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import {styles} from '../theme/appTheme';
import Equis from '../../assets/imagenes/iconos-otros/Equis.svg';
import {ScrollView} from 'react-native-gesture-handler';
import LocationLight from '../../../assets/imagenes/iconos-otros/Location.svg';
import Phone from '../../assets/imagenes/iconos-otros/Phone.svg';
import Email from '../../assets/imagenes/iconos-otros/Email.svg';
import User from '../../assets/imagenes/iconos-otros/User.svg';
import LocationBlack from '../../assets/imagenes/iconos-otros/LocationBlack.svg';
import Square from '../../assets/imagenes/iconos-otros/Square.svg';

import {BotonInformacion} from '../components/Ui/BotonInformacion';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FadeInImage} from '../components/FadeInImage';
import MapView, {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthContext';
import {filter} from 'lodash';
import {EliminarFavorito} from '../components/Modales/childrens/EliminarFavorito';

interface Props extends StackScreenProps<any, any> {}

export default function InformacionScreen2({navigation, route}: Props) {
  const {width, height} = Dimensions.get('screen');

  const {datosUsuario, abrirModalSegundo} = useContext(AuthContext);

  const {
    raza,
    descripcion,
    direccionCoordenadas,
    direccionNombre,
    fotos,
    nombrePersona,
    telefono,
    status,
    correo,
    idDocumento,
    idDocumentoOriginal,
  } = route.params?.datosMascota;

  //Props del state de la lista de mis perros

  const propsData = route.params;

  const [botonActivo, setBotonActivo] = useState(true);

  const eliminarDocumentoFb = async () => {
    //Borramos el documento en la coleccion general
    await firestore()
      .collection('datosMascotas')
      .doc(idDocumentoOriginal)
      .delete();

    //Borramos el documento en los datos del usuario
    await firestore()
      .collection(`usuarios/${datosUsuario.idDocumento}/mascotasSubidas`)
      .doc(idDocumento)
      .delete();

    //actualizamos el state local
    propsData?.setArrayDatos(
      filter(propsData?.arrayDatos, datos => datos.idDocumento !== idDocumento),
    );

    navigation.pop();
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <FadeInImage
            uri={
              'https://firebasestorage.googleapis.com/v0/b/tinder-perros-desarrollo.appspot.com/o/fotos%2Fpet2.jpg?alt=media&token=f27a179d-7a6a-4a71-86fa-800a2cfa79d0'
            }
            style={{
              width: '100%',
              height: 447,
            }}
          />

          {/* Boton para salir */}

          <TouchableOpacity
            style={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 50 : 20,
              left: 20,
              width: 44,
              height: 44,
              borderRadius: 20,
              backgroundColor: 'rgba(196, 196, 196, 0.4)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
            onPress={() => navigation.pop()}>
            <Equis width={10} height={10} />
          </TouchableOpacity>

          <View
            style={{
              paddingHorizontal: 16,
              bottom: 30,
              width: 'auto',
              borderRadius: 24,

              backgroundColor: 'white',
            }}>
            <Text
              style={{
                ...styles.fontBold,
                fontSize: 36,
                textAlign: 'center',
                marginTop: 24,
              }}>
              {raza}
            </Text>

            <View
              style={{
                marginTop: 21.5,
                width: 'auto',
                height: 1.5,
                backgroundColor: '#e8e8e8',
              }}></View>

            {/* Botones */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 21.2,
              }}>
              {/* Boton 1 */}
              <TouchableOpacity onPress={() => setBotonActivo(!botonActivo)}>
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: !botonActivo ? '#f5f5f5' : 'black',
                    paddingHorizontal: 29,
                    paddingVertical: 12,
                  }}>
                  <Text
                    style={
                      !botonActivo
                        ? localStyles.botonInactivo
                        : localStyles.botonActivo
                    }>
                    Informacion
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Boton 2*/}
              <TouchableOpacity onPress={() => setBotonActivo(!botonActivo)}>
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: botonActivo ? '#f5f5f5' : 'black',
                    paddingHorizontal: 29,
                    paddingVertical: 12,
                  }}>
                  <Text
                    style={
                      botonActivo
                        ? localStyles.botonInactivo
                        : localStyles.botonActivo
                    }>
                    Ubicacion
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Datos de contacto */}
            {botonActivo ? (
              //Informacion
              <View>
                {/* Datos */}
                <View style={{marginTop: 22}}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#b0b0b0',
                      ...styles.fontMedium,
                    }}>
                    Tipo de raza
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      color: 'black',
                      ...styles.fontMedium,
                    }}>
                    {raza}
                  </Text>
                </View>

                {/* Informacion */}
                <View
                  style={{
                    marginTop: 22,
                  }}>
                  <Text
                    style={{
                      color: '#b0b0b0',
                      fontSize: 15,
                      ...styles.fontMedium,
                    }}>
                    {descripcion}
                  </Text>
                </View>

                <Text
                  style={{
                    marginTop: 22,
                    fontSize: 20,
                    color: 'black',
                    ...styles.fontMedium,
                  }}>
                  Datos de contacto
                </Text>

                <BotonInformacion
                  texto={direccionNombre}
                  icono={<LocationBlack width={26} height={26} />}
                />

                <BotonInformacion
                  texto={nombrePersona}
                  icono={<User width={26} height={26} />}
                />
                <BotonInformacion
                  texto={telefono}
                  icono={<Phone width={20} height={20} />}
                />

                <BotonInformacion
                  texto={correo}
                  icono={<Email width={26} height={26} />}
                />
                {/* Eliminar Publicacion */}
                <TouchableOpacity
                  onPress={() => {
                    abrirModalSegundo(true);
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 40,
                    height: 58,
                    backgroundColor: 'black',
                    borderRadius: 14,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 17,
                        ...styles.fontBold,
                      }}>
                      Eliminar Publicacion
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Boton para enviar datos */}
                <TouchableOpacity style={{marginTop: 25}} onPress={() => {}}>
                  <LinearGradient
                    colors={['#fe904b', '#fb724c']}
                    start={{x: 1.0, y: 0.0}}
                    end={{x: 0.0, y: 0.0}}
                    style={{
                      opacity: status !== 'pendiente' ? 1 : 0.4,

                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 6,
                      height: 58,
                      borderRadius: 14,
                    }}>
                    <Text
                      style={{
                        fontSize: 17,
                        color: 'white',
                        ...styles.fontBold,
                      }}>
                      Marcar como adoptado
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              //Ubicacion
              <MapView
                initialRegion={{
                  latitude: direccionCoordenadas.latitude,
                  longitude: direccionCoordenadas.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                style={{
                  marginTop: 22,
                  width: 'auto',
                  height: 270,
                  borderRadius: 10,
                  ...styles.colorBackground,
                }}>
                <Marker
                  coordinate={{
                    latitude: direccionCoordenadas.latitude,
                    longitude: direccionCoordenadas.longitude,
                  }}
                  title={'Direccion'}
                  description={direccionNombre}
                />
              </MapView>
            )}
          </View>
        </View>
        <EliminarFavorito
          texto="¿Estas seguro que quieres eliminar esta publicacion? Una vez hecho estos los datos desapareceran de la app"
          funcionGenerica={eliminarDocumentoFb}
        />
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  botonActivo: {
    fontSize: 13,
    ...styles.fontBold,
    color: 'white',
  },
  botonInactivo: {
    fontSize: 13,
    ...styles.fontMedium,
    color: '#b0b0b0',
  },
});
