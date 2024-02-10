import React from 'react';
// react native components
import { View } from 'react-native';
// react navigation components
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// my components
import Profile from './profile/Profile';
import Chats from './Chats';
import Search from './Search';

const Tab = createBottomTabNavigator();
function HomeScreen({navigation}) { 

  function ChatsTab() {
    return (
      <View style={{ flex: 1,  justifyContent: 'center' }}>
        <Chats navigation={navigation} />
      </View>
    );
  }

  function SearchTab() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Search navigation={navigation} />
      </View>
    );
  }

  function ProfileTab() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Profile navigation={navigation} />
      </View>
    );
  }

  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'black',
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: 'bold',
            
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
    
            if (route.name === 'Chats') {
              iconName = focused ? 'chat' : 'bubble-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            }else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
    
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Chats" component={ChatsTab} options={{ headerShown: false }} />
        <Tab.Screen name="Search" component={SearchTab} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileTab} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  }

export default HomeScreen;