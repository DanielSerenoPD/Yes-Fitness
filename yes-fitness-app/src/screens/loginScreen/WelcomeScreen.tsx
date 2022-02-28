import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../../assets/imagenes/login/Logo.svg';

const {width, height} = Dimensions.get('screen');

interface Props extends StackScreenProps<any, any> {}

export const WelcomeScreen = ({navigation}: Props) => {
  return (
    <View style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />

      {/* Imagen de portada */}
      <ImageBackground
        style={styles.backgroungImage}
        source={require('../../../assets/imagenes/login/portada.jpg')}>
        {/* View del logo y texto */}
        <View
          style={{
            top: '35.85%',
            position: 'absolute',
            alignItems: 'center',
            left: 0,
            right: 0,
          }}>
          <Logo style={{marginBottom: 22.7}} />
          <Text
            style={{
              width: 206,
              color: 'white',
              textAlign: 'center',
              lineHeight: 24,
            }}>
            El acceso a todos los estudios fitness de tu ciudad.
          </Text>
        </View>

        {/* View de los botones*/}
        <View
          style={{
            bottom: '8.92%',
            position: 'absolute',
            width: '100%',
          }}>
          {/* Botones */}
          <View
            style={{
              justifyContent: 'space-between',
              marginBottom: 29,
              flexDirection: 'row',
              paddingHorizontal: 24,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}
              activeOpacity={0.8}
              style={{
                backgroundColor: '#FFFFFF',
                width: '49%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 30,
              }}>
              <Text style={{color: '#0B0B0B'}}>Únete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('LogInScreen')}
              activeOpacity={0.8}
              style={{
                backgroundColor: 'transparent',
                width: '49%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 30,
                borderWidth: 1,
                borderColor: 'white',
              }}>
              <Text style={{color: 'white'}}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 15,
            }}>
            Explorar{' '}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroungImage: {
    flex: 1,
    maxWidth: '100%',
  },
});
