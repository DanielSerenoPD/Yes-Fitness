import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {WelcomeScreen} from '../screens/tutorialScreens/WelcomeScreen';
import {WelcomeScreen2} from '../screens/tutorialScreens/WelcomeScreen2';
import {WelcomeScreen2Otro} from '../screens/tutorialScreens/WelcomeScreen2Otro';
import {WelcomeScreen3} from '../screens/tutorialScreens/WelcomeScreen3';
import {WelcomeScreen4} from '../screens/tutorialScreens/WelcomeScreen4';

export type RootStackParams = {
  WelcomeScreen: undefined;
  WelcomeScreen2: undefined;
  WelcomeScreen2Otro: undefined;
  WelcomeScreen3: undefined;
  WelcomeScreen4: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const StackTutorial = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="WelcomeScreen2" component={WelcomeScreen2} />
      <Stack.Screen name="WelcomeScreen2Otro" component={WelcomeScreen2Otro} />
      <Stack.Screen name="WelcomeScreen3" component={WelcomeScreen3} />
      <Stack.Screen name="WelcomeScreen4" component={WelcomeScreen4} />
      {/* <Stack.Screen name="PaisScreen2" component={PaisScreen2} />
      <Stack.Screen name="PaisesListaScreen" component={PaisesListaScreen} />
      <Stack.Screen name="LocationScreen" component={LocationScreen} />
      <Stack.Screen name="TutorialScreen" component={TutorialScreen} /> */}
    </Stack.Navigator>
  );
};
