import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import HeaderLogo from '../../../components/Header/HeaderLogo';
import Ajustes from '../../../../assets/imagenes/utiles/Ajustes.svg';
import {HistorialClaseGeneral} from '../../../components/HistorialClaseGeneral';
import {AuthContext} from '../../../context/AuthContext';

import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from 'react-native-calendars';
import BottomSheetCalendario from '../../../components/BottomSheet/BotomSheetCalendario';
import firestore from '@react-native-firebase/firestore';
import {ModalCargando} from '../../../components/ModalCargando';
// LocaleConfig.locales['es'] = {
//   monthNames: [
//     'Enero',
//     'Febrero',
//     'Marzo',
//     'Abril',
//     'Mayo',
//     'Junio',
//     'Julio',
//     'Agosto',
//     'Septiembre',
//     'Octubre',
//     'Noviembre',
//     'Diciembre',
//   ],
//   monthNamesShort: [
//     'Lun',
//     'Févr.',
//     'Mars',
//     'Avril',
//     'Mai',
//     'Juin',
//     'Juil.',
//     'Août',
//     'Sept.',
//     'Oct.',
//     'Nov.',
//     'Déc.',
//   ],
//   dayNames: [
//     'Lunes',
//     'Martes',
//     'Miércoles',
//     'Jueves',
//     'Viernes',
//     'Sábado',
//     'Domingo',
//   ],
//   dayNamesShort: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
//   today: "Aujourd'hui",
// };
// LocaleConfig.defaultLocale = 'es';

interface Props extends StackScreenProps<any, any> {}

export const HistorialScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();

  const {abrirBottomSheet, abrirModal, datosUsuario} = useContext(AuthContext);

  const [arrayDatos, setArrayDatos] = useState<any>([]);
  const [lastDocument, setLastDocument] = useState({
    hayMas: false,
    idUltimoDocumento: '',
  });
  const [visible, setVisible] = useState(false);

  const [loader, setLoader] = useState<null | boolean>(null);

  useEffect((): any => {
    //Fix para el bug de memory leak,no-op,
    //este problema solo pasa cuando haces llamadas asyncronas
    //en el useEffect

    let mounted = true;

    const descargarDatos = async () => {
      try {
        abrirModal(true);
        const paso1: any = await firestore()
          .collection(`usuarios/${datosUsuario.idDocumento}/historialClases`)
          .orderBy('creado', 'desc')
          .limit(10)
          .get();

        let arrayDatosFb: any = [];

        let idUltimoDocumento = '';
        paso1.forEach((doc: any, index: any) => {
          if (index === 9) {
            idUltimoDocumento = doc.id;
          }

          arrayDatosFb.push({...doc.data(), idDocumento: doc.id});
        });

        if (mounted) {
          if (idUltimoDocumento !== '') {
            setLastDocument({
              ...lastDocument,
              hayMas: true,
              idUltimoDocumento: paso1.docs[7],
            });
          }
          setArrayDatos(arrayDatosFb);
          abrirModal(false);
          setLoader(true);
        }
      } catch (e) {
        abrirModal(false);
        setLoader(true);
      }
    };

    descargarDatos();

    return () => (mounted = false);
  }, []);

  const traerMasDatos = async () => {
    if (lastDocument.hayMas === false) {
      return;
    }

    const paso1: any = await firestore()
      .collection(`usuarios/${datosUsuario.idDocumento}/historialClases`)
      .orderBy('creado', 'desc')
      .startAfter(lastDocument.idUltimoDocumento)
      .limit(10)
      .get();

    let arrayResultado: any = [];
    let idUltimoDocumento = '';

    paso1.forEach((datos: any, index: any) => {
      if (index === 9) {
        idUltimoDocumento = datos.id;
      }

      arrayResultado.push({...datos.data(), idDocumento: datos.id});
    });

    console.log(arrayResultado[paso1.docs.length - 1]);

    if (idUltimoDocumento !== '') {
      setLastDocument({
        ...lastDocument,
        hayMas: true,
        idUltimoDocumento: paso1.docs[paso1.docs.length - 1],
      });
    } else {
      setLastDocument({
        ...lastDocument,
        hayMas: false,
      });
    }

    setArrayDatos([...arrayDatos, ...arrayResultado]);
  };

  return (
    // <BottomSheetModalProvider>
    <View
      style={{
        flex: 1,
        marginTop: insets.top + 9.8,
        marginBottom: insets.bottom,
      }}>
      {/*  */}
      <View style={{marginHorizontal: 24}}>
        <HeaderLogo
          tieneFlecha={true}
          action={() => {
            navigation.pop();
          }}
          // iconoDerecha={<Ajustes />}
          // actionDerecha={() => abrirBottomSheet()}
        />

        <Text style={styles.titulo1}>
          Historial
          {/* Historial: <Text style={{fontWeight: '300'}}>71 clases </Text> */}
        </Text>
      </View>

      {/* Zona de components */}
      {loader !== true ? (
        <></>
      ) : arrayDatos.length !== 0 ? (
        <FlatList
          onEndReached={traerMasDatos}
          data={arrayDatos}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <>
              <HistorialClaseGeneral key={index} index={index} datos={item} />
            </>
          )}
          onEndReachedThreshold={0.4}
          keyExtractor={(item: any) => item.idDocumento}
          ListFooterComponent={
            <ActivityIndicator
              animating={lastDocument.hayMas ? true : false}
              style={{height: 100}}
              size={20}
              color="grey"
            />
          }
        />
      ) : (
        <>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 164,

              width: 290,
            }}>
            No has hecho ninguna reserva
          </Text>
        </>
        // <View
        //   style={{
        //     flex: 1,
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     bottom: 45,
        //   }}>
        //   <Image
        //     resizeMode="contain"
        //     style={{height: 300, width: '100%'}}
        //     source={require('../../../assets/imagenes/Alert1.png')}
        //   />
        //   <Text
        //     style={{
        //       textAlign: 'center',
        //       ...styles.fontMedium,
        //       ...styles.color3,
        //     }}>
        //     No hay ningun perro adoptado
        //   </Text>
        // </View>
      )}
      {/* <BottomSheetCalendario>
          <View style={{marginHorizontal: 24}}>
            <Text style={styles.tituloCalendario}>Rango de fechas</Text>

            <View style={styles.linea} />

          
          </View>
          <Calendar
            onDayPress={day => {
              console.log('selected day', day);
            }}
            current={'2021-11-09'}
            theme={{
              textDayFontSize: 20,
              textDayFontWeight: '400',
              textDayHeaderFontSize: 14,
              textDayHeaderFontWeight: '400',
              textMonthFontSize: 20,
              textMonthFontWeight: '400',
              arrowColor: '#000000',
              arrowHeight: 20,
              selectedDayTextColor: '#1AD955',
            }}
            markingType={'period'}
            markedDates={{
              '2021-11-04': {
                color: 'rgba(45, 215, 92,0.13)',

                selected: true,
                selectedTextColor: '#1AD955',
              },
              '2021-11-05': {
                color: 'rgba(45, 215, 92,0.13)',

                selected: true,
                selectedTextColor: '#1AD955',
              },
            }}
            style={{padding: 0, margin: 0, width: '100%'}}
          />
        </BottomSheetCalendario> */}
      <ModalCargando />
    </View>
    // </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginTop: 51.3,
    marginBottom: 40,
  },
  tituloCalendario: {
    marginTop: 7,
    fontSize: 22,
    color: 'black',
    marginBottom: 36.2,
  },
  linea: {
    height: 1,
    backgroundColor: '#C3C3C3',
    marginBottom: 21,
  },
});
