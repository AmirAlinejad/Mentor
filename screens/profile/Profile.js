import React from 'react';
import { View, Text } from 'react-native';
import { getUserData, getUserID } from '../../functions/functions';

const Profile = ({navigation}) => {
  const [userData, setUserData] = useState({});


  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

export default Profile;