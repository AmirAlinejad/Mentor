import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import Logo from '../../assets/icon.png';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { FIREBASE_AUTH, db } from '../../backend/FirebaseConfig';

// Simplified Input component
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

// Simplified Button component
const Button = ({ text, onPress, bgColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: bgColor }]}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const SignUp = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const { height } = useWindowDimensions();
  const auth = FIREBASE_AUTH;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSignUpPressed = async () => {
    setLoading(true);

    if (!userName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(response.user, {
        displayName: userName,
      });

      const userRef = ref(db, `users/${response.user.uid}`);
      await set(userRef, {
        userName: userName,
        email: email,
        userID: response.user.uid,
      });

      navigation.navigate("Decision");
    } catch (error) {
      Alert.alert("Signup failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onLoginIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={[styles.logo, { height: height * 0.2 }]} resizeMode="contain" />

      <Text style={styles.title}>Sign Up!</Text>

      <Input placeholder="Username" value={userName} setValue={setUserName} />
      <Input placeholder="Email" value={email} setValue={setEmail} keyboardType="email-address" />
      <Input placeholder="Password" value={password} setValue={setPassword} secureTextEntry={!passwordVisible} />
      <Input placeholder="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} secureTextEntry={!passwordVisible} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button text="Sign Up" onPress={onSignUpPressed} bgColor={'#FF5349'} />
      )}

      <Text style={styles.signupText}>Have an account already?</Text>
      <TouchableOpacity onPress={onLoginIn}>
        <Text style={styles.signupLink}>Log In</Text>
      </TouchableOpacity>
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
    width: '60%',
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
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },
  signupLink: {
    color: '#3498db',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default SignUp;

