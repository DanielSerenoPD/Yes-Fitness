import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {useAbrirModal} from '../hooks/useAbrirModal';
import LottieView from 'lottie-react-native';
import {AuthContext} from '../context/AuthContext';

export const ModalCargando = () => {
  let {modal} = useContext(AuthContext);
  return (
    <Modal isVisible={modal}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <LottieView
          source={require('../../assets/lottie/loader_yess.json')}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
};
