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
      <Text style={styles.text}>Decision Screen</Text>
      <TouchableOpacity style={styles.button} onPress={onPressMentor}>
        <Text style={styles.buttonText}>Mentor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onPressMentee}>
        <Text style={styles.buttonText}>Mentee</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles remain the same as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default Decision;
