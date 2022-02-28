import React, {useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {FooterApartar} from '../../components/FooterApartar';
import HeaderNormal from '../../components/Header/HeaderNormal';
import CorazonChico from '../../../assets/imagenes/utiles/CorazonChico.svg';
import CorazonNegro from '../../../assets/imagenes/utiles/CorazonNegro.svg';
import TelefonoChico from '../../../assets/imagenes/utiles/TelefonoChico.svg';
import InstagramChico from '../../../assets/imagenes/utiles/InstagramChico.svg';
import AñadirAmigos from '../../../assets/imagenes/utiles/AñadirAmigos.svg';
import FlechaDerecha from '../../../assets/imagenes/utiles/FlechaDerecha.svg';

//iconos servicios
import Estacionamiento from '../../../assets/imagenes/iconos-servicios/Estacionamiento.svg';
import Regaderas from '../../../assets/imagenes/iconos-servicios/Regaderas.svg';
import Lockers from '../../../assets/imagenes/iconos-servicios/Lockers.svg';
import {FadeInImage} from '../../components/FadeInImage';
import MapView, {Marker} from 'react-native-maps';
import {Slider} from '../../components/Slider/Slider';
import {AuthContext} from '../../context/AuthContext';
import {ModalCargando} from '../../components/ModalCargando';

interface Props extends StackScreenProps<any, any> {}

export const ApartarClaseScreen = ({navigation, route}: Props) => {
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
    idDocumento,
  } = route.params?.datosClase;

  let {
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

  //si se accede desde clases recomendadas
  // o desde clases de la semana

  if (route.params?.datosClase.datosRecomendados) {
    console.log(diaSeleccionado);

    diaSeleccionado = {
      ...diaSeleccionado,
      fechaFormato: new Date(),
    };
  }

  const {
    fotosGaleria,
    descripcionEstudio,

    fotoPortada,
    instagram,
    medidasSalud,
    facebook,
    servicios,
  } = datosEstudio;

  const insets = useSafeAreaInsets();

  //funciones para darle formato a ciertos textos

  const formatearDuracion = () => {
    var hours = Math.floor(datosHorario.duracion / 60);
    var minutes = datosHorario.minutos % 60;

    const valorHoras = hours + ':' + minutes;

    const primerosNumeros = horario.split(':').shift();

    const horaFinal = hours + parseInt(primerosNumeros);

    console.log(horaFinal);

    const minutosFinal =
      minutes.toString().length === 1 ? `0${minutes}` : minutes;

    const horaFinalFormato = horaFinal + ':' + minutosFinal;

    return `${horario}- ${horaFinalFormato} ${datosHorario.tiempo} `;
  };

  const formatearFechaHoy = () => {
    let fecha = diaSeleccionado.fechaFormato;

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

  //funcion para apartar la clase
  const apartarClase = async () => {
    //creamos los datos necesarios relacionados con el tiempo
    let fecha = new Date();

    let añoActual = fecha.getFullYear();
    let mesActual = fecha.getMonth();
    let añoClase = diaSeleccionado.fechaFormato.getFullYear();
    let mesClase = diaSeleccionado.fechaFormato.getMonth();

    //Obtenemos el numero de mes y año
    let año = diaSeleccionado.fechaFormato.getFullYear();
    //sacamos la fecha completa: ej: 13/20/2021
    let fechaReserva = diaSeleccionado.fechaFormato.toLocaleDateString('es');
    let fechaHoy: any = new Date();
    //Recuerda el mes es en numero
    let mes = fechaHoy.getMonth();
    //sacamos el valor del momento exacto
    let tiempoExacto = fechaHoy.getHours() + fechaHoy.getMinutes() / 100;

    fechaHoy = fechaHoy.toLocaleDateString('es');

    try {
      abrirModal(true);

      console.log(horarioValor);
      console.log(tiempoExacto);

      //de entrada comprobamos que este todavia dentro de la hora
      //SOLO aplica si es hoy
      if (fechaHoy === fechaReserva) {
        if (horarioValor < tiempoExacto) {
          Alert.alert(
            'Lo sentimos',
            'Esta clase ya paso del horario permitido',
          );
          abrirModal(false);
          return;
        }
      }

      //de entrada comprobamos si el usuario tiene clases disponibles
      if (datosUsuario.clases === 0) {
        Alert.alert('Lo sentimos', 'No tienes clases disponibles');
        abrirModal(false);
        return;
      }

      //Por seguridad se vuelve a sacar el numero de reservas
      const numeroReservasRef: any = await firestore()
        .collection('clasesActivas')
        .doc(idDocumento)
        .get();
      const numeroReservas = numeroReservasRef.data().numeroLugares;

      //creamos la referencia a la coleccion de reservas
      //propia de la sucursal

      let sucursalReservasRef = `datosAsociados/${idFranquicia}/sucursales/${idSucursal}/clasesReservadas/${añoClase}/${mesClase}`;
      let sucursalEstadisticasRef = `datosAsociados/${idFranquicia}/sucursales/${idSucursal}/estadisticas/${añoActual}/${mesActual}`;
      let sucursalUsuariosHistorialRef = `datosAsociados/${idFranquicia}/sucursales/${idSucursal}/usuariosHistorial`;
      let estadisticasGeneralesRef = `datosGenerales/datos/estadisticas/${añoActual}/${mesActual}`;
      let datosUsuarioRef = `usuarios/${datosUsuario.idDocumento}`;

      const resultadoClase = await firestore()
        .collection(sucursalReservasRef)
        .where('fechaReserva', '==', fechaReserva)
        .where('idClase', '==', idDocumento)
        .get();

      let datosReserva: any = {};

      resultadoClase.forEach((dato: any) => {
        datosReserva = {...dato.data(), idDocumento: dato.id};
      });

      //primero comprobamos si la reserva existe (SI datos reserva esta vacio quiere decir que no existe)
      //Esto puede ocurrir debir a que
      if (datosReserva.idDocumento) {
        //comprobamos si esta cancelada
        if (datosReserva.cancelada === true) {
          Alert.alert(
            'Lo sentimos',
            'Esta clase se encuentra cancelada para el dia que ingresaste',
          );
          abrirModal(false);
          return;
        }

        //comprobamos si hay lugar
        if (datosReserva.lugaresDisponibles === 0) {
          Alert.alert(
            'Lo sentimos',
            'No puedes apartar esta clase ya que ya no hay lugares disponibles',
          );
          abrirModal(false);
          return;
        }

        //comprobamos que el usuario no tenga reservado a la misma hora
        let validador: any = false;
        proximasClases.forEach((dato: any) => {
          if (dato.fechaReserva === fechaReserva && dato.horario === horario) {
            validador = true;
          }
        });

        if (validador === true) {
          Alert.alert(
            'Lo sentimos',
            'No puedes apartar esta clase ya que tienes otra apartada en la misma hora.',
          );
          abrirModal(false);
          return;
        }

        //comprobamos si ya existen datos de este usuario en la base
        // de datos de la sucursal
        const resultadoUsuarioDato = await firestore()
          .collection(sucursalUsuariosHistorialRef)
          .where('idDocumentoUsuario', '==', datosUsuario.idDocumento)
          .get();
        let historialUsuario: any = {};

        resultadoUsuarioDato.forEach((dato: any) => {
          historialUsuario = {...dato.data(), idDocumento: dato.id};
        });

        //modificamos los dato de usuario de una ve<
        if (historialUsuario.idDocumento) {
          //si existen los datos
          historialUsuario = {
            ...historialUsuario,
            visitas: historialUsuario.visitas + 1,
            fechaActual: fechaReserva,
            fechaPasada: historialUsuario.fechaActual,
          };
        }

        //--------------COMENZAMOS CON LAS OPERACIONES BATCH --------

        //iniciamos el batch
        const batch = firestore().batch();

        //1----/////
        //Actualizar datos del historial de usuario en sucursal
        if (historialUsuario.idDocumento) {
          batch.update(
            firestore()
              .collection(sucursalUsuariosHistorialRef)
              .doc(historialUsuario.idDocumento),

            {
              ...historialUsuario,
            },
          );
        } else {
          //crear los datos del historial en caso contrario
          const trucoIdHistorial = firestore().collection('sample');
          const idHistorial = trucoIdHistorial.doc().id;
          batch.set(
            firestore()
              .collection(sucursalUsuariosHistorialRef)
              .doc(idHistorial),
            {
              nombreUsuario: datosUsuario.nombreCompleto,
              visitas: 1,
              fechaActual: fechaReserva,
              fechaPasada: 'Es primera vez',
              primeraVisita: fechaReserva,
              creado: new Date(),
              idDocumentoUsuario: datosUsuario.idDocumento,
            },
          );
        }

        // transformamos los datos de la fecha
        // a numerico, esto es para poder acomodar correctamente
        // las proximas clases y tenga coherencia;

        //ej: new Date(año,mesNumero,mesdias,hora,minutos);
        let año = diaSeleccionado.fechaFormato.getFullYear();
        let mes = diaSeleccionado.fechaFormato.getMonth();
        let dia = diaSeleccionado.fechaFormato.getDate();
        let hora = datosHorario.hora;
        let minutos = datosHorario.minutos;
        let fechaFormatoHoyTiempo = new Date(
          año,
          mes,
          dia,
          hora,
          minutos,
        ).getTime();

        //2----/////
        //actualizar estadisticas de sucursal
        const trucoIdEstadisticas = firestore().collection('sample');
        const idEstadisticas = trucoIdEstadisticas.doc().id;
        batch.set(
          firestore().collection(sucursalEstadisticasRef).doc(idEstadisticas),
          {
            fechaFormatoHoyTiempo,
            fechaReserva,
            idDocumentoUsuario: datosUsuario.idDocumento,

            ...route.params?.datosClase,

            idReserva: datosReserva.idDocumento,
          },
        );

        //3----/////
        //actualizar estadisticas generales de la empresa
        const trucoIdGeneral = firestore().collection('sample');
        const idGeneral = trucoIdGeneral.doc().id;
        batch.set(
          firestore().collection(estadisticasGeneralesRef).doc(idGeneral),
          {
            fechaFormatoHoyTiempo,
            fechaReserva,
            idDocumentoUsuario: datosUsuario.idDocumento,

            ...route.params?.datosClase,
            idReserva: datosReserva.idDocumento,
          },
        );

        //actualizamos el historial de las clases

        //output ej://3434343490

        const trucoIdHistorial = firestore().collection('sample');
        const idHistorial = trucoIdHistorial.doc().id;

        batch.set(
          firestore()
            .collection(`usuarios/${datosUsuario.idDocumento}/historialClases`)
            .doc(idHistorial),
          {
            fechaFormatoHoyTiempo,
            creado: new Date(),
            fechaReserva,

            ...route.params?.datosClase,
            idReserva: datosReserva.idDocumento,

            idEstadisticasGeneral: idGeneral,
            idEstadisticasSucursal: idEstadisticas,
          },
        );

        //4----/////
        //actualizar los datos de la reserva ya existente en la sucursal
        //realmente solo se añade el nuevo usuario con reserva
        batch.update(
          firestore()
            .collection(sucursalReservasRef)
            .doc(datosReserva.idDocumento),
          {
            numeroLugaresDisponibles: datosReserva.numeroLugaresDisponibles - 1,
            usuariosReservacion: [
              {
                nombreUsuario: datosUsuario.nombreCompleto,
                idDocumentoUsuario: datosUsuario.idDocumento,
                correo: datosUsuario.correo,
                asistio: null,
                cancelo: false,
                idHistorial,
              },
              ...datosReserva.usuariosReservacion,
            ],
          },
        );

        //5----/////
        //Actualizar los datos del usuario
        batch.update(
          firestore().collection('usuarios').doc(datosUsuario.idDocumento),
          {
            clases: datosUsuario.clases - 1,
            ultimaClase: {
              categoria: datosClase.categoria,
              nombreSucursal: nombreSucursal,
              nombreClase: datosClase.nombreClase,
              idClase: idDocumento,
            },
          },
        );

        //No OLVIDES pasar el id del historial a los datos locales

        //6----//////
        //EJECUTAMOS EL BATCH WRITE
        await batch.commit();

        //6----//////
        //HACEMOS LOS CAMBIOS LOCALES
        //Todos los locales se ejecutan una vez
        //se hayan acabado las operaciones batch

        //actualizar los datos del usuario
        setDatosUsuarioPerfil({
          ...datosUsuario,
          clases: datosUsuario.clases - 1,
          ultimaClase: {
            categoria: datosClase.categoria,
            nombreSucursal: nombreSucursal,
            nombreClase: datosClase.nombreClase,
            idClase: idDocumento,
          },
          // proximasClases: nuevoArrayHistorialResultado,
          // clasesRecomendadas:
          //   nuevasClasesDeLaSemana.length === 0
          //     ? [...datosUsuario.clasesRecomendadas]
          //     : nuevasClasesDeLaSemana,
        });

        //7----//////
        //ACTUALIZAMOS CLASES PROXIMAS

        let horaActualFormato = new Date();
        let horaActual =
          horaActualFormato.getHours() + horaActualFormato.getMinutes() / 100;
        let nuevasClasesDeLaSemana: any = [];

        let diaSemana = horaActualFormato
          .toLocaleDateString('es-ES', {
            weekday: 'long',
          })
          .slice(0, 3);

        //antes de actualizar acomodamos las fechas
        //del historial por hora
        let nuevoArrayHistorial: any = [
          ...proximasClases,
          {
            ...route.params?.datosClase,
            idDocumento: idHistorial,
            creado: new Date(),
            fechaReserva,
            esLocal: true,
            idEstadisticasGeneral: idGeneral,
            idEstadisticasSucursal: idEstadisticas,

            idReserva: datosReserva.idDocumento,
            fechaFormatoHoyTiempo,
          },
        ];

        //hacemos el calculo

        const nuevoArrayHistorialResultado = nuevoArrayHistorial.sort(
          (a: any, b: any) => a.fechaFormatoHoyTiempo - b.fechaFormatoHoyTiempo,
        );

        //Actualizamos las clases proximas en el state
        setProximasClases(nuevoArrayHistorialResultado);

        //8----//////
        //actualizar las clases recomendadas o de inteligencia artificial
        //checamos si ya existia un dato previo o si es primera vez

        if (datosUsuario.ultimaClase.categoria) {
          //comprobamos si la ultima clase tiene la
          //misma categoria que esta si no traemos mas clases

          if (datosUsuario.ultimaClase.categoria === datosClase.categoria) {
            //la categoria es la misma por lo tanto no se hace nada
          } else {
            //la categoria es diferente por lo tanto se traen nuevos datos
            const paso1: any = await firestore()
              .collection('clasesActivas')

              .where('horarioValor', '>=', horaActual)
              .where('datosClase.categoria', '==', datosClase.categoria)
              .where('fechaTerminoActiva', '==', false)
              .where('fechaTermino', '==', null)
              .where('tipoClase', '==', 'periodica')
              .where('diasActivos', 'array-contains', diaSemana)
              .orderBy('horarioValor', 'asc')
              .limit(6)
              .get();

            let verificador = false;

            paso1.forEach((dato: any, index: number) => {
              //comprobamos que la clase no sea la misma
              // que la clase similar
              //SOLO PUEDEN SER 5

              if (datosUsuario.ultimaClase.idClase === dato.id) {
                verificador = true;

                return;
              }

              if (index === 5 && verificador === true) {
                return;
              }

              nuevasClasesDeLaSemana.push({
                ...dato.data(),
                idDocumento: dato.id,
              });
            });
          }
        } else {
          const paso1: any = await firestore()
            .collection('clasesActivas')

            .where('horarioValor', '>=', horaActual)
            .where('datosClase.categoria', '==', datosClase.categoria)
            .where('fechaTerminoActiva', '==', false)
            .where('fechaTermino', '==', null)
            .where('tipoClase', '==', 'periodica')
            .where('diasActivos', 'array-contains', diaSemana)
            .orderBy('horarioValor', 'asc')
            .limit(6)
            .get();

          let verificador = false;

          paso1.forEach((dato: any, index: number) => {
            //comprobamos que la clase no sea la misma
            // que la clase similar
            //SOLO PUEDEN SER 5

            if (datosUsuario.ultimaClase.idClase === dato.id) {
              verificador = true;

              return;
            }

            if (index === 5 && verificador === true) {
              return;
            }

            nuevasClasesDeLaSemana.push({...dato.data(), idDocumento: dato.id});
          });
        }

        //ACTUALIZAMOS las clases recomendadas
        setClasesRecomendadas(
          nuevasClasesDeLaSemana.length === 0
            ? clasesRecomendadas
            : nuevasClasesDeLaSemana,
        );

        //si todo salio bien procedemos a la pantalla de reserva exitosa
        navigation.navigate('ReservaExitosaScreen');

        abrirModal(false);
      } else {
        //la reservacion se hace por primera vez
        // osea este usuario es el primero en agendar
        //clase con estos datos

        //comprobamos si ya existen datos de este usuario en la base
        // de datos de la sucursal
        const resultadoUsuarioDato = await firestore()
          .collection(
            `datosAsociados/${idFranquicia}/sucursales/${idSucursal}/usuariosHistorial`,
          )
          .where('idDocumentoUsuario', '==', datosUsuario.idDocumento)
          .get();

        let historialUsuario: any = {};

        resultadoUsuarioDato.forEach((dato: any) => {
          historialUsuario = {...dato.data(), idDocumento: dato.id};
        });

        if (historialUsuario.idDocumento) {
          //si existen los datos
          historialUsuario = {
            ...historialUsuario,
            visitas: historialUsuario.visitas + 1,
            fechaActual: fechaReserva,
            fechaPasada: historialUsuario.fechaActual,
          };
        }

        //--------------COMENZAMOS CON LAS OPERACIONES BATCH --------

        //iniciamos el batch
        const batch = firestore().batch();

        //1----/////

        //creamos la reserva (ES LA UNICA QUE NO ES BATCH YA QUE SE NECESIDA EL ID DE ESTA)

        //actualizamos el historial de las clases
        const trucoIdHistorial = firestore().collection('sample');
        const idHistorial = trucoIdHistorial.doc().id;

        const resultadoReserva = await firestore()
          .collection(sucursalReservasRef)
          .add({
            cancelada: false,
            //se resta uno ya que en si el usuario esta reservando
            numeroLugaresDisponibles: numeroReservas - 1,
            numeroLugares: numeroReservas,
            horario: horario,
            horarioValor: horarioValor,
            fechaFormato: new Date(),
            datosCoach,
            datosClase,
            datosHorario,
            idClase: idDocumento,
            fechaReserva,
            usuariosReservacion: [
              {
                nombreUsuario: datosUsuario.nombreCompleto,
                idDocumentoUsuario: datosUsuario.idDocumento,
                correo: datosUsuario.correo,
                asistio: null,
                cancelo: false,
                idHistorial,
              },
            ],
          });

        const idReserva: string = resultadoReserva.id;

        //2----/////
        //Actualizar datos del historial de usuario en sucursal
        if (historialUsuario.idDocumento) {
          batch.update(
            firestore()
              .collection(sucursalUsuariosHistorialRef)
              .doc(historialUsuario.idDocumento),
            {
              ...historialUsuario,
            },
          );
        } else {
          //crear los datos del historial en caso contrario
          const trucoIdHistorial = firestore().collection('sample');
          const idHistorial = trucoIdHistorial.doc().id;
          batch.set(
            firestore()
              .collection(sucursalUsuariosHistorialRef)
              .doc(idHistorial),
            {
              nombreUsuario: datosUsuario.nombreCompleto,
              visitas: 1,
              fechaActual: fechaReserva,
              fechaPasada: 'Es primera vez',
              primeraVisita: fechaReserva,
              creado: new Date(),
              idDocumentoUsuario: datosUsuario.idDocumento,
            },
          );
        }

        let año = diaSeleccionado.fechaFormato.getFullYear();
        let mes = diaSeleccionado.fechaFormato.getMonth();
        let dia = diaSeleccionado.fechaFormato.getDate();
        let hora = datosHorario.hora;
        let minutos = datosHorario.minutos;
        let fechaFormatoHoyTiempo = new Date(
          año,
          mes,
          dia,
          hora,
          minutos,
        ).getTime();

        //3----/////
        //actualizar estadisticas de sucursal
        const trucoIdEstadisticas = firestore().collection('sample');
        const idEstadisticas = trucoIdEstadisticas.doc().id;
        batch.set(
          firestore().collection(sucursalEstadisticasRef).doc(idEstadisticas),
          {
            fechaFormatoHoyTiempo,
            fechaReserva,
            idDocumentoUsuario: datosUsuario.idDocumento,

            ...route.params?.datosClase,
            idReserva,
          },
        );

        //4----/////
        //actualizar estadisticas generales de la empresa
        const trucoIdGeneral = firestore().collection('sample');
        const idGeneral = trucoIdGeneral.doc().id;
        batch.set(
          firestore().collection(estadisticasGeneralesRef).doc(idGeneral),
          {
            fechaFormatoHoyTiempo,
            fechaReserva,
            idDocumentoUsuario: datosUsuario.idDocumento,

            ...route.params?.datosClase,
            idReserva,
          },
        );

        //5----/////
        //Actualizar los datos del usuario
        batch.update(
          firestore().collection('usuarios').doc(datosUsuario.idDocumento),
          {
            clases: datosUsuario.clases - 1,
            ultimaClase: {
              categoria: datosClase.categoria,
              nombreSucursal: nombreSucursal,
              nombreClase: datosClase.nombreClase,
              idClase: idDocumento,
            },
          },
        );

        //output ej://3434343490;

        batch.set(
          firestore()
            .collection(`usuarios/${datosUsuario.idDocumento}/historialClases`)
            .doc(idHistorial),
          {
            creado: new Date(),
            fechaReserva,

            ...route.params?.datosClase,
            idReserva: idReserva,
            fechaFormatoHoyTiempo,
            idEstadisticasGeneral: idGeneral,
            idEstadisticasSucursal: idEstadisticas,
          },
        );

        //6----//////
        //EJECUTAMOS EL BATCH WRITE
        await batch.commit();

        //6----//////
        //HACEMOS LOS CAMBIOS LOCALES
        //Todos los locales se ejecutan una vez
        //se hayan acabado las operaciones batch

        //actualizar los datos del usuario
        setDatosUsuarioPerfil({
          ...datosUsuario,
          clases: datosUsuario.clases - 1,
          ultimaClase: {
            categoria: datosClase.categoria,
            nombreSucursal: nombreSucursal,
            nombreClase: datosClase.nombreClase,
            idClase: idDocumento,
          },
        });

        //7----//////
        //actualizar las clases recomendadas o de inteligencia artificial
        //checamos si ya existia un dato previo o si es primera vez

        let horaActualFormato = new Date();
        let horaActual =
          horaActualFormato.getHours() + horaActualFormato.getMinutes() / 100;
        let nuevasClasesDeLaSemana: any = [];

        let diaSemana = horaActualFormato
          .toLocaleDateString('es-ES', {
            weekday: 'long',
          })
          .slice(0, 3);

        //antes de actualizar acomodamos las fechas
        //del historial por hora
        let nuevoArrayHistorial: any = [
          ...proximasClases,
          {
            ...route.params?.datosClase,
            creado: new Date(),
            fechaReserva,
            esLocal: true,
            idDocumento: idHistorial,
            idEstadisticasGeneral: idGeneral,
            idEstadisticasSucursal: idEstadisticas,

            idReserva: idReserva,
            fechaFormatoHoyTiempo,
          },
        ];

        //hacemos el calculo

        const nuevoArrayHistorialResultado = nuevoArrayHistorial.sort(
          (a: any, b: any) => a.fechaFormatoHoyTiempo - b.fechaFormatoHoyTiempo,
        );

        //Actualizamos las clases proximas en el state
        setProximasClases(nuevoArrayHistorialResultado);

        if (datosUsuario.ultimaClase.categoria) {
          //comprobamos si la ultima clase tiene la
          //misma categoria que esta si no traemos mas clases

          if (datosUsuario.ultimaClase.categoria === datosClase.categoria) {
            //la categoria es la misma por lo tanto no se hace nada
          } else {
            //la categoria es diferente por lo tanto se traen nuevos datos
            const paso1: any = await firestore()
              .collection('clasesActivas')

              .where('horarioValor', '>=', horaActual)
              .where('datosClase.categoria', '==', datosClase.categoria)
              .where('fechaTerminoActiva', '==', false)
              .where('fechaTermino', '==', null)
              .where('tipoClase', '==', 'periodica')
              .where('diasActivos', 'array-contains', diaSemana)
              .orderBy('horarioValor', 'asc')
              .limit(6)
              .get();

            let verificador = false;

            paso1.forEach((dato: any, index: number) => {
              //comprobamos que la clase no sea la misma
              // que la clase similar
              //SOLO PUEDEN SER 5

              if (datosUsuario.ultimaClase.idClase === dato.id) {
                verificador = true;

                return;
              }

              if (index === 5 && verificador === true) {
                return;
              }

              nuevasClasesDeLaSemana.push({
                ...dato.data(),
                idDocumento: dato.id,
              });
            });
          }
        } else {
          const paso1: any = await firestore()
            .collection('clasesActivas')

            .where('horarioValor', '>=', horaActual)
            .where('datosClase.categoria', '==', datosClase.categoria)
            .where('fechaTerminoActiva', '==', false)
            .where('fechaTermino', '==', null)
            .where('tipoClase', '==', 'periodica')
            .where('diasActivos', 'array-contains', diaSemana)
            .orderBy('horarioValor', 'asc')
            .limit(6)
            .get();

          let verificador = false;

          paso1.forEach((dato: any, index: number) => {
            //comprobamos que la clase no sea la misma
            // que la clase similar
            //SOLO PUEDEN SER 5

            if (datosUsuario.ultimaClase.idClase === dato.id) {
              verificador = true;

              return;
            }

            if (index === 5 && verificador === true) {
              return;
            }
            nuevasClasesDeLaSemana.push({...dato.data(), idDocumento: dato.id});
          });
        }

        //ACTUALIZAMOS las clases recomendadas
        setClasesRecomendadas(
          nuevasClasesDeLaSemana.length === 0
            ? clasesRecomendadas
            : nuevasClasesDeLaSemana,
        );

        //si todo salio bien procedemos a la pantalla de reserva exitosa
        navigation.navigate('ReservaExitosaScreen');

        abrirModal(false);
      }
    } catch (error) {
      console.log(error);
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
        textoBoton="Reservar"
        action={() => {
          apartarClase();
          // navigation.navigate('ReservaExitosaScreen');
        }}
        tipo="apartar"
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
