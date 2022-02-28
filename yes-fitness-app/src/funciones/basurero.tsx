import React from 'react';

export const basurero = () => {
  // //funcion para traer mas datos desde el dia seleccionado
  // const traerMasDatos = async () => {
  //   let diaSemana = diaSeleccionado.fechaFormato.toLocaleDateString('es-ES', {
  //     weekday: 'short',
  //   });
  //   if (diasSemanaMemoria[diaSemana].hayMasDatos === false) {
  //     return;
  //   }

  //   let paso1: any;
  //   //comprobamos si es la primera vez que se extraen los datos
  //   if (diasSemanaMemoria[diaSemana].ultimoDocumento === '') {
  //     paso1 = await firestore()
  //       .collection('clasesActivas')
  //       .where('horarioValor', '>=', diaSeleccionado.horaActual)
  //       .where('diasActivos', 'array-contains', diaSemana)
  //       .orderBy('horarioValor', 'asc')
  //       .startAfter(diasSemanaMemoria[diaSemana].ultimoDocumento)
  //       .limit(5)
  //       .get();
  //   } else {
  //     paso1 = await firestore()
  //       .collection('clasesActivas')
  //       .where('horarioValor', '>=', diaSeleccionado.horaActual)
  //       .where('diasActivos', 'array-contains', diaSemana)
  //       .orderBy('horarioValor', 'asc')
  //       .startAfter(datosRecargar.ultimoDocumento)
  //       .limit(5)
  //       .get();
  //   }

  //   let arrayResultado: any = [];
  //   let idUltimoDocumento = '';

  //   paso1.forEach((datos: any, index: any) => {
  //     if (index === 4) {
  //       idUltimoDocumento = datos.id;
  //     }

  //     arrayResultado.push({...datos.data(), idDocumento: datos.id});
  //   });

  //   //por seguridad se filtran los datos
  //   const resultadoFinal = filtrarClasesActivas(arrayResultado, '');

  //   if (idUltimoDocumento !== '') {
  //     setdiasSemanaMemoria({
  //       ...diasSemanaMemoria,
  //       [diaSemana]: {
  //         ...diasSemanaMemoria[diaSemana],
  //         hayMasDatos: true,
  //         diasActivos: [
  //           ...clasesActivas,
  //           ...diasSemanaMemoria[diaSemana].diasActivos,
  //           ...resultadoFinal,
  //         ],
  //       },
  //     });
  //   } else {
  //     setdiasSemanaMemoria({
  //       ...diasSemanaMemoria,
  //       [diaSemana]: {
  //         ...diasSemanaMemoria[diaSemana],
  //         hayMasDatos: false,
  //         diasActivos: [
  //           ...clasesActivas,
  //           ...diasSemanaMemoria[diaSemana].diasActivos,
  //           ...resultadoFinal,
  //         ],
  //       },
  //     });
  //   }

  //   //por seguridad se filtran los datos

  //   // setArrayDatos([...arrayDatos, ...arrayResultado]);
  // };

  return <div></div>;
};
