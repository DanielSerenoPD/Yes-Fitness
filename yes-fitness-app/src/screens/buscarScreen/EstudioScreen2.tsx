import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {Footer} from '../../components/Footer';
import HeaderNormal from '../../components/Header/HeaderNormal';
import CorazonChico from '../../../assets/imagenes/utiles/CorazonChico.svg';
import TelefonoChico from '../../../assets/imagenes/utiles/TelefonoChico.svg';
import InstagramChico from '../../../assets/imagenes/utiles/InstagramChico.svg';

interface Props extends StackScreenProps<any, any> {}

export const EstudioScreen2 = ({navigation, route}: Props) => {
  const insets = useSafeAreaInsets();

  const {
    datosEstudio,
    datosClase,
    datosCoach,
    coordenadas,
    horario,
    horarioValor,
    datosHorario,
    nombreSucursal,
    idSucursal,
  } = route.params?.datosClase;

  const {
    fotosGaleria,
    descripcionEstudio,

    fotoPortada,
    instagram,
    medidasSalud,
    facebook,
    servicios,
    numeroTelefono,
  } = datosEstudio;

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8}}>
      <View style={{marginBottom: 20.4, marginHorizontal: 24}}>
        <HeaderNormal
          tieneFlecha={true}
          action={() => {
            navigation.pop();
          }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <FadeInImage
          uri="https://firebasestorage.googleapis.com/v0/b/yes-fitness-f2c41.appspot.com/o/fotosPrueba%2FDSC04778-HDReditLR.png?alt=media&token=0d3a4abe-8d69-4466-8479-2a53b67fd7b6"
          style={styles.imagen}
        /> */}

        {/*  */}
        <View style={{marginHorizontal: 24, marginBottom: 20}}>
          <Text style={styles.titulo}>Acerca del estudio:</Text>

          <Text style={styles.textoInformacion}>{descripcionEstudio}</Text>

          <View style={styles.linea} />

          {/* Contacto */}
          <Text style={styles.contactoTitulo}>Contacto</Text>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              alignItems: 'center',
            }}>
            <TelefonoChico />
            <Text style={styles.contactoTexto}>{numeroTelefono}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              alignItems: 'center',
            }}>
            <InstagramChico />
            <Text style={styles.contactoTexto}>@noisemx</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imagen: {
    height: 507,
    marginBottom: 31,
  },
  linea: {
    height: 0.25,
    backgroundColor: '#707070',
    marginBottom: 21,
  },
  titulo: {
    fontSize: 20,
    color: 'black',
    marginBottom: 8.5,
    marginTop: 27,
  },
  textoInformacion: {
    lineHeight: 24,
    fontSize: 16,
    color: '#909090',
    marginBottom: 25,
    marginTop: 17,
  },

  texto1: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 21,
  },

  titulo2: {
    fontSize: 16,
    color: 'black',
    marginBottom: 6.7,
  },
  textoDireccion: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 23,
  },
  mapa: {
    height: 200,
    borderRadius: 4,
    marginBottom: 34,
  },
  tituloServicios: {
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
  },
  textoServicios: {
    fontSize: 14,
    color: '#909090',
  },

  tituloMedidas: {
    fontSize: 16,
    color: 'black',
    marginBottom: 6.7,
  },
  textoMedidas: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 22,
  },
  contactoTitulo: {
    fontSize: 16,
    color: 'black',
    marginBottom: 18.4,
  },
  contactoTexto: {
    fontSize: 14,
    color: '#909090',
    marginLeft: 10,
  },
});
