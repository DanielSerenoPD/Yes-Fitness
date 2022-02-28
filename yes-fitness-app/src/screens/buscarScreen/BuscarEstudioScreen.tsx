import React, {useState, useContext, useEffect} from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from 'react-native';
import {styles} from '../../theme/appTheme';
import Flecha from '../../../assets/imagenes/utiles/FlechaIzquierda.svg';
import LupaChica from '../../../assets/imagenes/utiles/LupaChica.svg';
import {TecladoSalvador} from '../../components/TecladoSalvador';
import {AuthContext} from '../../context/AuthContext';

import {StackScreenProps} from '@react-navigation/stack';

import {TextInput} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ModalCargando} from '../../components/ModalCargando';
import firestore from '@react-native-firebase/firestore';
import HeaderNormal from '../../components/Header/HeaderNormal';

interface Props extends StackScreenProps<any, any> {}

export const BuscarEstudioScreen = ({navigation}: Props) => {
  let {abrirModal} = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  //Component
  const [arrayDatos, setArrayDatos] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  //

  const [search, setSearch] = useState('');

  //funcion master para la busqueda
  const searchFilter = (text: string) => {
    if (text) {
      const newData = arrayDatos.filter((item: any) => {
        const itemData = item.nombreSucursal
          ? item.nombreSucursal
              .toUpperCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
          : ''
              .toUpperCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
        const textData = text
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return itemData.indexOf(textData) > -1;
      });

      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(arrayDatos);
      setSearch(text);
    }
  };

  useEffect(() => {
    const traerSucursales = async () => {
      try {
        abrirModal(true);
        const sucursalesCalculo: any = await firestore()
          .collection('datosGenerales')
          .doc('datos')
          .get();

        setArrayDatos(sucursalesCalculo.data().sucursales);
        setFilteredData(sucursalesCalculo.data().sucursales);

        abrirModal(false);
      } catch (error) {
        Alert.alert('Hubo un error');

        abrirModal(false);
      }
    };

    traerSucursales();
  }, []);

  const renderMenuItem = (menuItem: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EstudioScreen', {
            datosClase: menuItem,
          })
        }>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>{menuItem.nombreSucursal}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const itemSeparator = () => (
    <View
      style={{
        borderBottomWidth: 1,
        opacity: 0.5,
        marginVertical: 8,
      }}></View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 14,
        marginTop: insets.top + 15,
      }}>
      {/* Titulos */}
      <View>
        <HeaderNormal
          tieneFlecha={true}
          action={() => {
            navigation.pop();
          }}
        />

        {/* Barra de busqueda */}

        {/* <Text style={{fontSize: 21, marginBottom: 15, marginTop: 15}}>
          Busca una sucursal
        </Text> */}

        <View
          style={{
            borderRadius: 14,
            backgroundColor: '#f0f0f0',
            paddingHorizontal: 16,
            marginBottom: 22,
            paddingVertical: 8,
            marginTop: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <LupaChica style={{alignSelf: 'center'}} width={20} height={20} />
            <TextInput
              placeholderTextColor="#7a7a7a"
              value={search}
              autoCorrect={false}
              autoCapitalize="none"
              style={{
                marginLeft: 10,
                fontSize: 17,
                color: 'black',

                padding: 0,
                width: '100%',
                textAlignVertical: 'center',
              }}
              keyboardType="email-address"
              placeholder={'Escribe el nombre de la sucursal....'}
              onChangeText={text => searchFilter(text)}
            />
          </View>
        </View>
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={filteredData}
          renderItem={({item}: any) => renderMenuItem(item)}
          keyExtractor={(item: any, index: any) => index}
          ItemSeparatorComponent={itemSeparator}
        />

        <ModalCargando />
      </View>
    </View>
  );
};
