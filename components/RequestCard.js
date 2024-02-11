import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../styles/Colors";
import CustomText from "./CustomText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { db } from "../backend/FirebaseConfig";
import * as Linking from 'expo-linking';

const RequestCard = ({ navigation, user, ignore, accept }) => {

    const sendEmail = async () => {
        Linking.openURL('mailto:' + user.email).catch(error => {
            console.log(error);
        });
    };
  
    return (
      <TouchableOpacity style={styles.card}
         onPress={() => navigation.navigate("Profile", {
          profileUserID: user.userID,
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
        
            <View style={styles.actions}>
                <TouchableOpacity onPress={accept}>
                    <Ionicons name="checkmark-circle" size={40} color={Colors.green} />
                </TouchableOpacity>
                <TouchableOpacity onPress={ignore}>
                    <Ionicons name="close-circle" size={40} color={Colors.red} />
                </TouchableOpacity>
            </View>
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
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    addPhotoText: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
    },
  });
  
  export default RequestCard;