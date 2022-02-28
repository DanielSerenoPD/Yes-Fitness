import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {styles} from '../theme/appTheme';
export const MapDraggable = ({
  modalState,
  setModalState,
  datos,
  setDatos,
}: any) => {
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setLocation({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      },
      error => {
        setLocation({
          latitude: 20.5638501,
          longitude: -103.3707341,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      },
    );
  }, []);

  //Este es el unico paso que hay que modificar manualmente

  const guardarUbicacion = () => {
    setDatos({
      ...datos,
      ['direccionCoordenadas']: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
    setModalState(!modalState);
  };

  return location !== null ? (
    <>
      <MapView
        onRegionChange={region => setLocation(region)}
        showsUserLocation
        style={{height: 550, borderRadius: 10}}
        initialRegion={location}>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          draggable
        />
      </MapView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 10,
          marginHorizontal: 15,
        }}>
        {/* Cancelar Ubicacion */}
        <TouchableOpacity
          onPress={() => {
            setModalState(!modalState);
          }}>
          <View
            style={{
              borderRadius: 10,
              backgroundColor: 'black',
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}>
            <Text
              style={{
                fontSize: 13,
                ...styles.fontBold,
                color: 'white',
              }}>
              Cancelar
            </Text>
          </View>
        </TouchableOpacity>

        {/* Guardar Ubicacion */}
        <TouchableOpacity onPress={guardarUbicacion}>
          <View
            style={{
              borderRadius: 10,
              backgroundColor: 'green',
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}>
            <Text
              style={{
                fontSize: 13,
                ...styles.fontBold,
                color: 'white',
              }}>
              Guardar Ubicacion
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  ) : (
    <></>
  );
};
