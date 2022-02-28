import React from 'react';
import {OnBoarding} from '../../components/tutotial-screen/OnBoarding';
import {StackScreenProps} from '@react-navigation/stack';
import {View} from 'react-native';

interface Props extends StackScreenProps<any, any> {}

export const TutorialScreen = ({navigation}: Props) => {
  return <OnBoarding />;
};
