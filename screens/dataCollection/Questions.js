import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Animated, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../backend/FirebaseConfig';
import { ref, update } from 'firebase/database';
import { getUserID, getUserData } from '../../functions/functions';

const questions = [
  {
    key: 'age',
    question: "How old are you?",
    options: ['18-24', '25-34', '35-44', '45-54', '55+'],
  },
  {
    key: 'ethnicity',
    question: "What is your ethnicity?",
    options: ['Asian', 'Black', 'Hispanic', 'White', 'Other'],
  },
  {
    key: 'state',
  question: "What state are you from?",
  options: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Other']
  },
  {
    key: 'interest',
    question: "What are your interests?",
    options: null,
  },
  {
    key: 'aboutYou',
    question: "Tell us about you",
    options: null, 
  },
];

const Questions = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [userData, setUserData] = useState({});

  const handleSubmit = async () => {
    getUserData(getUserID(), setUserData).then(() => {
      const userRef = ref(db, `users/${getUserID()}`);
      update(userRef, {[questions[currentQuestionIndex].key]: answer}).then(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswer('');
        } else {
          Alert.alert("Completed", "You have answered all questions.");
          navigation.navigate('Profile');
        }
        animateToNextQuestion();
      }).catch((error) => {
        console.error("Error updating user data", error);
        Alert.alert("Error", "Could not update user data.");
      });
    });
  };

  const animateToNextQuestion = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      fadeAnim.setValue(1);
    });
  };

  const renderInputMethod = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.options) {
      return (
        <Picker
          selectedValue={answer}
          onValueChange={(itemValue, itemIndex) => setAnswer(itemValue)}
          style={styles.picker}>
          {currentQuestion.options.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      );
    } else {
      return (
        <TextInput
          style={styles.input}
          onChangeText={setAnswer}
          value={answer}
          placeholder="Your answer here"
          multiline
          textAlignVertical="top"
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.question}>{questions[currentQuestionIndex].question}</Text>
          {renderInputMethod()}
        </Animated.View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
    marginTop: -30, 
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 300,
    padding: 10,
    marginBottom: 10, 
    height: 100,
    marginTop: 50, 
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20, 
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '100%', 
    marginBottom: 400, 
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Questions;

