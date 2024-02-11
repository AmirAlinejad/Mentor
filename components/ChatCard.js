import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../styles/Colors";
import CustomText from "./CustomText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { db } from "../backend/FirebaseConfig";
import * as Linking from 'expo-linking';

const ChatCard = ({ navigation, user }) => {

    const sendEmail = async () => {
        Linking.openURL('mailto:' + user.email).catch(error => {
            console.log(error);
        });
    };
  
    return (
      <View style={styles.card}>
        <View style={styles.cardLayout}>
            <View style={styles.profileItems}>
                <View style={styles.avatar}></View>
                <CustomText style={styles.profileText} text={user.userName} font="bold" />
            </View>
        
            <TouchableOpacity style={styles.button} onPress={sendEmail}>
                <Ionicons name="chatbubble" size={30} color={Colors.lightPurple} />
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
        width: '90%',
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
  
  export default ChatCard;