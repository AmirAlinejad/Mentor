import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Logo from '../../assets/icon.png';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { db } from '../../backend/FirebaseConfig';

// Assuming these are custom components, providing simplified versions
const Input = ({ placeholder, value, setValue, secureTextEntry, keyboardType, onEyeIconPress }) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    onChangeText={setValue}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    style={styles.input}
  />
);

const Button = ({ text, onPress, bgColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: bgColor }]}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true); // Updated for clarity
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSignInPressed = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userRef = ref(db, `users/${response.user.uid}`);
      const userSnapshot = await get(userRef);
  
      if (userSnapshot.exists()) {
        console.log('User Data:', userSnapshot.val());
        const userStatus = userSnapshot.val().status; // Assuming the status is stored under the key 'status'
        navigation.navigate("Profile", { userStatus }); // Pass userStatus as a parameter
      } else {
        console.log('User data not found in the database.');
        // Consider handling this case, perhaps navigating to a different screen or showing an error
      }
    } catch (error) {
      Alert.alert("Sign-in failed", error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const onForgotPasswordPressed = () => {
    Alert.alert('Notice', 'Forgot password feature coming soon!');
  };

  const onSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Welcome Back!</Text>

      <Input
        placeholder="Email"
        value={email}
        setValue={setEmail}
        keyboardType="email-address"
      />
      <Input
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={passwordVisible}
      />

      <Button text="Sign In" onPress={onSignInPressed} bgColor={'#FF5349'} />

      <Button text="Forgot Password?" onPress={onForgotPasswordPressed} bgColor={'#FFFFFF'} />

      <Text style={styles.signupText}>Don't have an account?</Text>
      <Text style={styles.signupLink} onPress={onSignUp}>Sign Up</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#361E25',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  button: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: 16,
    color: 'black',
    marginTop: 20,
},
signupLink: {
  fontSize: 16,
  color: '#3498db',
  fontWeight: 'bold',
  marginTop: 5,
},
button: {
  marginTop: 10,
  backgroundColor: '#FF5349',
  width: '80%',
  padding: 15,
  borderRadius: 5,
  alignItems: 'center',
},
buttonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},
});

export default SignIn;

