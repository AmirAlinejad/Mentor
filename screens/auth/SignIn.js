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
import { Colors } from '../../styles/Colors';
import CustomText from '../../components/CustomText';


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
  const [passwordVisible, setPasswordVisible] = useState(true); 
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
        const userStatus = userSnapshot.val().status; 
        navigation.navigate("HomeScreen", { userStatus }); 
      } else {
        console.log('User data not found in the database.');
        
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
      <Image source={Logo} style={styles.logo} resizeMode='cover' />

      <CustomText style={styles.title} text='Welcome back!' font='bold' />

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

      <Button text="Sign In" onPress={onSignInPressed} bgColor={Colors.purple} />

      <CustomText style={styles.signupText} text="Don't have an account?" />
      <TouchableOpacity onPress={onSignUp} style={{marginBottom: 125}}>
        <CustomText style={styles.signupLink} text="Sign Up"/>
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
    width: 300,
    height: 300,
    marginBottom: -40,
    marginTop: -80
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
    borderRadius: 30,
  },
  forgotPasswordButton: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '80%',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  forgotPasswordButtonText: {
    fontSize: 16,
    color: 'black',
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
  borderRadius: 30,
  alignItems: 'center',
},
buttonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},
});

export default SignIn;

