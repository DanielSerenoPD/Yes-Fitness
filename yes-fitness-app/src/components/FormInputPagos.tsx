import React, {useState} from 'react';
import {styles} from '../theme/appTheme';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {validateEmail} from '../funciones/validarEmail';
import Password from '../../assets/imagenes/utiles/Password.svg';
import {size, isEmpty} from 'lodash';

type TipoInput = 'nombre' | 'mesExpiracion' | 'añoExpiracion' | 'cvv';

interface Props {
  name: string;
  titulo: string;
  placeholder: string;
  alert: string;
  onChange(e: object, name: string): any;
  onEndEditing?: () => void;
  value: string;
  //el value 2 es opcional y solo es valido para cuando haya mas de dos contraseñas
  value2?: string;
  tipoInput: TipoInput;
}
export const FormInputPagos = ({
  titulo,
  name,
  placeholder,
  alert,
  onChange,
  onEndEditing,
  value,
  tipoInput,
  value2,
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [passwordRepeatVisible, setPasswordRepeatVisible] = useState(true);

  return (
    <View
      style={{
        marginBottom: 12,
        width:
          tipoInput === 'añoExpiracion' ||
          tipoInput === 'mesExpiracion' ||
          tipoInput === 'cvv'
            ? '49%'
            : '100%',
      }}>
      {tipoInput === 'nombre' ? (
        <>
          <Text
            style={{
              fontSize: 14,
              color: alert !== '' ? '#D70915' : '#909090',
              marginBottom: 10,
            }}>
            {titulo}
          </Text>

          <View
            style={{
              borderRadius: 6,

              paddingHorizontal: 12,
              paddingVertical: 16,
              height: 50,
              borderWidth: 0.5,
              borderColor: alert !== '' ? '#D70915' : '#0B0B0B',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextInput
                placeholderTextColor="#7a7a7a"
                onEndEditing={onEndEditing}
                autoCapitalize="words"
                onChange={e => onChange(e, name)}
                style={stylesForm.inputForm}
                keyboardType={'name-phone-pad'}
                placeholder={placeholder}
                value={value}
              />
            </View>
          </View>
          {alert !== '' && <Text style={stylesForm.alertText}>{alert}</Text>}
        </>
      ) : tipoInput === 'mesExpiracion' ? (
        <>
          <Text
            style={{
              fontSize: 14,
              color: alert !== '' ? '#D70915' : '#909090',
              marginBottom: 10,
            }}>
            {titulo}
          </Text>

          <View
            style={{
              borderRadius: 6,

              paddingHorizontal: 12,
              paddingVertical: 16,
              height: 50,
              borderWidth: 0.5,
              borderColor: alert !== '' ? '#D70915' : '#0B0B0B',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextInput
                placeholderTextColor="#7a7a7a"
                maxLength={2}
                onEndEditing={onEndEditing}
                autoCapitalize="words"
                onChange={e => onChange(e, name)}
                style={stylesForm.inputForm}
                keyboardType={'numeric'}
                placeholder={placeholder}
                value={value}
              />
            </View>
          </View>
          {alert !== '' && <Text style={stylesForm.alertText}>{alert}</Text>}
        </>
      ) : tipoInput === 'añoExpiracion' ? (
        <>
          <Text
            style={{
              fontSize: 14,
              color: alert !== '' ? '#D70915' : '#909090',
              marginBottom: 10,
            }}>
            {titulo}
          </Text>

          <View
            style={{
              borderRadius: 6,

              paddingHorizontal: 12,
              paddingVertical: 16,
              height: 50,
              borderWidth: 0.5,
              borderColor: alert !== '' ? '#D70915' : '#0B0B0B',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextInput
                placeholderTextColor="#7a7a7a"
                maxLength={4}
                onEndEditing={onEndEditing}
                autoCapitalize="words"
                onChange={e => onChange(e, name)}
                style={stylesForm.inputForm}
                keyboardType={'numeric'}
                placeholder={placeholder}
                value={value}
              />
            </View>
          </View>

          {alert !== '' && <Text style={stylesForm.alertText}>{alert}</Text>}
        </>
      ) : (
        <>
          <Text
            style={{
              fontSize: 14,
              color: alert !== '' ? '#D70915' : '#909090',
              marginBottom: 10,
            }}>
            {titulo}
          </Text>

          <View
            style={{
              borderRadius: 6,
              width: '49%',
              paddingHorizontal: 12,
              paddingVertical: 16,
              height: 50,
              borderWidth: 0.5,
              borderColor: alert !== '' ? '#D70915' : '#0B0B0B',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextInput
                placeholderTextColor="#7a7a7a"
                maxLength={3}
                onEndEditing={onEndEditing}
                autoCapitalize="words"
                onChange={e => onChange(e, name)}
                style={stylesForm.inputForm}
                keyboardType={'numeric'}
                placeholder={placeholder}
                value={value}
                secureTextEntry={true}
              />
            </View>
          </View>
          {alert !== '' && <Text style={stylesForm.alertText}>{alert}</Text>}
        </>
      )}

      {/*   
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {/* <Text
          style={{
            ...styles.fontMedium,
            fontSize: 10,
            color: '#FB724C',
          }}>
          {alert !== '' && alert}
        </Text> */}

      {/* {tipoInput === 'nombre' ? (
            <TextInput
              autoCapitalize="words"
              onChange={e => onChange(e, name)}
              style={stylesForm.inputForm}
              keyboardType={'name-phone-pad'} */}
      {/* //       placeholder={placeholder}
        //       value={value}
        //     />
        //   ) : tipoInput === 'correo' ? (
        //     <TextInput */}
      {/* //       autoCorrect={false}
        //       autoCapitalize="none"
        //       onChange={e => onChange(e, name)}
        //       style={stylesForm.inputForm}
        //       keyboardType="email-address"
        //       placeholder={placeholder}
        //       value={value}
        //     />
        //   ) : tipoInput === 'password' ? (
        //     <TextInput
        //       onChange={e => onChange(e, name)}
        //       style={stylesForm.inputForm}
        //       placeholder={placeholder} */}
      {/* //       value={value}
        //       secureTextEntry={true}
        //     />
        //   ) : (
        //     <></>
        //   )}
        // </View> */}

      {/* */}
    </View>

    //   {/* Alert de nombre */}
    // {alert !== '' && value === '' && tipoInput === 'nombre' && (
    //   <Text style={stylesForm.alertText}>{alert}</Text>
    // )}

    // {/* Alert de correo */}
    // {alert !== '' && !validateEmail(value) && tipoInput === 'correo' && (
    //   <Text style={stylesForm.alertText}>{alert}</Text>
    // )}
  );
};

const stylesForm = StyleSheet.create({
  inputForm: {
    fontSize: 14,
    color: 'black',
    padding: 0,
    flex: 1,
  },
  alertText: {
    marginTop: 10,
    color: '#D70915',
  },
});
