import {Alert, Linking} from 'react-native';

export const abrirLink = (url: string) => {
  Linking.openURL(url).catch(err => {
    console.error('Failed opening page because: ', err);
    Alert.alert('hubo un error');
  });
};
