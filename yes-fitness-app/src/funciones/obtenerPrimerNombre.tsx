export const obtenerPrimerNombre = (nombre: string) => {
  let arrayNombre = nombre.split(' ');

  let nombrePila = '';
  let validador = false;

  arrayNombre.forEach(dato => {
    if (dato !== '' && validador === false) {
      nombrePila = dato;
      validador = true;
    }
  });

  return nombrePila;
};
