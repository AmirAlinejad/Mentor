import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Colors } from "../styles/Colors";
import CustomText from "./CustomText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { db } from "../backend/FirebaseConfig";

const MemberCard = ({navigation, user, userID }) => {

    const sendRequest = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
      
        if (!currentUser) {
          console.error('User must be logged in to send requests');
          return;
        }
      
        const menteeUserId = currentUser.uid; // The current user's userId
      
        try {
          // Path to the mentor's requests in Firebase
          const mentorRequestsRef = ref(db, `users/${userID}/requests`);
      
          // Get the current requests for the mentor
          const snapshot = await get(mentorRequestsRef);
      
          let requests = [];
          if (snapshot.exists()) {
            requests = snapshot.val();
            if (!requests.includes(menteeUserId)) {
              requests.push(menteeUserId); // Add the mentee's userId if it's not already there
            } else {
              Alert.alert("Request already sent");
              console.log('Request already sent');
              return;
            }
          } else {
            requests = [menteeUserId]; // Create a new array with the mentee's userId
          }
      
          // Update the mentor's requests in Firebase
          await set(mentorRequestsRef, requests);
      
          console.log('Request sent successfully');
        } catch (error) {
          console.error('Error sending request:', error);
        }

        // alert
        Alert.alert("Request sent successfully");
    };
  
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Profile", {
          profileUserID: userID,
        })}
      >
        <View style={styles.cardLayout}>
            <View style={styles.profileItems}>
                <View style={styles.avatar}>
                {user.profileImage ? (
                    <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.addPhotoText}></Text>
                  )}
                </View>
                <CustomText style={styles.profileText} text={user.userName} font="bold" />
            </View>
        
            <TouchableOpacity style={styles.button} onPress={sendRequest}>
                <Ionicons name="send" size={30} color={Colors.lightPurple} />
            </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.lightBlue,
        padding: 20,
        margin: 10,
        borderRadius: 10,
    },
    cardLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileItems: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: 'gray',
        marginRight: 10,
    },
    profileText: {
      textAlign: 'center',
      fontSize: 20,
    },
    button: {
      padding: 10,
      borderRadius: 5,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 100, // Ensure the image is round
    },
    addPhotoText: {
      color: '#a9a9a9', // Placeholder text color
    },
  });
  
  export default MemberCard;