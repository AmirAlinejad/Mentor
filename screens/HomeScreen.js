import React, { useState, useEffect} from 'react';
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
import Request from './Request';
import { get, ref } from 'firebase/database';
import { auth, db } from '../backend/FirebaseConfig'; 
import { getUserID } from '../functions/functions';
const Tab = createBottomTabNavigator();
function HomeScreen({ navigation,route }) { 
  const [userStatus, setUserStatus] = useState(null);


  const fetchUserStatus = () => {
    const user = auth.currentUser;
    return new Promise((resolve, reject) => { // Return a promise
      if (user) {
        const userRef = ref(db, `users/${user.uid}/status`);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const status = snapshot.val();
              console.log("User status:", status);
              resolve(status); // Resolve with the status
            } else {
              console.log("User does not have a status set.");
              resolve(null); // Resolve with null if status isn't set
            }
          })
          .catch((error) => {
            console.error("Error fetching user status", error);
            Alert.alert("Error", "Could not fetch user status.");
            reject(error); // Reject the promise on error
          });
      } else {
        Alert.alert("Error", "No authenticated user found.");
        resolve(null); // Resolve with null if no user is found
      }
    });
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await fetchUserStatus();
      setUserStatus(status); // Set user status with the fetched status
    };
  
    fetchStatus();
  }, []);

  function ChatsTab() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
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
  function RequestTab() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Request navigation={navigation} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: 'bold',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Request') { 
            iconName = focused ? 'mail' : 'mail-outline'; 
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Chats" component={ChatsTab} options={{ headerShown: false }} />
      {userStatus === 'mentee' && <Tab.Screen name="Search" component={SearchTab} options={{ headerShown: false }} />}
      {userStatus === 'mentor' &&   <Tab.Screen name="Request" component={RequestTab} options={{ headerShown: false, tabBarLabel: 'Inbox' }} />}
      
      <Tab.Screen name="Profile" component={ProfileTab} options={{ headerShown: false }} />
      
    </Tab.Navigator>
  );
}

export default HomeScreen;
