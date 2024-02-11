import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal, Button, TextInput } from 'react-native';
import { getUserData, getAllUserData, getUserID, scoreMentor } from '../functions/functions';
import MemberCard from '../components/MemberCard';
import Header from '../components/Header';
import { Colors } from '../styles/Colors';
import ToggleButton from '../components/ToggleButton';
import Slider from '@react-native-community/slider';
import { set } from 'firebase/database';
import CustomText from '../components/CustomText';

const Search = ({navigation}) => {

  // state
  const [user, setUser] = useState({});
  const [users, setUsers] = useState({});
  // filter parameters
  const [interests, setInterests] = useState([]); // ['Art', 'Music', 'Sports'] these are the ones currently selected from all interests
  const [minAge, setMinAge] = useState(20);
  const [useEthnicity, setUseEthnicity] = useState(false);
  // filter state
  const [filter, setFilter] = useState(false);

  // toggle filter modal
  const toggleFilter = () => {
    setFilter(!filter);
  };

  // Get the user data
  useEffect(() => {
    // Function to fetch and filter user data
    const fetchData = () => {
      getUserData(getUserID(), setUser);
      getAllUserData(setUsers);
    };
  
    // Initial fetch
    fetchData();
  
    // Set up interval to refresh data every second
    const intervalId = setInterval(fetchData, 2000);
  
    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  // convert users object to array
  let usersArray = Object.keys(users).map((key) => {
    return users[key];
  });

  // filter object array to remove mentors (takes care of current user)
  usersArray = usersArray.filter((user) => {
    return user.status === 'mentor';
  });

  // filter users array by all user's interests
  usersArray = usersArray.filter((mentor) => {
    if (!mentor.interests) return false;

    return mentor.interests.some((interest) => user.interests.includes(interest));
  });

  // filter by filter properties
  usersArray = usersArray.filter((mentor) => {
    // filter 
    // ethinicty
    if (useEthnicity && mentor.ethnicity !== user.ethnicity) return false;
    // age
    if (mentor.age < minAge) return false;
    // interests
    if (interests.length > 0) {
      if (!mentor.interests) return false;
      if (!mentor.interests.some((interest) => interests.includes(interest))) return false;
    }

    return true;
  });

  // sort array using algorithm
  if (user) {
    usersArray.sort((a, b) => {
      return scoreMentor(a, user, useEthnicity) - scoreMentor(b, user, useEthnicity);
    });
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} text="Search" back={false} />
      <View style={{ height: 65 }}>
        <ScrollView horizontal>
        {
          user.interests && user.interests.map((interest, index) => {
            const onToggle = () => {
              if (interests.includes(interest)) {
                setInterests(interests.filter((item) => item !== interest));
              } else {
                setInterests([...interests, interest]);
              }
            }

            return (
              <View>
                <ToggleButton 
                  key={index} 
                  text={interest} 
                  onPress={onToggle}
                  toggled={interests.includes(interest)}
                />
              </View>
            );
          })
        }
        </ScrollView>
      </View>
      <Button title='Filter' onPress={toggleFilter} />
      <ScrollView>
      {
        usersArray.map((user, index) => {
          return (
            <MemberCard key={index} user={user} userID={user.userID} navigation={navigation} />
          );
        })
      }
      </ScrollView>

      <Modal animationType="slide" visible={filter} transparent>
        <View style={styles.modal}>
          <View style={styles.filter}>
            <Button title="Close" onPress={toggleFilter} bgColor={Colors.purple} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CustomText style={{fontSize: 20}} text={`Use ethnicity? `} />
              <ToggleButton 
                text={useEthnicity ? 'Yes' : 'No'} 
                onPress={() => setUseEthnicity(!useEthnicity)} 
                toggled={useEthnicity}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CustomText style={{fontSize: 20}} text={`Minimum Age `} />
              <View>
              <Slider
                style={{width: 200, height: 40}}
                step={1}
                minimumValue={20}
                maximumValue={100}
                minimumTrackTintColor={Colors.purple}
                maximumTrackTintColor={Colors.lightGray}
                value={minAge}
                onValueChange={setMinAge}
              />
              <CustomText style={{marginLeft: (minAge - 20) * 2.2, fontSize: 20}} text={minAge} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
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
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  filter: {
    height: '33%',
    width: '100%',
    paddingTop: 20,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
});

export default Search;