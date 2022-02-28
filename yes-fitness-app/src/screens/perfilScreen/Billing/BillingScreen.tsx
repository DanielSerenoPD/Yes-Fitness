import React, {useState, useContext} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import HeaderLogo from '../../../components/Header/HeaderLogo';
import {BillingPaquete} from '../../../components/BillingPaquete';
import CustomBackdrop from '../../../components/BottomSheet/CustomBackdrop';
import BottomSheet from '../../../components/BottomSheet/BottomSheet';
import {AuthContext} from '../../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Paquete} from '../../../components/Paquete';
import {
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

interface Props extends StackScreenProps<any, any> {}

export const BillingScreen = ({navigation}: Props) => {
  // ref

  const {abrirBottomSheet} = useContext(AuthContext);
  const {datosUsuario, setDatosUsuarioPerfil, abrirModal} =
    useContext(AuthContext);
  const insets = useSafeAreaInsets();

  const [suscripcion, setSuscripcion] = useState('vigente');

  const actualizarSuscripcion = async (clases: any, plan: any) => {
    const documento = await firestore()
      .collection('usuarios')
      .doc(datosUsuario.idDocumento)
      .get();
    let usuario = documento.data();
    if(usuario&&usuario.suscripcionActual.plan.name !== plan.name){
      //Remplazar con la direccion del servidor donde alojaran la api
    axios.post('https://api-stripe-integration.herokuapp.com/subscription/update-subscription', {
      subscriptionId: usuario && usuario.suscripcionActual.id,
      price: plan.price,
    }).then(async res=>{
      let suscripcion = res.data.subscription;
      await firestore()
      .collection('usuarios')
      .doc(datosUsuario.idDocumento)
      .update({
        clases,
        suscripcionPendiente: {
          id: usuario.suscripcionActual.id,
          customerId: suscripcion.customer,
          dateStart: suscripcion.current_period_start,
          dateEnd:  suscripcion.current_period_end,
          plan:{name:plan.name, price: plan.price},
          status: true,
        },
      });
    })
    }else{
      //Aqui va la logica para cuando un suscriptor quiere actualizar al mismo plan
      console.log("Es la misma suscripcion")
    }
  };
  const actualizarPremium = async () => {
    const plans = firestore().collection('paquetesClases');
    const name = await plans.where('name', '==', '30 Clases').get();
    name.forEach(doc => {
      actualizarSuscripcion(30, doc.data());
    });
  };
  const actualizarStandar = async () => {
    const plans = firestore().collection('paquetesClases');
    const name = await plans.where('name', '==', '20 Clases').get();
    name.forEach(doc => {
      actualizarSuscripcion(20, doc.data());
    });
  };
  const actualizarBasic = async () => {
    const plans = firestore().collection('paquetesClases');
    const name = await plans.where('name', '==', '10 Clases').get();
    name.forEach(doc => {
      actualizarSuscripcion(10, doc.data());
    });
  };

  return (
    <BottomSheetModalProvider>
      <View style={{flex: 1, marginTop: insets.top + 9.8}}>
        {/*  */}

        <View style={{marginHorizontal: 24}}>
          <HeaderLogo
            tieneFlecha={true}
            action={() => {
              navigation.pop();
            }}
          />

          <Text style={styles.titulo1}>Billing</Text>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setSuscripcion('vigente');
              }}
              style={
                suscripcion === 'vigente'
                  ? {...styles.cajaOpcion, marginRight: 68}
                  : {...styles.cajaOpcionApagada, marginRight: 68}
              }>
              <Text
                style={{
                  fontSize: 12,
                  color: suscripcion === 'vigente' ? '#0B0B0B' : '#909090',
                }}>
                Suscripción vigente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setSuscripcion('anteriores');
              }}
              style={
                suscripcion === 'anteriores'
                  ? styles.cajaOpcion
                  : styles.cajaOpcionApagada
              }>
              <Text
                style={{
                  fontSize: 12,
                  color: suscripcion === 'anteriores' ? '#0B0B0B' : '#909090',
                }}>
                Cargos anteriores
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separador}></View>

        {/*  */}

        {suscripcion === 'vigente' ? (
          <View style={{marginTop: 25, marginHorizontal: 24}}>
            <BillingPaquete
              nombrePaquete="Paquete 30 clases"
              fechaCompra="16/10/2021"
              fechaExpiracion="16/11/2021"
              idNumero="0586"
              clasesDisponibles={7}
            />

            <Text
              style={{
                ...styles.textoRenovacion,
                marginTop: 47,
                marginBottom: 16,
              }}>
              Renovación mensual automática.
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textoRenovacion}>
                Próximo cargo: 17/11/2021.{' '}
              </Text>
              <TouchableOpacity
                onPress={abrirBottomSheet}
                style={{alignItems: 'baseline'}}
                activeOpacity={0.6}>
                <Text
                  style={{
                    ...styles.textoRenovacion,
                    textDecorationLine: 'underline',
                  }}>
                  Cambiar a otro plan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <ScrollView
              style={{marginBottom: 20, marginTop: 0}}
              showsVerticalScrollIndicator={false}>
              {[1, 2, 3, 4, 5, 6].map((datos, i) => (
                <View
                  key={i}
                  style={
                    i === 0
                      ? {...styles.paquete, borderTopColor: 'white'}
                      : styles.paquete
                  }>
                  <Text style={styles.nombrePaquete}>Paquete 10 clases</Text>
                  <Text style={styles.textoCompra}>Compra: 16/10/2021</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.textoExpiracion}>
                      Expiración: 16/11/2021
                    </Text>
                    <Text style={styles.textoExpiracion}> ID-0586</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* Botom sheet */}
        <BottomSheet>
          <BottomSheetScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <View style={{marginHorizontal: 24}}>
              <Text style={{...styles.textoRenovacion, marginTop: 14}}>
                Tienes un paquete vigente. Si eliges
              </Text>
              <Text
                style={{
                  ...styles.textoRenovacion,
                  marginBottom: 30,
                  marginTop: 5,
                }}>
                otro, tu plan cambiará{' '}
                <Text style={{textDecorationLine: 'underline'}}>
                  a partir del siguiente mes.
                </Text>
              </Text>
              <Paquete
                texto1="$2,100 MXN"
                texto2="30 Clases"
                texto3="Vigencia 30 días. Renovación automática."
                tipoPaquete="activo"
                action={() => actualizarPremium()}
              />
            </View>

            {/* Linea Gris */}
            <View style={styles.linea} />
            <View style={{marginHorizontal: 24, marginBottom: 34}}>
              <Paquete
                texto1="$1,700 MXN"
                texto2="20 Clases"
                texto3="Vigencia 30 días. Renovación automática."
                tipoPaquete="normal"
                action={() => actualizarStandar()}
              />
              <Paquete
                texto1="$1,100 MXN"
                texto2="10 Clases"
                texto3="Vigencia 30 días. Renovación automática."
                tipoPaquete="normal"
                action={() => actualizarBasic()}
              />
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginTop: 54.8,
    color: '#0B0B0B',
    marginBottom: 71,
  },

  titulo2: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 56,
  },

  cajaOpcion: {
    width: 118,
    paddingBottom: 9,
    borderBottomWidth: 2,
    borderBottomColor: '#0B0B0B',
  },

  cajaOpcionApagada: {
    width: 118,
    paddingBottom: 9,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },

  separador: {
    height: 0.5,
    backgroundColor: '#C3C3C3',
  },

  fotoTitulo: {
    fontSize: 16,
    marginBottom: 8.7,
  },
  fotoSubtitulo: {
    fontSize: 14,
    color: '#909090',
  },

  textoAviso: {
    textAlign: 'center',
    width: 316,
    color: '#909090',
    marginTop: 56,
    lineHeight: 28,
    fontSize: 16,
    marginBottom: 64,
  },

  textoLeerMas: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  textoRenovacion: {
    fontSize: 14,

    color: '#909090',
  },
  linea: {
    backgroundColor: '#C3C3C3',
    height: 0.5,
    marginBottom: 19,
    marginTop: 9,
  },

  paquete: {
    height: 120,
    paddingHorizontal: 24,

    borderTopWidth: 0.5,
    borderTopColor: '#C3C3C3',

    paddingTop: 22,
  },
  nombrePaquete: {
    color: 'black',
    fontSize: 22,
    marginBottom: 16,
  },
  textoCompra: {
    fontSize: 12,
    color: 'black',
    marginBottom: 11,
  },
  textoExpiracion: {
    fontSize: 12,
    color: '#909090',
  },
});
