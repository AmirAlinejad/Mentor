import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';

const Decision = ({ navigation }) => {
  const auth = getAuth();
  const db = getDatabase();

  const updateUserStatus = (status) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      update(userRef, {
        status: status,
      })
      .then(() => {
        navigation.navigate('Questions');
      })
      .catch((error) => {
        console.error("Error updating user status", error);
        Alert.alert("Error", "Could not update user status.");
      });
    } else {
      Alert.alert("Error", "No authenticated user found.");
    }
  };

  const onPressMentor = () => updateUserStatus('mentor');
  const onPressMentee = () => updateUserStatus('mentee');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Choose your path</Text>
      <TouchableOpacity style={styles.button} onPress={onPressMentor}>
        <Text style={styles.buttonText}>Mentor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonMentee} onPress={onPressMentee}>
        <Text style={styles.buttonMenteeText}>Mentee</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%', 
    alignItems: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#7752FE',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, 
    marginBottom: 20,
    width: '80%', 
    alignItems: 'center',
  },
  buttonMentee: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 300,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7752FE',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonMenteeText: {
    color: '#7752FE',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default Decision;
