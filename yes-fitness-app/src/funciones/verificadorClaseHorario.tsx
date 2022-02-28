export const verificadorClaseHorario = (datos: any, fechaHoy: any) => {
  //si la funcion regresa TRUE significa que la clase puede mostrarse
  //si la funcion regresa FALSE significa que la clase no puede mostrarse

  //Pasamos la fecha a date string
  let fechaHoyFormateada = fechaHoy.toLocaleDateString();
  //output: 29/11/2021

  //dia de hoy:
  let diaHoy = fechaHoy
    .toLocaleDateString('es-ES', {
      weekday: 'long',
    })
    .slice(0, 3);

  if (datos.tipoClase === 'periodica') {
    //primero comprobamos si no esta cerrado

    if (datos.diasExcepciones.length !== 0) {
      let estaCerrado: any = false;

      datos.diasExcepciones.forEach((dato: any) => {
        if (
          dato.fechaFormato.toDate().toLocaleDateString() === fechaHoyFormateada
        ) {
          estaCerrado = true;
        }
      });

      if (estaCerrado === true) {
        return false;
      }

      //si llega aqui quiere decir que ninguno de los dias coincide
      // como para estar cerrado
      // if (estaCerrado === false) {
      //   return false;
      // }
    }

    //comprobamos si tiene inicio y fin
    // o si solo tiene inicio y es recurrente

    if (datos.fechaTerminoActiva === true) {
      if (
        fechaHoy > datos.fechaInicio.fechaFormato.toDate() ||
        fechaHoyFormateada ===
          datos.fechaInicio.fechaFormato.toDate().toLocaleDateString()
      ) {
        //verificamos ahora la fecha de termino de periodo
        if (
          fechaHoy < datos.fechaTermino.fechaFormato.toDate() ||
          fechaHoyFormateada ===
            datos.fechaTermino.fechaFormato.toDate().toLocaleDateString()
        ) {
          if (datos.diasActivos.includes(diaHoy)) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
        //por ultimo comprobamos si el dia de la fecha a consultar
        // esta dentro de los dias permitidos
      } else {
        return false;
      }
    }

    if (datos.fechaTerminoActiva === false) {
      if (
        fechaHoy > datos.fechaInicio.fechaFormato.toDate() ||
        fechaHoyFormateada ===
          datos.fechaInicio.fechaFormato.toDate().toLocaleDateString()
      ) {
        //por ultimo comprobamos si el dia de la fecha a consultar
        // esta dentro de los dias permitidos

        if (datos.diasActivos.includes(diaHoy)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  if (datos.tipoClase === 'unica') {
    if (
      fechaHoyFormateada ===
      datos.fechaInicio.fechaFormato.toDate().toLocaleDateString()
    ) {
      return true;
    }
  }
};
