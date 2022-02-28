export interface datosUsuario {
  nombre: string;
  pais: string;
  estado: string;
  mascotasSubidas: [];
}

export interface datosMascota {
  nombreMascota: string;
  raza: string;
  fechaSubida: Date;
  domicilio: string;
  ubicacion: [];
  imagenPrincial: string;
  imagenes: [];
  haGustado: [];
}
