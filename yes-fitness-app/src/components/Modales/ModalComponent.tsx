import React, {useState, useContext, useEffect, useRef} from 'react';
import {View, Modal, Animated} from 'react-native';
import {AuthContext} from '../../context/AuthContext';

export const ModalComponent = ({children}: any) => {
  const {modalSegundo} = useContext(AuthContext);

  const [showModal, setShowModal] = useState(modalSegundo);
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    toggleModal();
  }, [modalSegundo]);

  const toggleModal = () => {
    if (modalSegundo) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        speed: 150,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => {
        setShowModal(false);
      }, 200);

      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Modal transparent visible={showModal}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.View
          style={{
            width: '80%',
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 30,
            borderRadius: 20,
            elevation: 20,
            transform: [{scale: scaleValue}],
          }}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};
