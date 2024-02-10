import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { getDatabase, ref, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Sample questions array
const questions = [
  "How old are you",
  "Ethnicity",
  "City,State",
  "Interest",
  "Tell us about you"
  // Add more questions as needed
];

const Mentee = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1)); // For fade animation
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();

  const handleSubmit = () => {
    if (!user) {
      Alert.alert("Error", "No authenticated user found.");
      return;
    }
    if (answer.trim() === '') {
      Alert.alert("Error", "Please provide an answer before submitting.");
      return;
    }

    // Construct the answer object
    const questionId = `Q${currentQuestionIndex + 1}`;
    const userAnswer = { question: questions[currentQuestionIndex], answer: answer };

    // Specify the path to include user data along with answers
    const userAnswersRef = ref(db, `users/${user.uid}/answers/${questionId}`);

    push(userAnswersRef, userAnswer)
      .then(() => {
        setAnswer(''); // Clear the answer input
        animateToNextQuestion();
      })
      .catch((error) => {
        console.error("Error writing answer to Firebase Database", error);
        Alert.alert("Error", "Failed to submit your answer.");
      });
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
        fadeAnim.setValue(1); 
      } else {
        // Handle the end of questions
        Alert.alert("Completed", "You have answered all questions.");
        navigation.navigate("HomeScreen")
      }
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.question}>{questions[currentQuestionIndex]}</Text>
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

export default Mentee;

