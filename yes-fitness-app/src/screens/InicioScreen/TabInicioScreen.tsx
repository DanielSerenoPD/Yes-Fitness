import React, {useEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HeaderLogo from '../../components/Header/HeaderLogo';
import LupaChica from '../../../assets/imagenes/utiles/LupaChica.svg';
import InstagramGrande from '../../../assets/imagenes/utiles/InstagramGrande.svg';

import {Favoritos} from '../../components/Favoritos';
import {Sucursal} from '../../components/Sucursal';
import {ClaseImagen} from '../../components/ClaseImagen';
import {BotonNegro2} from '../../components/Botones/BotonNegro2';
import {abrirLink} from '../../funciones/abrirLink';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthContext} from '../../context/AuthContext';
import {FadeInImage} from '../../components/FadeInImage';

interface Props extends StackScreenProps<any, any> {}

export const TabInicioScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();

  const {
    sucursalesCercanas,
    sucursalesFavoritas,

    clasesDeLaSemana,
    clasesRecomendadas,
    datosUsuario,
  } = useContext(AuthContext);

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor="white"
      />

      <View style={{marginBottom: 17.3}}>
        <HeaderLogo tieneFlecha={false} />
      </View>

      {/* Area de Scroll */}
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* Barra de busqueda*/}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Tab2');
          }}
          activeOpacity={0.6}
          style={styles.barraBusqueda}>
          <View
            style={{
              height: 19,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <LupaChica fill="black" />
            <Text style={styles.barraBusquedaText}>
              ¿Qué te va a motivar hoy?
            </Text>
          </View>
        </TouchableOpacity>

        {/* Conocer paquetes (solo nuevos usuarios) */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            navigation.navigate('NuevoUsuario');
          }}
          style={{
            width: '100%',
            height: 456,
            marginBottom: 21,
          }}>
          <FadeInImage
            uri={
              'https://firebasestorage.googleapis.com/v0/b/yes-fitness-f2c41.appspot.com/o/fotosPrueba%2Fnuevo-usuario.png?alt=media&token=4ffbe4ad-1485-4977-b67f-a6713bd1865d'
            }
            style={{
              width: '100%',
              height: 456,
            }}
          />
        </TouchableOpacity>

        {/*  */}
        <View style={{marginLeft: 24}}>
          {sucursalesFavoritas.length !== 0 && (
            <>
              {/* Favoritos */}
              <Text style={styles.favoritosText}>Favoritos</Text>

              {/* Favoritos Component */}
              <ScrollView
                bounces={false}
                style={{marginBottom: 43}}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {sucursalesFavoritas.map((dato: any, i: number) => (
                  <Favoritos
                    urlFoto={dato.datosEstudio.fotoLogo}
                    nombreEstudio={dato.nombreSucursal}
                    action={() =>
                      navigation.navigate('EstudioScreen', {datosClase: dato})
                    }
                    key={i}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* Cerca de ti */}
          <Text style={styles.titulo}>Cerca de ti</Text>

          {/* Favoritos Component */}
          <ScrollView
            bounces={false}
            style={{marginBottom: 43}}
            showsHorizontalScrollIndicator={false}
            horizontal={true}>
            {sucursalesCercanas.map(
              (dato: any, i: number) =>
                dato.datosEstudio.fotoPortada !== '' && (
                  <Sucursal
                    nombreEstudio={dato.nombreSucursal}
                    urlFoto={dato.datosEstudio.fotoPortada}
                    direccionNombre={dato.direccion}
                    action={() =>
                      navigation.navigate('EstudioScreen', {
                        datosClase: dato,
                      })
                    }
                    key={i}
                  />
                ),
            )}
          </ScrollView>

          {/* Clases */}
          {/* <Text style={styles.titulo}>Clases de la semana</Text> */}

          {/* Recomendaciones */}
          {/* <ScrollView
            bounces={false}
            style={{marginBottom: 43}}
            showsHorizontalScrollIndicator={false}
            horizontal={true}>
            {[1, 1, 1, 1, 1, 1, 1, 1, 1].map((dato, i) => (
              <ClaseImagen
                nombreEstudio={'Ejemplo'}
                nombreClase={'Ejemplo'}
                urlFoto={
                  'https://firebasestorage.googleapis.com/v0/b/yes-fitness-f2c41.appspot.com/o/fotosPrueba%2Fejemplo.png?alt=media&token=f40c3487-78ff-4309-9c84-4e608e775bbd'
                }
                direccionNombre={'Ejemplo'}
                horario={'9:00 am'}
                nombreCoach={'Ejemplo'}
                action={() => {}}
                key={i}
              />
            ))}
          </ScrollView> */}

          {/* Clases de la semana */}

          {clasesDeLaSemana.length !== 0 && (
            <>
              <Text style={styles.titulo2}>Clases de la semana</Text>
              <Text
                style={{fontSize: 16, color: 'black', marginBottom: 0}}></Text>
              <ScrollView
                bounces={false}
                style={{marginBottom: 84.5}}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {clasesDeLaSemana.map((dato: any, i: number) => (
                  <ClaseImagen
                    nombreEstudio={dato.nombreSucursal}
                    nombreClase={dato.datosClase.nombreClase}
                    urlFoto={dato.datosEstudio.fotoPortada}
                    direccionNombre={dato.direccion}
                    horario={dato.horario}
                    nombreCoach={dato.datosCoach.nombreCoach}
                    action={() =>
                      navigation.navigate('ApartarClaseScreen', {
                        datosClase: {...dato, datosRecomendados: true},
                      })
                    }
                    key={i}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* Recomendaciones */}

          {clasesRecomendadas.length !== 0 && (
            <>
              <Text style={styles.titulo2}>Descubrimiento semanal</Text>
              <Text style={{fontSize: 16, color: 'black', marginBottom: 22}}>
                {'Clases similares a ' + datosUsuario.ultimaClase.nombreClase}
              </Text>
              <ScrollView
                bounces={false}
                style={{marginBottom: 84.5}}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {clasesRecomendadas.map((dato: any, i: number) => (
                  <ClaseImagen
                    nombreEstudio={dato.nombreSucursal}
                    nombreClase={dato.datosClase.nombreClase}
                    urlFoto={dato.datosEstudio.fotoPortada}
                    direccionNombre={dato.direccion}
                    horario={dato.horario}
                    nombreCoach={dato.datosCoach.nombreCoach}
                    action={() =>
                      navigation.navigate('ApartarClaseScreen', {
                        datosClase: {...dato, datosRecomendados: true},
                      })
                    }
                    key={i}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* icono */}
          <View style={{marginBottom: 18}}>
            <InstagramGrande fill="black" />
          </View>
          <Text style={styles.texto2}>¿Buscas más?</Text>
          <Text style={styles.texto3}>
            Encuentra más contenido y recomendaciones en nuestra cuenta.
          </Text>

          <BotonNegro2
            action={() => abrirLink('https://instagram.com')}
            title={'Síguenos en Instagram'}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  barraBusqueda: {
    marginHorizontal: 24,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#828282',
    marginBottom: 34,
    marginTop: 5,
  },
  barraBusquedaText: {
    fontSize: 16,
    marginLeft: 7,
  },
  favoritosText: {
    fontSize: 18,
    color: '#0B0B0B',
    marginBottom: 19,
  },
  titulo: {
    fontSize: 24,
    color: '#0B0B0B',
    marginBottom: 22,
  },

  titulo2: {
    fontSize: 24,
    color: '#0B0B0B',
    marginBottom: 10,
  },
  texto2: {
    fontSize: 24,
    color: 'black',
    marginBottom: 25.1,
  },
  texto3: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
    marginBottom: 20.9,
    width: 331,
  },
});
