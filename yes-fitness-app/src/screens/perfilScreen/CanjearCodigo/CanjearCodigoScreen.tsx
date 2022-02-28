import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import HeaderLogo from '../../../components/Header/HeaderLogo';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {stylesYes} from '../../../theme/appTheme';

interface Props extends StackScreenProps<any, any> {}

export const CanjearCodigoScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 5});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <View style={{flex: 1, marginTop: insets.top + 9.8, marginHorizontal: 24}}>
      {/*  */}
      <HeaderLogo
        tieneFlecha={true}
        action={() => {
          navigation.pop();
        }}
      />

      <View style={{alignItems: 'center'}}>
        <Text style={styles.titulo1}>Canjear cupón</Text>

        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={5}
          keyboardType="email-address"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />

        <Text style={styles.textoAviso}>
          Canjea aquí tu código de promoción y tendrás acceso a un paquete de 5
          clases gratis por 30 días.
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Terminos');
          }}
          activeOpacity={0.6}>
          <Text style={styles.textoLeerMas}>Leer más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titulo1: {
    fontSize: 24,
    marginTop: 117.3,
    marginBottom: 78,
  },

  titulo2: {
    fontSize: 15,
    lineHeight: 27,
    marginBottom: 22,
  },

  fotoTitulo: {
    fontSize: 16,
    marginBottom: 8.7,
  },
  fotoSubtitulo: {
    fontSize: 14,
    color: '#909090',
  },

  cell: {
    ...stylesYes.containerStyle,

    width: 56,
    height: 71,

    fontSize: 50,
    marginRight: 6,
    fontWeight: '300',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },

  textoAviso: {
    textAlign: 'center',
    width: 316,
    color: '#909090',
    marginTop: 64,
    lineHeight: 28,
    fontSize: 16,
    marginBottom: 64,
  },

  textoLeerMas: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
