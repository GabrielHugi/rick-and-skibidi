import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CharacterListScreen from './screens/CharacterListScreen';
import CharacterDetailScreen from './screens/CharacterDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Character List">
        <Stack.Screen 
          name="Character List"
          component={CharacterListScreen}
          options={{ title: 'Character List' }}
        />
        <Stack.Screen 
          name="Character Detail" 
          component={CharacterDetailScreen} 
        /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
}
