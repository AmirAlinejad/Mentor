import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, Animated, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../backend/FirebaseConfig';
import { ref, update } from 'firebase/database';
import Slider from '@react-native-community/slider';
import * as Progress from 'react-native-progress';
import { getUserID } from '../../functions/functions'
const questions = [
  {
    key: 'age',
    question: "How old are you?",
    options: null,
  },
  {
    key: 'ethnicity',
    question: "What is your ethnicity?",
    options: ['Asian', 'Black', 'Hispanic', 'White', 'Other'],
  },
  {
    key: 'state',
    question: "What state are you from?",
    options: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Other'],
  },
  {
    key: 'interests',
    question: "What are your interests?",
    options: null,
  },
  {
    key: 'aboutYou',
    question: "Tell us about you",
    options: null,
  },
];

const interestsArray = [
  'Art',
  'Music',
  'Sports',
  'Food',
  'Travel',
  'Fashion',
  'Technology',
  'Science',
  'Health',
  'Fitness',
  'Education',
  'Entertainment',
  'Business',
  'Finance',
  'Politics',
  'Religion',
  'Other',
];

const Questions = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [interests, setInterests] = useState([]);
  const [age, setAge] = useState(20);

  const progress = (currentQuestionIndex + 1) / questions.length;

  const handleSubmit = async () => {
    let userAnswer;

    if (questions[currentQuestionIndex].key === 'age') {
      userAnswer = { [questions[currentQuestionIndex].key]: age.toString() };
    } else if (questions[currentQuestionIndex].key === 'interests') {
      userAnswer = { [questions[currentQuestionIndex].key]: interests };
    } else {
      if (answer.trim() === '') {
        Alert.alert("Error", "Please provide an answer before submitting.");
        return;
      }
      userAnswer = { [questions[currentQuestionIndex].key]: answer };
    }

    const userRef = ref(db, `users/${getUserID()}`);
    update(userRef, userAnswer).then(() => {
      setAnswer('');
      setAge(20); 
      animateToNextQuestion();
    }).catch((error) => {
      console.error("Error updating user data", error);
      Alert.alert("Error", "Could not update user data.");
    });
  };

  const animateToNextQuestion = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        fadeAnim.setValue(1);
      } else {
        Alert.alert("Completed", "You have answered all questions.");
        navigation.navigate('HomeScreen');
      }
    });
  };
  useEffect(() => {
    const currentOptions = questions[currentQuestionIndex]?.options;
    if (currentOptions && currentOptions.length > 0) {
      setAnswer(currentOptions[0]);
    } else {
    
      setAnswer('');
    }
  }, [currentQuestionIndex]); 
  const renderInputMethod = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.key === 'age') {
      return (
        <View>
          <Slider
            style={{ width: '100%', height: 40 }}
            step={1}
            minimumValue={18}
            maximumValue={100}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            value={age}
            onValueChange={(value) => setAge(value)}
          />
          <Text>Selected Age: {age}</Text>
        </View>
      );
    } else if (currentQuestion.options) {
      return (
        <Picker
          selectedValue={answer}
          onValueChange={(itemValue) => setAnswer(itemValue)}
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
      <Progress.Bar progress={progress} width={null} borderColor={"#000"} borderWidth={2} color={"#7752FE"} style={styles.progressBar} />
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
    marginBottom: 100,
  },
  button: {
    backgroundColor: '#7752FE',
    padding: 10,
    borderRadius: 40,
    width: '50%',
    marginBottom: 350,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  progressBar: {
    marginTop: 50,
    marginBottom: 20,
    alignSelf: 'stretch',

  },
});

export default Questions;

