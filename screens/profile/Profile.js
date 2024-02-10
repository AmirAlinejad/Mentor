import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native';
import { getUserData, getUserID } from '../../functions/functions';

const Profile = ({navigation}) => {
  // state
  const [userData, setUserData] = useState({});
  useEffect(() => {
    // Get the user data
    getUserData(getUserID(), setUserData);
  }, []);

  return (
    <View>
      <Text>Profile</Text>
      <Text>{userData.userName}</Text>
      <Text>{userData.age}</Text>
      <Text>{userData.ethnicity}</Text>
    </View>
  );
};

export default Profile;