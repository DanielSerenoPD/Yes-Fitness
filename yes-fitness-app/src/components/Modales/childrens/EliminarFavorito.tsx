import React, {useContext} from 'react';
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
import {AuthContext} from '../../../context/AuthContext';
import {styles} from '../../../theme/appTheme';
import {ModalComponent} from '../ModalComponent';

interface EliminarFavorito {
  texto: string;
  funcionGenerica(): void;
}

export const EliminarFavorito = ({
  texto,
  funcionGenerica,
}: EliminarFavorito) => {
  const {abrirModalSegundo} = useContext(AuthContext);

  return (
    <ModalComponent>
      <Text
        style={{
          ...styles.fontBold,
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 10,
          color: 'black',
        }}>
        Eliminar
      </Text>
      <Text
        style={{
          ...styles.fontRegular,
          fontSize: 15,
          textAlign: 'center',
          marginBottom: 20,
        }}>
        {texto}
      </Text>
      <TouchableOpacity
        onPress={() => {
          funcionGenerica();
          abrirModalSegundo(false);
        }}
        style={{
          marginBottom: 20,
          backgroundColor: 'black',
          borderRadius: 14,
          justifyContent: 'center',
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{...styles.fontBold, fontSize: 15, color: 'white'}}>
          ELIMINAR
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          abrirModalSegundo(false);
        }}
        style={{
          backgroundColor: 'white',
          borderRadius: 14,
          justifyContent: 'center',
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{...styles.fontBold, fontSize: 15, color: 'black'}}>
          CANCELAR
        </Text>
      </TouchableOpacity>
    </ModalComponent>
  );
};
