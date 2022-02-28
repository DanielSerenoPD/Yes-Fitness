import React from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import Flecha from '../../../assets/imagenes/utiles/FlechaIzquierda.svg';
import Logo from '../../../assets/imagenes/utiles/LogoHeader.svg';

interface Props {
  tieneFlecha: boolean;
  action?: () => void;
  iconoDerecha?: any;
  actionDerecha?: () => void;
  titulo?: string;
}

export default function HeaderNormal({
  tieneFlecha,
  action,
  iconoDerecha,
  actionDerecha,
  titulo,
}: Props) {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      {tieneFlecha && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
            }}
            activeOpacity={0.6}
            onPress={action}>
            <Flecha fill={'black'} />
          </TouchableOpacity>

          {titulo && (
            <Text style={{color: 'black', fontSize: 26, marginLeft: 20.6}}>
              {titulo}
            </Text>
          )}
        </View>
      )}

      {iconoDerecha && (
        <TouchableOpacity activeOpacity={0.6} onPress={actionDerecha}>
          {iconoDerecha}
        </TouchableOpacity>
      )}
    </View>
  );
}
