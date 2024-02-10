import React from "react";
// screens
import SignUp from "./screens/auth/SignUp";
import SignIn from "./screens/auth/SignIn";

// stack navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  render() {
      return (
        <NavigationContainer >
          <Stack.Navigator initialRouteName='SignIn'>
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            
          </Stack.Navigator>
        </NavigationContainer>
      );
  }
};