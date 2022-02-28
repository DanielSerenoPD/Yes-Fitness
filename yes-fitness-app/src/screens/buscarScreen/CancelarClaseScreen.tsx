import React, {useContext, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {FooterApartar} from '../../components/FooterApartar';
import HeaderNormal from '../../components/Header/HeaderNormal';
import CorazonChico from '../../../assets/imagenes/utiles/CorazonChico.svg';
import CorazonNegro from '../../../assets/imagenes/utiles/CorazonNegro.svg';
import AñadirAmigos from '../../../assets/imagenes/utiles/AñadirAmigos.svg';
import FlechaDerecha from '../../../assets/imagenes/utiles/FlechaDerecha.svg';

//iconos servicios
import Estacionamiento from '../../../assets/imagenes/iconos-servicios/Estacionamiento.svg';
import Regaderas from '../../../assets/imagenes/iconos-servicios/Regaderas.svg';
import Lockers from '../../../assets/imagenes/iconos-servicios/Lockers.svg';
import {FadeInImage} from '../../components/FadeInImage';
import MapView, {Marker} from 'react-native-maps';
import {Slider} from '../../components/Slider/Slider';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../context/AuthContext';
import {ModalCargando} from '../../components/ModalCargando';

interface Props extends StackScreenProps<any, any> {}

export const CancelarClaseScreen = ({navigation, route}: Props) => {
  const insets = useSafeAreaInsets();

  const [verificadorCancelacion, setVerificadorCancelacion] = useState(false);

  const {
    datosEstudio,
    datosClase,
    datosCoach,
    coordenadas,
    horario,
    horarioValor,
    datosHorario,
    nombreSucursal,
    direccion,
    idSucursal,
    idFranquicia,
    fechaFormatoHoyTiempo,
    idDocumento,
    idReserva,

    idEstadisticasGeneral,
    idEstadisticasSucursal,
  } = route.params?.datosClase;

  const {añoActual, mesActual} = route.params?.datosFechasClase;

  const {
    datosUsuario,
    sucursalesFavoritas,
    setSucursalesFavoritas,
    sucursales,
    setDatosUsuarioPerfil,
    abrirModal,
    diaSeleccionado,
    setProximasClases,
    proximasClases,
    setClasesRecomendadas,
    clasesRecomendadas,
  } = useContext(AuthContext);

  const {
    fotosGaleria,
    descripcionEstudio,

    fotoPortada,
    instagram,
    medidasSalud,
    facebook,
    servicios,
  } = datosEstudio;

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

  //funciones para darle formato a ciertos textos

  const formatearDuracion = () => {
    var hours = Math.floor(datosHorario.duracion / 60);
    var minutes = datosHorario.minutos % 60;

    const valorHoras = hours + ':' + minutes;

    const primerosNumeros = horario.split(':').shift();

    const horaFinal = hours + parseInt(primerosNumeros);

    const minutosFinal =
      minutes.toString().length === 1 ? `0${minutes}` : minutes;

    const horaFinalFormato = horaFinal + ':' + minutosFinal;

    return `${horario}- ${horaFinalFormato} ${datosHorario.tiempo} `;
  };

  const formatearFechaHoy = () => {
    let fecha = new Date(fechaFormatoHoyTiempo);

    let diaTexto = fecha.toLocaleDateString('es', {weekday: 'long'});
    let diaNumero = fecha.getDate();
    let diaNumeroResultado =
      diaNumero.toString().length === 1 ? `0${diaNumero}` : diaNumero;

    let mesTexto = fecha.toLocaleDateString('es', {month: 'long'});

    let diaTextoResultado =
      diaTexto.charAt(0).toUpperCase() + diaTexto.slice(1);

    let mesTextoResultado =
      mesTexto.charAt(0).toUpperCase() + mesTexto.slice(1);

    return `${diaTextoResultado} ${diaNumeroResultado} de ${mesTextoResultado}`;
  };

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

  //funcion para cancelar la clase
  const cancelarClase = async () => {
    //creamos los datos necesarios relacionados con el tiempo
    let fecha = new Date();
    let fechaClase = new Date(fechaFormatoHoyTiempo);
    //estos son los datos en el momento en el que se hizo la reserva
    // let añoActual = route.params?.creado.toDate().getFullYear();
    // let mesActual = route.params?.creado.toDate().getMonth();
    let añoClase = fecha.getFullYear();
    let mesClase = fecha.getMonth();

    //primero comprobamos si esta dentro del tiempo de anticipacion
    //para cancelar la clase //****Pendiente */

    //creamos nuestras referencias a firebase
    let sucursalReservasRef = `datosAsociados/${idFranquicia}/sucursales/${idSucursal}/clasesReservadas/${añoClase}/${mesClase}`;
    let sucursalEstadisticasRef = `datosAsociados/${idFranquicia}/sucursales/${idSucursal}/estadisticas/${añoActual}/${mesActual}`;
    let sucursalUsuariosHistorialRef = `datosAsociados/${idFranquicia}/sucursales/${idSucursal}/usuariosHistorial`;
    let estadisticasGeneralesRef = `datosGenerales/datos/estadisticas/${añoActual}/${mesActual}`;

    // console.log(route.params?.datosClase.idEstadisticasSucursal);
    // return;

    let datosUsuarioHistorialClasesRef = `usuarios/${datosUsuario.idDocumento}/historialClases`;

    try {
      abrirModal(true);

      //comprobamos que la clase no haya sido cancelada ya
      const datosReserva: any = await firestore()
        .collection(sucursalReservasRef)
        .doc(idReserva)
        .get();

      if (datosReserva.data().cancelada === true) {
        //si esta cancelada no solo detenemos la operacion
        //si no que tambien borramos los datos de reservas
        //del state local
        const nuevasClasesProximas: any = proximasClases.filter(
          (data: any) => data.idDocumento !== idDocumento,
        );
        setProximasClases(nuevasClasesProximas);
        Alert.alert('Esta clase ya esta marcada como cancelada');
        abrirModal(false);
        return;
      } else {
        //por seguridad solo comprobamos que el usuario este en la lista de reserva
        //esto es por si cancelan la clase y por algo la vuelven a activar
        //y el usuario sigue sin actualizar sus datos
        let estaEnLaLista: any = false;

        datosReserva.data().usuariosReservacion.forEach((datos: any) => {
          if (datos.idDocumentoUsuario === datosUsuario.idDocumento) {
            estaEnLaLista = true;
          }
        });

        if (estaEnLaLista === false) {
          const nuevasClasesProximas: any = proximasClases.filter(
            (data: any) => data.idDocumento !== idDocumento,
          );
          setProximasClases(nuevasClasesProximas);

          if (verificadorCancelacion === false) {
            //le devolvemos una reserva al usuario
            setDatosUsuarioPerfil({
              ...datosUsuario,
              clases: datosUsuario.clases + 1,
            });
          }

          //cambiamos el verificador de cancelacion a true
          //esto es para evitar un loop en donde se le suban las clases al usuario
          setVerificadorCancelacion(true);
          Alert.alert('Esta clase ya esta marcada como cancelada');

          abrirModal(false);
          return;
        }

        //obtenemos los datos del historial del usuario en su debida sucursal
        const resultadoUsuarioDato = await firestore()
          .collection(sucursalUsuariosHistorialRef)
          .where('idDocumentoUsuario', '==', datosUsuario.idDocumento)
          .get();

        let historialUsuarioDatos: any = {};

        resultadoUsuarioDato.forEach((dato: any) => {
          historialUsuarioDatos = {
            ...dato.data(),
            idDocumento: dato.id,
          };
        });

        //filtramos el nuevo array de reservas pero ya sin los
        // datos de este usuario
        const reservacionesFiltrado: any = datosReserva
          .data()
          .usuariosReservacion.filter(
            (data: any) => data.idDocumentoUsuario !== idDocumento,
          );

        //****Comenzamos con la operaciones Batch */
        const batch = firestore().batch();

        //1----//////
        //ACTUALIZAMOS LAS ESTADISTICAS GENERALES
        batch.delete(
          firestore()
            .collection(estadisticasGeneralesRef)
            .doc(idEstadisticasGeneral),
        );

        //2----//////
        //ACTUALIZAMOS LAS ESTADISTICAS DE LA SUCURSAL

        batch.delete(
          firestore()
            .collection(sucursalEstadisticasRef)
            .doc(idEstadisticasSucursal),
        );

        //3----//////
        //ACTUALIZAMOS LOS DATOS DE LA RESERVA
        batch.update(
          firestore().collection(sucursalReservasRef).doc(idReserva),
          {
            usuariosReservacion: reservacionesFiltrado,
            numeroLugaresDisponibles: firestore.FieldValue.increment(1),
          },
        );

        //4----//////
        //ACTUALIZAMOS LOS DATOS DEL HISTORIAL DEL USUARIO EN SU DEBIDA SUCURSAL

        //si era la primera vez del usuario eliminamos los datos del historial

        if (historialUsuarioDatos.visitas === 1) {
          batch.delete(
            firestore()
              .collection(sucursalUsuariosHistorialRef)
              .doc(historialUsuarioDatos.idDocumento),
          );
        } else {
          batch.update(
            firestore()
              .collection(sucursalUsuariosHistorialRef)
              .doc(historialUsuarioDatos.idDocumento),
            {
              visitas: firestore.FieldValue.increment(-1),

              fechaActual: historialUsuarioDatos.fechaPasada,
            },
          );
        }

        //5----//////
        //ACTUALIZAMOS LOS DATOS DEL HISTORIAL DEL USUARIO EN SUS DATOS DE LA APP
        batch.delete(
          firestore()
            .collection(datosUsuarioHistorialClasesRef)
            .doc(idDocumento),
        );

        //6-----///
        //INCREMENTAMOS UNA CLASE PARA EL USUARIO
        //(ya que como cancelo tecnicamente es una devolucion)
        batch.update(
          firestore().collection('usuarios').doc(datosUsuario.idDocumento),
          {
            clases: firestore.FieldValue.increment(1),
          },
        );

        //7----//////
        //EJECUTAMOS EL BATCH WRITE
        await batch.commit();

        //------FIN DEL BATCH ------//

        //Actualizamos el state local de clases proximas
        const nuevasClasesProximas: any = proximasClases.filter(
          (data: any) => data.idDocumento !== idDocumento,
        );
        setProximasClases(nuevasClasesProximas);

        //le devolvemos una reserva al usuario
        setDatosUsuarioPerfil({
          ...datosUsuario,
          clases: datosUsuario.clases + 1,
        });

        abrirModal(false);
        //MANDAMOS AL USUARIO a la pantalla de cancelacion exitosa
        navigation.navigate('ReservaCanceladaScreen');
      }
    } catch (error) {
      abrirModal(false);
      Alert.alert('Hubo un error');
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
        <Slider arrayFotos={fotosGaleria} />

        {/*  */}
        <View style={{marginHorizontal: 24, marginBottom: 20}}>
          <Text style={styles.titulo}>{datosClase.nombreClase}</Text>
          <Text style={styles.texto1}>{formatearFechaHoy()}</Text>
          <Text style={styles.texto1}>{formatearDuracion()}</Text>
          <Text
            style={{
              ...styles.texto1,
              marginBottom: 40,
            }}>{`Coach: ${datosCoach.nombreCoach}`}</Text>

          {/* Invitar Amigos */}

          <TouchableOpacity
            onPress={compartir}
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 22,
            }}>
            <AñadirAmigos fill="black" />
            <Text style={{marginLeft: 7, fontSize: 16}}>Invitar amigos</Text>
          </TouchableOpacity>
          <View style={styles.linea} />

          <Text style={styles.titulo2}>Acerca de la clase:</Text>

          <Text style={styles.textoInformacion}>{descripcionEstudio}</Text>
          <View style={{...styles.linea, marginBottom: 31.7}} />

          {/* Redireccion al estudio */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('HorariosEstudioScreen', {
                datosEstudio: {
                  idSucursal,
                  nombreSucursal,
                },
              });
            }}
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 32,
            }}>
            <Text style={{fontSize: 16, color: 'black'}}>{nombreSucursal}</Text>
            <FlechaDerecha fill="black" />
          </TouchableOpacity>

          <View style={styles.linea} />

          {/* Direccion */}

          <Text style={styles.titulo2}>Dirección</Text>
          <Text style={styles.textoDireccion}>{direccion}</Text>
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
                  <Regaderas fill="black" />
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
                  <Lockers fill="black" />
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
        </View>
      </ScrollView>

      {/* Footer */}
      <FooterApartar
        textoBoton="Cancelar"
        action={() => {
          cancelarClase();
        }}
        tipo="cancelar"
        horaFormato={formatearDuracion()}
        action2={() => {
          navigation.navigate('HorariosEstudioScreen', {
            datosEstudio: {
              idSucursal,
              nombreSucursal,
            },
          });
        }}
      />
      <ModalCargando />
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
    marginBottom: 20.8,
  },

  texto1: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 2,
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
    marginBottom: 42.9,
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
