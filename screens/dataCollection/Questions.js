import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { db } from '../../backend/FirebaseConfig';
import { get, ref, set } from 'firebase/database';
import { getUserID, getUserData } from '../../functions/functions';

// Sample questions array
const questions = [
  {
    key: 'age',
    question: "How old are you?",
  },
  {
    key: 'ethnicity',
    question: "What is your ethnicity?",
  },
  {
    key: 'state',
    question: "What state are you from?",
  },
  {
    key: 'city',
    question: "What city are you from?",
  },
  {
    key: 'interest',
    question: "What are your interests?",
  },
  {
    key: 'aboutYou',
    question: "Tell us about you",
  },
  // Add more questions as needed
];

const Questions = ({ navigation }) => {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1)); // For fade animation
  const [userData, setUserData] = useState({});

  const handleSubmit = async () => {
    getUserData(getUserID(), setUserData); // Get the user data

    if (answer.trim() === '') {
      Alert.alert("Error", "Please provide an answer before submitting.");
      return;
    }

    // Construct the answer object
    const userAnswer = { question: questions[currentQuestionIndex], answer: answer };

    // Specify the path to include user data along with answers
    const userRef = ref(db, `users/${getUserID()}`);

    // Push the answer to the database
    console.log(userData);
    const updatedUserData = {
      ...userData,
      [questions[currentQuestionIndex].key]: userAnswer.answer,
    }
    await set(userRef, updatedUserData)
    setUserData(updatedUserData);
    
    console.log(userData);
        
    setAnswer(''); // Clear the answer input
    animateToNextQuestion();
  };

  const animateToNextQuestion = () => {
    // Fade out the current question
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to next question
        fadeAnim.setValue(1); // Immediately return opacity to 1 for the next question
      } else {
        // Handle the end of questions
        Alert.alert("Completed", "You have answered all questions.");
        navigation.navigate('Profile'); // Navigate to the home screen ***testing
      }
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.question}>{questions[currentQuestionIndex].question}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setAnswer}
        value={answer}
        placeholder="Your answer here"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    padding: 10,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
  },
});

export default Questions;

