import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BotonBlanco} from './Botones/BotonBlanco';

interface Props {
  title: string;
  action: () => void;
}

export const Footer = ({title, action}: Props) => {
  return (
    <View style={styles.footerView}>
      <BotonBlanco title={title} action={action} />
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
