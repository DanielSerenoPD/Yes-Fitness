import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {useAbrirModal} from '../hooks/useAbrirModal';
import LottieView from 'lottie-react-native';
import {AuthContext} from '../context/AuthContext';

export const ModalCargandoSegundo = () => {
  let {modalTercero} = useContext(AuthContext);
  return (
    <Modal isVisible={modalTercero}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            height: 150,
            width: 250,
            borderRadius: 10,
          }}>
          <LottieView
            source={require('../../assets/lottie/loading_modal.json')}
            autoPlay
            loop
          />
        </View>
      </View>
    </Modal>
  );
};
