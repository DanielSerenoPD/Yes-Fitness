import React, {useEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HeaderLogo from '../../components/Header/HeaderLogo';
import Lapiz from '../../../assets/imagenes/utiles/Lapiz.svg';
import FlechaDerecha from '../../../assets/imagenes/utiles/FlechaDerecha.svg';
import CambiarFoto from '../../../assets/imagenes/utiles/CambiarFoto.svg';
import auth from '@react-native-firebase/auth';
//Iconos perfil
import Historial from '../../../assets/imagenes/iconos-perfil/Historial.svg';
import Favoritos from '../../../assets/imagenes/iconos-perfil/Favoritos.svg';
import Paquetes from '../../../assets/imagenes/iconos-perfil/Paquetes.svg';
import Cupon from '../../../assets/imagenes/iconos-perfil/Cupon.svg';
import Refiere from '../../../assets/imagenes/iconos-perfil/Refiere.svg';
import Billing from '../../../assets/imagenes/iconos-perfil/Billing.svg';
import Ayuda from '../../../assets/imagenes/iconos-perfil/Ayuda.svg';
import {BotonOpcionesPerfil} from '../../components/Botones/BotonOpcionesPerfil';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthContext} from '../../context/AuthContext';
import {FadeInImage} from '../../components/FadeInImage';
import firestore from '@react-native-firebase/firestore';

interface Props extends StackScreenProps<any, any> {}

export const PerfilScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  AuthContext;
  const {datosUsuario} = useContext(AuthContext);

  useEffect(() => {
    console.log(insets.top);
  }, []);

  return (
    <View style={{flex: 1, marginTop: insets.top}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: 24.2, marginTop: 15}}>
          {/* EditarPerfil */}
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditarPerfilScreen')}
              activeOpacity={0.6}>
              <Lapiz fill="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 45,
            }}>
            {/* Foto de perfil */}

            {datosUsuario.fotoPerfil === '' ? (
              <View style={styles.fotoPerfil}>
                <CambiarFoto fill="black" />
              </View>
            ) : (
              <FadeInImage
                uri={datosUsuario.fotoPerfil}
                style={styles.fotoUsuario}
              />
            )}

            {/* Nombre perfil */}
            <Text style={styles.titulo1}>{datosUsuario.nombreCompleto}</Text>
            <Text style={styles.titulo2}>
              5 de 10 clases restantes Ciclo actual termina Nov 17
            </Text>

            {/* <TouchableOpacity onPress={() => auth().signOut()}>
            <Text style={{textDecorationLine: 'underline'}}>Cerrar sesión</Text>
          </TouchableOpacity> */}
            {/* Clases Restantes */}
          </View>
        </View>
        {/* Container de perfil */}
        <View style={styles.containerPerfil}>
          {/* Historial */}
          <BotonOpcionesPerfil
            texto={'Historial'}
            action={() => {
              navigation.navigate('HistorialScreen');
            }}
            logo={<Historial fill="black" style={{marginRight: 23}} />}
          />

          {/* Favoritos */}
          <BotonOpcionesPerfil
            texto={'Favoritos'}
            action={() => {
              navigation.navigate('FavoritosScreen');
            }}
            logo={<Favoritos fill="black" style={{marginRight: 23}} />}
          />

          {/* Paquetes */}
          <BotonOpcionesPerfil
            texto={'Paquetes'}
            action={() => {
              navigation.navigate('PaquetesScreen');
            }}
            logo={<Paquetes fill="black" style={{marginRight: 23}} />}
          />

          {/* Canjear cupón */}
          <BotonOpcionesPerfil
            texto={'Canjear cupón'}
            action={() => {
              navigation.navigate('CanjearCodigoScreen');
            }}
            logo={<Cupon fill="black" style={{marginRight: 23}} />}
          />

          {/* Refiere y Gana */}
          <BotonOpcionesPerfil
            texto={'Refiere y Gana'}
            action={() => {
              navigation.navigate('CodigoReferirScreen');
            }}
            logo={<Refiere fill="black" style={{marginRight: 23}} />}
          />

          {/* Billing */}
          <BotonOpcionesPerfil
            texto={'Billing'}
            action={() => {
              navigation.navigate('BillingScreen');
            }}
            logo={<Billing fill="black" style={{marginRight: 23}} />}
          />

          {/* Ayuda */}
          <BotonOpcionesPerfil
            texto={'¿Necesitas ayuda?'}
            action={() => {
              navigation.navigate('AyudaScreen');
            }}
            logo={<Ayuda fill="black" style={{marginRight: 23}} />}
          />
          {/* Términos y condiciones */}
          <BotonOpcionesPerfil
            texto={'Términos y condiciones'}
            action={() => {
              navigation.navigate('Terminos');
            }}
            logo={<></>}
          />

          {/* Aviso de Privacidad */}
          <BotonOpcionesPerfil
            texto={'Aviso de Privacidad'}
            action={() => {
              navigation.navigate('Politicas');
            }}
            logo={<></>}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fotoPerfil: {
    borderRadius: 100,
    width: 97,
    height: 97,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 27,
  },
  fotoUsuario: {
    marginBottom: 27,
    borderRadius: 100,
    width: 97,
    height: 97,
  },

  titulo1: {fontSize: 20, marginBottom: 38},
  titulo2: {fontSize: 14, width: 182, textAlign: 'center', marginBottom: 30},
  containerPerfil: {
    marginLeft: 37,
    marginRight: 46.6,
  },
});
