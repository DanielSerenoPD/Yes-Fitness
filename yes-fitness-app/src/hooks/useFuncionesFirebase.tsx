import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import {getKilometros} from '../funciones/getKilometros';
import {filtrarClasesActivas} from '../funciones/filtrarClasesActivas';

function useFuncionesFirebase() {
  const {
    datosRecargar,
    diaSeleccionado,
    setDatosRecargar,
    setClasesActivas,
    setClasesActivasOriginal,
    clasesActivas,
    clasesActivasOriginal,
    filtrosQuery,
    sucursalesFavoritas,
    datosRecargarFuturas,
    setDatosRecargarFuturas,
    setClasesActivasFuturas,
    setClasesActivasFuturasCopia,
    clasesActivasFuturasCopia,
    clasesActivasFuturas,
  } = useContext(AuthContext);

  let horaActualFormato = new Date();
  let horaActual =
    horaActualFormato.getHours() + horaActualFormato.getMinutes() / 100;

  let diaSemana = diaSeleccionado.fechaFormato
    .toLocaleDateString('es-ES', {
      weekday: 'long',
    })
    .slice(0, 3);

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

  const traerMasDatosHoyFiltro = async () => {
    if (datosRecargar.puedeRecargar === false) {
      return;
    }

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

    //convertimos el dato de dist ancia a su debido kilometro
    let distanciaFinal: any = transformarDistancia;

    const paso1: any = await firestore()
      .collection('clasesActivas')
      .where('horarioValor', '>=', horaActual)
      .where('horarioValor', '>=', filtrosQuery.primeraHora)
      .where('horarioValor', '<=', filtrosQuery.segundaHora)
      .where('diasActivos', 'array-contains', diaSemana)
      .orderBy('horarioValor', 'asc')
      .startAfter(datosRecargar.ultimoDocumento)
      .limit(5)
      .get();

    let arrayResultado: any = [];
    let idUltimoDocumento = '';

    paso1.forEach((datos: any, index: any) => {
      if (index === 4) {
        idUltimoDocumento = datos.id;
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
          const contieneFavoritos = sucursalesFavoritas.some((datosF: any) => {
            return datosF.idSucursal === datos.data().idSucursal;
          });

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
      }
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

  const traerMasDatosFuturosFiltro = async () => {
    if (datosRecargarFuturas.puedeRecargar === false) {
      return;
    }

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

    //convertimos el dato de dist ancia a su debido kilometro
    let distanciaFinal: any = transformarDistancia;
    let horaActualFormato = new Date();

    console.log(datosRecargarFuturas.ultimoDocumento);

    const paso1: any = await firestore()
      .collection('clasesActivas')
      .where('horarioValor', '>=', filtrosQuery.primeraHora)
      .where('horarioValor', '<=', filtrosQuery.segundaHora)
      .orderBy('horarioValor', 'asc')
      .startAfter(datosRecargarFuturas.ultimoDocumento)
      .limit(5)
      .get();

    let arrayResultado: any = [];
    let idUltimoDocumento = '';

    paso1.forEach((datos: any, index: any) => {
      if (index === 4) {
        idUltimoDocumento = datos.id;
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
          const contieneFavoritos = sucursalesFavoritas.some((datosF: any) => {
            return datosF.idSucursal === datos.data().idSucursal;
          });

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
      }
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

  return {
    traerMasDatosFuturosFiltro,
    traerMasDatosHoyFiltro,
  };
}

export default useFuncionesFirebase;
