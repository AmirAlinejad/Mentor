import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { getUserData, getUserID } from '../../functions/functions';
import Header from '../../components/Header';
import CustomText from '../../components/CustomText';

const fakeUserData = {
  userName: 'John Doe',
  age: 25,
  ethnicity: 'Asian',
  description: 'I am a software engineer',
  interests: ['Art', 'Music', 'Sports'],
};

const Profile = ({navigation}) => {
  // state
  /*const [userData, setUserData] = useState({}); disabled for styling
  useEffect(() => {
    // Get the user data
    getUserData(getUserID(), setUserData);
  }, []);*/

  return (
    <View style={styles.container}>
      <Header navigation={navigation} text="" back={true} />
      <View style={styles.profileData}>
      <View style={styles.avatar}></View>
        <View style={{marginTop: 20, gap: 15}}>
          <CustomText style={styles.profileText} text={fakeUserData.userName} font="bold" />
          <CustomText style={[styles.profileText, {fontSize: 20}]} text={fakeUserData.description} />
          <View>
          {
            fakeUserData.interests.map((interest, index) => {
              return (
                <CustomText key={index} style={{fontSize: 20}} text={interest} />
              );
            })
          }
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileData: {
    marginTop: 50,
    alignItems: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 30,
    backgroundColor: 'gray',
  },
  profileText: {
    textAlign: 'center',
    fontSize: 30,
  }
});

export default Profile;