import React, {useCallback} from 'react';
import {Animated, Image, Text, View} from 'react-native';
import {FadeInImage} from '../../../../components/FadeInImage';
import Choice from '../Choice';
import {ACTION_OFFSET} from '../utils/constants';

import {styles} from './styles';

export default function Card({
  name,
  source,
  isFirst,
  numero,
  kilometros,
  swipe,
  tiltSign,
  ...rest
}) {
  const rotate = Animated.multiply(swipe.x, tiltSign).interpolate({
    inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const likeOpacity = swipe.x.interpolate({
    inputRange: [25, ACTION_OFFSET],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = swipe.x.interpolate({
    inputRange: [-ACTION_OFFSET, -25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), {rotate}],
  };

  const renderChoice = useCallback(() => {
    return (
      <>
        <Animated.View
          style={[
            styles.choiceContainer,
            styles.likeContainer,
            {opacity: likeOpacity},
          ]}>
          <Choice type="like" />
        </Animated.View>
        <Animated.View
          style={[
            styles.choiceContainer,
            styles.nopeContainer,
            {opacity: nopeOpacity},
          ]}>
          <Choice type="nope" />
        </Animated.View>
      </>
    );
  }, [likeOpacity, nopeOpacity]);

  return (
    <Animated.View
      style={[styles.container, isFirst && animatedCardStyle]}
      {...rest}>
      <FadeInImage uri={source} style={styles.image} />

      <Text style={styles.name}>{name}</Text>
      <Text
        style={{
          position: 'absolute',
          bottom: 22,
          left: 22,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff',
        }}>
        A {kilometros} Km de ti
      </Text>
      {isFirst && renderChoice()}
    </Animated.View>
  );
}
