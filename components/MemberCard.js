import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
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
    };
  
    return (
      <View style={styles.card}>
        <View style={styles.cardLayout}>
            <View style={styles.profileItems}>
                <View style={styles.avatar}></View>
                <CustomText style={styles.profileText} text={user.userName} font="bold" />
            </View>
        
            <TouchableOpacity style={styles.button} onPress={sendRequest}>
                <Ionicons name="send" size={30} color={Colors.lightPurple} />
            </TouchableOpacity>
        </View>
      </View>
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
  });
  
  export default MemberCard;