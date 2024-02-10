import React from "react";
// screens
import SignUp from "./screens/auth/SignUp";
import SignIn from "./screens/auth/SignIn";
import Questions from "./screens/dataCollection/Questions";
import Search from "./screens/Search";
import Decision from "./screens/dataCollection/Decision";
import Profile from "./screens/profile/Profile";
import Request from "./screens/Request";
// stack navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from "./screens/HomeScreen";
import Chats from "./screens/Chats";

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  render() {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='SignIn'>
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Questions" component={Questions} options={{ headerShown: false }} />
            <Stack.Screen name="Chats" component={Chats} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Stack.Screen name="Decision" component={Decision} options={{ headerShown: false }} />
            <Stack.Screen name="Request" component={Request} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
  }
};