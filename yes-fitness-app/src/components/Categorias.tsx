import React, {useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Barre from '../../assets/imagenes/iconos-buscar/Barre.svg';
import Box from '../../assets/imagenes/iconos-buscar/Box.svg';
import Hiit from '../../assets/imagenes/iconos-buscar/Hiit.svg';
import Spinning from '../../assets/imagenes/iconos-buscar/Spinning.svg';
import Yoga from '../../assets/imagenes/iconos-buscar/Yoga.svg';
import Crossfit from '../../assets/imagenes/iconos-buscar/Crossfit.svg';
import Funcional from '../../assets/imagenes/iconos-buscar/Funcional.svg';

import Todos from '../../assets/imagenes/iconos-buscar/Todos.svg';
import Añadir from '../../assets/imagenes/utiles/Añadir.svg';
import {AuthContext} from '../context/AuthContext';
import {filtrarCategoriasClase} from '../funciones/filtrarCategoriasClase';
import {filtrarClasesActivas} from '../funciones/filtrarClasesActivas';

interface Props {}

export const Categorias = () => {
  const {
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    diaSeleccionado,
    arrayDias,
    clasesActivas,
    clasesActivasFuturas,
    setClasesActivas,
    setClasesActivasFuturas,
    clasesActivasOriginal,
    clasesActivasFuturasCopia,
  } = useContext(AuthContext);

  const categoriasClases = [
    {
      nombre: 'todos',
      texto: 'Todos',
      icono: (
        <Todos
          color={
            categoriaSeleccionada.categoria === 'todos' ? 'black' : '#C3C3C3'
          }
        />
      ),
    },
    {
      nombre: 'Indoor Cycling',
      texto: 'Cycling',
      icono: (
        <Spinning
          color={
            categoriaSeleccionada.categoria === 'Indoor Cycling'
              ? 'black'
              : '#C3C3C3'
          }
        />
      ),
    },
    {
      nombre: 'Box',
      texto: 'Box',
      icono: (
        <Hiit
          color={
            categoriaSeleccionada.categoria === 'Box' ? 'black' : '#C3C3C3'
          }
        />
      ),
    },
    {
      nombre: 'Entrenamiento Funcional',
      texto: 'Funcional',
      icono: (
        <Funcional
          width={38}
          height={38}
          color={
            categoriaSeleccionada.categoria === 'Entrenamiento Funcional'
              ? 'black'
              : '#C3C3C3'
          }
        />
      ),
    },
    {
      nombre: 'Yoga',
      texto: 'Yoga',
      icono: (
        <Yoga
          color={
            categoriaSeleccionada.categoria === 'Yoga' ? 'black' : '#C3C3C3'
          }
        />
      ),
    },
    {
      nombre: 'Barre',
      texto: 'Barre',
      icono: (
        <Barre
          width={35}
          height={35}
          color={
            categoriaSeleccionada.categoria === 'Barre' ? 'black' : '#C3C3C3'
          }
        />
      ),
    },
    {
      nombre: 'Pilates',
      texto: 'Pilates',
      icono: (
        <Box
          color={
            categoriaSeleccionada.categoria === 'Pilates' ? 'black' : '#C3C3C3'
          }
        />
      ),
    },
    {
      nombre: 'Crossfit',
      texto: 'Crossfit',
      icono: (
        <Crossfit
          width={43}
          height={43}
          color={
            categoriaSeleccionada.categoria === 'Crossfit' ? 'black' : '#C3C3C3'
          }
        />
      ),
    },
    // {
    //   nombre: 'Running',
    //   texto: 'Running',
    //   icono: (
    //     <Box
    //       color={
    //         categoriaSeleccionada.categoria === 'Running' ? 'black' : '#C3C3C3'
    //       }
    //     />
    //   ),
    // },
    // {
    //   nombre: 'Calistenia',
    //   texto: 'Calistenia',
    //   icono: (
    //     <Hiit
    //       color={
    //         categoriaSeleccionada.categoria === 'Calistenia'
    //           ? 'black'
    //           : '#C3C3C3'
    //       }
    //     />
    //   ),
    // },
    // {
    //   nombre: 'Climbing',
    //   texto: 'Climbing',
    //   icono: (
    //     <Hiit
    //       color={
    //         categoriaSeleccionada.categoria === 'Climbing' ? 'black' : '#C3C3C3'
    //       }
    //     />
    //   ),
    // },
  ];
  return (
    <>
      {categoriasClases.map((dato: any, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setCategoriaSeleccionada({
              categoria: dato.nombre,
              activo: true,
              id: index,
            });

            //comprobamos si al momento de cambiar la categoria
            // se encuentra en el dia actual o en el dia futuro

            //sacamos el formato de fecha actual
            const tiempoActual: any = new Date();

            let esHoy: boolean;

            if (
              diaSeleccionado.fechaFormato.toLocaleDateString() ===
              tiempoActual.toLocaleDateString()
            ) {
              //significa que el dia elegido es el de hoy
              esHoy = true;
            } else {
              //significa que el dia elegido no es el de hou
              esHoy = false;
            }

            if (esHoy) {
              //en pocas palabras si se esta actualmente en un dia de hoy

              const resultadoFiltrado = filtrarClasesActivas(
                clasesActivasOriginal,
                diaSeleccionado.fechaFormato,
              );

              if (dato.nombre !== 'todos') {
                const resultadoFiltradoCategorias = filtrarCategoriasClase(
                  resultadoFiltrado,
                  dato.nombre,
                );

                setClasesActivas(resultadoFiltradoCategorias);
              }

              if (dato.nombre === 'todos') {
                setClasesActivas(resultadoFiltrado);
              }
            } else {
              //si no es hoy en pocas palabras

              const resultadoFiltrado = filtrarClasesActivas(
                clasesActivasFuturasCopia,
                diaSeleccionado.fechaFormato,
              );
              if (dato.nombre !== 'todos') {
                console.log(dato.nombre);
                const resultadoFiltradoCategorias = filtrarCategoriasClase(
                  resultadoFiltrado,
                  dato.nombre,
                );

                setClasesActivasFuturas(resultadoFiltradoCategorias);
              }

              if (dato.nombre === 'todos') {
                setClasesActivasFuturas(resultadoFiltrado);
              }
            }

            // if(diaSeleccionado){

            // }
          }}
          activeOpacity={0.6}
          style={
            categoriaSeleccionada.categoria === dato.nombre
              ? styles.containerActivo
              : styles.container
          }>
          <Text
            style={{
              fontSize: 12,
              color:
                categoriaSeleccionada.categoria === dato.nombre
                  ? 'black'
                  : '#C3C3C3',
              marginBottom: 6,
            }}>
            {dato.texto}
          </Text>
          {dato.icono}
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 9,
    marginLeft: 23,
    marginRight: 12,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  containerActivo: {
    paddingTop: 9,
    marginLeft: 23,
    marginRight: 12,
    borderTopWidth: 2,
    borderTopColor: 'black',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  containerUltimo: {
    width: 39,
    height: 25,
    marginLeft: 23,
    marginRight: 23,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  textoFechaInactivo: {
    textAlign: 'center',
    fontSize: 12,
    color: '#C3C3C3',
  },
  textoFechaActivo: {
    textAlign: 'center',
    fontSize: 12,
    color: '#0B0B0B',
  },
  linea: {
    backgroundColor: '#C3C3C3',
    height: 0.5,
  },
});
