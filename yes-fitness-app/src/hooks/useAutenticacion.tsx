import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Geolocation from '@react-native-community/geolocation';
import {getKilometros} from '../funciones/getKilometros';
import {verificadorClaseHorario} from '../funciones/verificadorClaseHorario';
import {filtrarClasesActivas} from '../funciones/filtrarClasesActivas';

function useAutenticacion() {
  const [usuarioAutenticado, guardarUsuarioAutenticado] = useState<
    boolean | null
  >(null);

  const [completoTutorial, guardarCompletoTutorial] = useState<boolean | null>(
    null,
  );

  const [datosUsuario, setDatosUsuarioPerfil] = useState<null | any>(null);

  const [arrayDias, setArrayDias] = useState<any>([]);

  const [arrayCategorias, setArrayCategorias] = useState([
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
    {
      fecha: 'mie29',
      activo: false,
      dias: 'lunes',
    },
  ]);

  //datos de inteligencia artificial
  const [clasesPersonalizadas, setClasesPersonalizadas] = useState([]);

  //datos de descubrimiento Semanal
  const [clasesDescubrimientoSemanal, setClasesDescubrimientoSemanal] =
    useState([]);

  //esta copia sirve para poder hacer el filtrado
  const [clasesActivasOriginal, setClasesActivasOriginal] = useState<any>([]);

  //lista de clases activas
  const [clasesActivas, setClasesActivas] = useState<any>([]);

  //lista de clases activas futuras
  const [clasesActivasFuturas, setClasesActivasFuturas] = useState<any>([]);

  //copia de clases activas futuras
  const [clasesActivasFuturasCopia, setClasesActivasFuturasCopia] =
    useState<any>([]);

  //Fecha seleccionada para las reservas genericias (entrar desde inicio, horarios de la sucursal etc...)
  const [diaSeleccionadoGenerico, setDiaSeleccionadoGenerico] = useState(null);

  //Proximas Clases
  const [proximasClases, setProximasClases] = useState<any>([]);

  //Clases Recomendadas
  const [clasesRecomendadas, setClasesRecomendadas] = useState<any>([]);

  //Clases de la semana
  const [clasesDeLaSemana, setClasesDeLaSemana] = useState<any>([]);

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

  //lista de sucursales cercanas a ti
  const [sucursalesCercanas, setSucursalesCercanas] = useState([]);

  //lista total de todas las sucursales
  const [sucursales, setSucursales] = useState([]);

  //lista de las sucursales favoritas

  const [sucursalesFavoritas, setSucursalesFavoritas] = useState([]);

  const [diaSeleccionado, setDiaSeleccionado] = useState<any>({
    fecha: 'mie29',
    activo: true,
    dias: 'lunes',
    id: 0,
    fechaFormato: new Date(),
    horaActual: new Date().getHours(),
  });

  //State de las categorias de clase esta marcada como TODAS por default
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({
    categoria: 'todos',
    activo: true,
    id: 0,
  });

  let horaActualFormato = new Date();
  let horaActual =
    horaActualFormato.getHours() + horaActualFormato.getMinutes() / 100;

  let diaSemana = diaSeleccionado.fechaFormato
    .toLocaleDateString('es-ES', {
      weekday: 'long',
    })
    .slice(0, 3);

  //datos de los filtros
  const [filtrosQuery, setFiltrosQuery] = useState<any>({
    favoritos: false,
    primeraHora: 10,
    segundaHora: 20,
    distancia: 1,
    servicios: ['Estacionamiento', 'Regaderas', 'Lockers'],
  });

  //variable para comprobar si los datos se encuentran con el
  //filtro activado o desactivado
  const [filtroActivado, setFiltroActivado] = useState(false);

  //funciones para el infinite Scroll
  const traerMasDatosHoy = async () => {
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

      console.log('primero' + locationUsuario);
    });
    if (datosRecargar.puedeRecargar === false) {
      return;
    }

    const paso1: any = await firestore()
      .collection('clasesActivas')
      .where('horarioValor', '>=', horaActual)
      .where('diasActivos', 'array-contains', diaSemana)
      .orderBy('horarioValor', 'asc')
      .startAfter(datosRecargar.ultimoDocumento)
      .limit(5)
      .get();

    let arrayResultado: any = [];
    let idUltimoDocumento = '';

    console.log(locationUsuario);

    paso1.forEach((datos: any, index: any) => {
      if (index === 4) {
        idUltimoDocumento = datos.id;
      }

      const {latitude, longitude} = datos.data().coordenadas;
      console.log(locationUsuario.latitude);

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

    if (datosRecargarFuturas.puedeRecargar === false) {
      return;
    }

    let horaActualFormato = new Date();

    console.log(datosRecargarFuturas.ultimoDocumento);

    const paso1: any = await firestore()
      .collection('clasesActivas')
      .orderBy('horarioValor', 'asc')
      .startAfter(datosRecargarFuturas.ultimoDocumento)
      .limit(5)
      .get();

    console.log(paso1.docs.length);

    let arrayResultado: any = [];
    let idUltimoDocumento = '';

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
    console.log(diaSeleccionado.fechaFormato);

    const resultadoFinal = filtrarClasesActivas(
      arrayResultado,
      diaSeleccionado.fechaFormato,
    );
    setClasesActivasFuturas([...clasesActivasFuturas, ...resultadoFinal]);
  };

  //funcion para sacar el dia de hoy y lo 14 siguientes

  const calcularDias = () => {
    let arrayResultado: any = [];

    const diaSiguiente = (dias: number) => {
      let hoy = new Date();
      let resultado = new Date(hoy.getTime() + 24 * 60 * 60 * dias);

      //output mie23
      let fecha =
        resultado
          .toLocaleDateString('es', {
            weekday: 'long',
          })
          .slice(0, 3) +
        resultado.toLocaleDateString('es', {
          day: 'numeric',
        });

      console.log(fecha);

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
    //cada vez que recarga, checa el inicio de sesion

    calcularDias();

    const traerDatosUsuario = async (uid: string) => {
      try {
        const paso1 = await firestore()
          .collection('usuarios')
          .where('idUsuario', '==', uid)
          .get();

        let datosUsuarioLocal: any = {};

        paso1.forEach(doc => {
          datosUsuarioLocal = {...doc.data(), idDocumento: doc.id};
          setDatosUsuarioPerfil({...doc.data(), idDocumento: doc.id});
          guardarCompletoTutorial(doc.data().completoTutorial);
        });

        //traemos los datos de firebase

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
        let diaSemana2 = tiempoActual
          .toLocaleDateString('es-ES', {
            weekday: 'long',
          })
          .slice(0, 3);

        //verificamos si ya se tomo como minimo una coase

        if (datosUsuarioLocal.ultimaClase.categoria) {
          const horaActual =
            tiempoActual.getHours() + tiempoActual.getMinutes() / 100;

          const clasesCategoriaDominante: any = await firestore()
            .collection('clasesActivas')

            .where('horarioValor', '>=', horaActual)
            .where(
              'datosClase.categoria',
              '==',
              datosUsuarioLocal.ultimaClase.categoria,
            )
            .where('fechaTerminoActiva', '==', false)
            .where('fechaTermino', '==', null)
            .where('tipoClase', '==', 'periodica')
            // .where(
            //   firestore.FieldPath.documentId(),
            //   '!=',
            //   datosUsuarioLocal.ultimaClase.idClase,
            // )
            .where('diasActivos', 'array-contains', diaSemana2)
            .orderBy('horarioValor', 'asc')
            .limit(6)
            .get();

          let clasesCategoriaResultado: any = [];
          let verificador = false;

          clasesCategoriaDominante.forEach((datos: any, index: number) => {
            //comprobamos que la clase no sea la misma
            // que la clase similar
            //SOLO PUEDEN SER 5

            if (datosUsuarioLocal.ultimaClase.idClase === datos.id) {
              verificador = true;

              return;
            }

            if (index === 5 && verificador === true) {
              return;
            }

            clasesCategoriaResultado.push({
              ...datos.data(),

              idDocumento: datos.id,
            });
          });

          setClasesRecomendadas(clasesCategoriaResultado);
        }

        //TRAEMOS las clases recomendadas O DE DESCUBRIMIENTO semanal //pendiente
        const horaActual =
          tiempoActual.getHours() + tiempoActual.getMinutes() / 100;

        const clasesSemanal: any = await firestore()
          .collection('clasesActivas')

          .where('horarioValor', '>=', horaActual)
          .where('claseSemana', '==', true)
          .where('fechaTerminoActiva', '==', false)
          .where('fechaTermino', '==', null)
          .where('tipoClase', '==', 'periodica')
          // .where(
          //   firestore.FieldPath.documentId(),
          //   '!=',
          //   datosUsuarioLocal.ultimaClase.idClase,
          // )
          .where('diasActivos', 'array-contains', diaSemana2)
          .orderBy('horarioValor', 'asc')
          .limit(5)
          .get();

        let clasesSemanalResultado: any = [];

        clasesSemanal.forEach((datos: any) => {
          clasesSemanalResultado.push({
            ...datos.data(),

            idDocumento: datos.id,
          });
        });

        setClasesDeLaSemana(clasesSemanalResultado);

        //------------------------

        //traemos las clases Proximas
        const paso2 = await firestore()
          .collection(
            `usuarios/${datosUsuarioLocal.idDocumento}/historialClases`,
          )
          .where('fechaFormatoHoyTiempo', '>=', tiempoActual.getTime())
          .get();

        let clasesProximasResultado: any = [];

        paso2.forEach(doc => {
          clasesProximasResultado.push({...doc.data(), idDocumento: doc.id});
        });

        setProximasClases(clasesProximasResultado);

        //------------------------

        //TRAEMOS las sucursales mas cercanas (solo 5) -----------------------------
        const sucursalesCalculo: any = await firestore()
          .collection('datosGenerales')
          .doc('datos')
          .get();

        const sucursalesCalculoResultado: any = [];

        const sucursalesFavoritasArray: any = [];

        sucursalesCalculo.data().sucursales.forEach((datos: any) => {
          const {latitude, longitude} = datos.coordenadas;

          sucursalesCalculoResultado.push({
            ...datos,

            distancia: parseFloat(
              getKilometros(
                latitude,
                longitude,
                locationUsuario.latitude,
                locationUsuario.longitude,
              ),
            ),
          });

          //verificamos si es favorita
          if (datosUsuarioLocal.estudiosFavoritos.includes(datos.idSucursal)) {
            sucursalesFavoritasArray.push(datos);
          }

          //reacomodamos el array pero de la A a la z
          //esto para la tabla de busquedas y favoritos
        });

        const resultado2: any = sucursalesCalculoResultado.sort(
          (a: any, b: any) => a.distancia - b.distancia,
        );

        //recortamos el array solo a 5 items
        const resultado2Slice = resultado2.slice(0, 5);

        //sucursales cercanas
        setSucursalesCercanas(resultado2Slice);
        //todas las sucursales
        setSucursales(sucursalesCalculoResultado);

        //sucursales Favoritas
        setSucursalesFavoritas(sucursalesFavoritasArray);

        //-----------------------------------------

        //traemos las clases acomodadas por hora de menor a mayor
        // y que contenga minimo el dia de hoy esto aplica
        //para cuando el usuario esta buscando clases de hoy

        let diaSemana = diaSeleccionado.fechaFormato
          .toLocaleDateString('es-ES', {
            weekday: 'long',
          })
          .slice(0, 3);

        console.log(diaSemana);

        const tiempoFormato =
          tiempoActual.getHours() + tiempoActual.getMinutes() / 100;
        const clasesActivas = await firestore()
          .collection('clasesActivas')
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
        console.log(clasesActivasResultadoFuturas);

        //filtramos las clases por la fecha de hoy

        const resultadoFinalFuturas = filtrarClasesActivas(
          clasesActivasResultadoFuturas,
          diaSeleccionado.fechaFormato,
        );

        setClasesActivasFuturas(resultadoFinalFuturas);

        //-----Fin -----------

        guardarUsuarioAutenticado(true);
      } catch (e) {
        console.log(e);
        guardarUsuarioAutenticado(false);
      }
    };

    const unsuscribe = auth().onAuthStateChanged(user => {
      if (user) {
        traerDatosUsuario(user.uid);
      } else {
        guardarUsuarioAutenticado(false);
        setDatosUsuarioPerfil(null);
      }
    });

    return () => unsuscribe();
  }, []);

  return {
    usuarioAutenticado,
    datosUsuario,
    setDatosUsuarioPerfil,
    completoTutorial,
    guardarCompletoTutorial,

    arrayDias,
    setArrayDias,
    setArrayCategorias,
    arrayCategorias,
    diaSeleccionado,
    setDiaSeleccionado,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    clasesActivas,
    setClasesActivas,
    clasesPersonalizadas,
    setClasesPersonalizadas,
    clasesDescubrimientoSemanal,
    setClasesDescubrimientoSemanal,
    sucursalesCercanas,
    clasesActivasOriginal,
    setClasesActivasOriginal,
    clasesActivasFuturas,
    clasesActivasFuturasCopia,
    setClasesActivasFuturas,
    setClasesActivasFuturasCopia,
    datosRecargar,
    setDatosRecargar,
    setDatosRecargarFuturas,
    datosRecargarFuturas,
    traerMasDatosHoy,
    traerMasDatosFuturos,
    sucursales,
    setSucursales,
    setSucursalesFavoritas,
    sucursalesFavoritas,
    clasesRecomendadas,
    setClasesRecomendadas,
    proximasClases,
    setProximasClases,
    clasesDeLaSemana,
    setClasesDeLaSemana,
    diaSeleccionadoGenerico,
    setDiaSeleccionadoGenerico,
    filtrosQuery,
    setFiltrosQuery,
    filtroActivado,
    setFiltroActivado,
  };
}

export default useAutenticacion;
