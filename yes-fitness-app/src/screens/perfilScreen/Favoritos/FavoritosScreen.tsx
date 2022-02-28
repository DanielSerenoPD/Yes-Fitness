import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import HeaderLogo from '../../../components/Header/HeaderLogo';
import Ajustes from '../../../../assets/imagenes/utiles/Ajustes.svg';
import {HistorialClase} from '../../../components/HistorialClase';
import Favoritos from '../../../../assets/imagenes/iconos-perfil/Favoritos.svg';
import {FadeInImage} from '../../../components/FadeInImage';
import {AuthContext} from '../../../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export const FavoritosScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();

  let {sucursalesFavoritas} = useContext(AuthContext);

  return (
    <View
      style={{
        flex: 1,
        marginTop: insets.top + 9.8,
        marginHorizontal: 24,
        marginBottom: insets.bottom,
      }}>
      {/*  */}
      <HeaderLogo
        tieneFlecha={true}
        action={() => {
          navigation.pop();
        }}
      />

      {/*  */}
      <View style={styles.caja1}>
        <Favoritos fill="black" />
        <Text style={styles.titulo1}>Favoritos</Text>
      </View>

      {/*Favoritos Components  */}

      

      {sucursalesFavoritas.length === 0 ? (
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: 164,

            width: 290,
          }}>
          No tienes ningun favorito
        </Text>
      ) : (
        <View
          style={
            sucursalesFavoritas.length === 1
              ? {
                  justifyContent: 'space-between',
                  flex: 1,
                }
              : {
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flex: 1,
                  marginBottom:15
                }
          }>
          <FlatList
          style={{flex:1, }}
            bounces={false}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            data={sucursalesFavoritas}
            numColumns={2}
            keyExtractor={(item: any,index:number) => index}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() =>
                  navigation.navigate('EstudioScreen', {datosClase: item})
                }
                style={{width: '49%', marginBottom: 25, }}>
                {/* Foto */}
                <FadeInImage
                  uri={item.datosEstudio.fotoPortada}
                  style={{
                    height: 221,
                   width: '100%',
                   

                    marginBottom: 19.9,
                    borderRadius: 4,
                  }}
                />
                <Text style={styles.fotoTitulo}>{item.nombreSucursal}</Text>
                <Text style={styles.fotoSubtitulo}>{item.direccion}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  caja1: {
    marginTop: 54.8,
    marginBottom: 38,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo1: {
    fontSize: 24,

    marginLeft: 8.7,
  },

  fotoTitulo: {
    fontSize: 16,
    marginBottom: 8.7,
  },
  fotoSubtitulo: {
    fontSize: 14,
    color: '#909090',
  },
});
