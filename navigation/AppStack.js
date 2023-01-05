import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen, ParkCreationScreen, RentBikeScreen, ReturnBikeScreen, BringBackBikeScreen } from '../screens';

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen}  options={{ title: 'Clink Parking' }} />
      <Stack.Screen name='ParkCreation' component={ParkCreationScreen} 
      options={{ title: 'Crear estacionamiento' }} />
      <Stack.Screen name='RentBike' component={RentBikeScreen} 
      options={{ title: 'Rentar bicicleta' }} />
      <Stack.Screen name='ReturnBike' component={ReturnBikeScreen} 
      options={{ title: 'Devolver bicicleta' }} />
      <Stack.Screen name='BringBackBike' component={BringBackBikeScreen} 
      options={{ title: 'Retirar bicicleta' }} />
    </Stack.Navigator>
  );
};
