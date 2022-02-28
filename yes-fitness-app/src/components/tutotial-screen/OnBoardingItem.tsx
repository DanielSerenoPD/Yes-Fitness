import {rest} from 'lodash';
import React from 'react';
import {View, Image, useWindowDimensions, StyleSheet, Text} from 'react-native';
import {styles} from '../../theme/appTheme';

export const OnBoardingItem = ({item}: any) => {
  const {width} = useWindowDimensions();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width,
      }}>
      <Image
        source={item.image}
        style={[stylesSlide.image, {width, resizeMode: 'contain'}]}
      />
      <View style={{flex: 0.3}}>
        <Text style={stylesSlide.title}>{item.title}</Text>
        <Text style={stylesSlide.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const stylesSlide = StyleSheet.create({
  image: {
    flex: 0.5,
    justifyContent: 'center',
  },
  title: {
    ...styles.fontBold,
    fontSize: 28,
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  description: {
    ...styles.fontMedium,
    textAlign: 'center',
    color: '#62656b',
    paddingHorizontal: 64,
  },
});
