import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BotonPagar} from './Botones/BotonPagar';

interface Props {
  title: string;
  action: () => void;
}

export const FooterPagar = ({title, action}: Props) => {
  return (
    <View style={styles.footerView}>
      <BotonPagar title={title} action={action} />
    </View>
  );
};

const styles = StyleSheet.create({
  footerView: {
    height: 131,
    borderTopWidth: 1,
    borderTopColor: '#e3e3e6',
    paddingHorizontal: 24,
    paddingTop: 21,
  },
});
