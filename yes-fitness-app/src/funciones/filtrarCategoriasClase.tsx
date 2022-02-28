export const filtrarCategoriasClase = (
  arrayDatos: any,
  categoriaClase: string,
) => {
  const resultado = arrayDatos.filter(
    (dato: any, index: number) => dato.datosClase.categoria === categoriaClase,
  );

  return resultado;
};
