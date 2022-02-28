import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Flecha from '../../../assets/imagenes/utiles/FlechaIzquierda.svg';
import Logo from '../../../assets/imagenes/utiles/LogoHeader.svg';

interface Props {
  tieneFlecha: boolean;
  action?: () => void;
  iconoDerecha?: any;
  actionDerecha?: () => void;
}

export default function HeaderLogo({
  tieneFlecha,
  action,
  iconoDerecha,
  actionDerecha,
}: Props) {
  return (
    <View style={{alignItems: 'center'}}>
      <Logo fill={'black'} />
      {tieneFlecha && (
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            position: 'absolute',
            left: 0,
            width: 40,
            height: 40,
          }}
          onPress={action}>
          <Flecha fill={'black'} />
        </TouchableOpacity>
      )}

      {iconoDerecha && (
        <TouchableOpacity
          activeOpacity={0.6}
          style={{position: 'absolute', right: 0}}
          onPress={actionDerecha}>
          {iconoDerecha}
        </TouchableOpacity>
      )}
    </View>
  );
}
