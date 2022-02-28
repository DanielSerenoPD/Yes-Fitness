export const datosUsuario = {
  fechaCreacion: new Date(),
  idUsuario: '',
  codigoCupon: '',
  historialCupon: {
    sePuede: true,
    usuariosHistorial: [],
  },
  clasesDisponibles: 0,
  nombreCompleto: '',
  nombrePila: '',
  esNuevo: true,
  paquetes: {
    pagoActivo: true,
    paqueteActivo: 0,
    fechaCompra: new Date(),

    // pagoActivo: true,
    // pagoActivo: 0
  },

  //***sub coleccion */
  historialPagos: [],
  historialClases: [],
  proximasClases: [],
  favoritos: [],
};
