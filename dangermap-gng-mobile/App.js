import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './screens/StackNavigator.js';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const App = () => {

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
