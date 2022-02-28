import {verificadorClaseHorario} from './verificadorClaseHorario';

export const filtrarClasesActivas = (datosFiltrar: any, fechaFormato: any) => {
  let clasesActivasFiltro: any = [];

  datosFiltrar.forEach((dato: any) => {
    if (verificadorClaseHorario(dato, fechaFormato)) {
      clasesActivasFiltro.push(dato);
    }
  });

  console.log('majin' + clasesActivasFiltro.length);

  return clasesActivasFiltro;
};
