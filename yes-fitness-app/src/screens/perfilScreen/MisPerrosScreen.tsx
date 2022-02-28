import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Modal,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from '../../theme/appTheme';
import Flecha from '../../../assets/imagenes/iconos-otros/FlechaIzquierda.svg';
import {TecladoSalvador} from '../../components/TecladoSalvador';
import {AuthContext} from '../../context/AuthContext';
import AnimatedLottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StackScreenProps} from '@react-navigation/stack';
import paises from '../../../assets/PaisesLista/countries.json';
import estados from '../../../assets/PaisesLista/states.json';
import {FadeInImage} from '../../components/FadeInImage';
import firestore from '@react-native-firebase/firestore';
import {ModalCargando} from '../../components/ModalCargando';
import {EliminarFavorito} from '../../components/Modales/childrens/EliminarFavorito';

interface Props extends StackScreenProps<any, any> {}

export const MisPerrosScreen = ({navigation, route}: Props) => {
  let {
    datosUsuario,
    setDatosUsuarioPerfil,
    modal,
    abrirModal,
    abrirModalSegundo,
  } = useContext(AuthContext);

  const [arrayDatos, setArrayDatos] = useState([]);

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
        const paso1 = await firestore()
          .collection(`usuarios/${datosUsuario.idDocumento}/mascotasSubidas`)
          .get();

        let arrayDatosFb: any = [];
        paso1.forEach(doc => {
          arrayDatosFb.push({...doc.data(), idDocumento: doc.id});
        });

        if (mounted) {
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

  const renderMenuItem = (menuItem: any) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginRight: 12,
          padding: 15,
        }}
        onPress={() => {
          navigation.navigate('InformacionScreen2', {
            datosMascota: menuItem,
            arrayDatos,
            setArrayDatos,
          });
        }}>
        <FadeInImage
          style={{width: 58, height: 58, borderRadius: 100, marginRight: 15}}
          uri={
            'https://firebasestorage.googleapis.com/v0/b/tinder-perros-desarrollo.appspot.com/o/fotos%2F140d20e1-0cbe-4688-ad49-4ccb27f45174?alt=media&token=d1c9213b-96c2-4fc3-9ac4-cf1817b794eb'
          }
        />
        <View>
          <Text
            style={{
              ...styles.fontBold,
              color: 'black',
              fontSize: 15,
              marginBottom: 4,
            }}>
            Pastor Aleman
          </Text>
          <Text
            style={{
              ...styles.fontMedium,
              color: '#4f4f4f',
              fontSize: 12,
              marginBottom: 6,
            }}>
            Subido: 20/56/45
          </Text>
          <View
            style={{
              width: 96,
              borderRadius: 5,
              backgroundColor: '#FB724C',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <Text style={{...styles.fontBold, color: 'white', fontSize: 10}}>
                Pendiente
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const itemSeparator = () => (
    <View
      style={{
        height: 1,

        backgroundColor: '#eceef1',
      }}></View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 14,
        marginTop: 15,
      }}>
      {/* Titulos */}

      <TouchableOpacity
        style={{zIndex: 1, width: 44, marginBottom: 12}}
        onPress={() => {
          navigation.pop();
        }}>
        <Flecha />
      </TouchableOpacity>
      {loader !== true ? (
        <></>
      ) : arrayDatos.length !== 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={arrayDatos}
          renderItem={({item}: any) => renderMenuItem(item)}
          keyExtractor={(item: any) => item.idDocumento}
          ItemSeparatorComponent={itemSeparator}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            bottom: 45,
          }}>
          <Image
            resizeMode="contain"
            style={{height: 300, width: '100%'}}
            source={require('../../../assets/imagenes/Alert1.png')}
          />
          <Text
            style={{
              textAlign: 'center',
              ...styles.fontMedium,
              ...styles.color3,
            }}>
            No haz subido ningun perro
          </Text>
        </View>
      )}

      {/*Se valida si el usuario ah subido perros o no  */}

      {/* <FlatList
          showsVerticalScrollIndicator={false}
          data={arrayDatos}
          renderItem={({item}: any) => renderMenuItem(item)}
          keyExtractor={(item: any) => item.idDocumento}
          ItemSeparatorComponent={itemSeparator}
        /> */}

      {/* <ModalCargando /> */}

      <EliminarFavorito
        texto="¿Estas seguro que quieres eliminar este perro de tu lista de favoritos?"
        funcionGenerica={() => {}}
      />
      <ModalCargando />
    </SafeAreaView>
  );
};
