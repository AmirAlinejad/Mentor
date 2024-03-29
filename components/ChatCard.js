import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "../styles/Colors";
import CustomText from "./CustomText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { db } from "../backend/FirebaseConfig";
import * as Linking from 'expo-linking';

const ChatCard = ({ navigation, user }) => {
    // state
    const [profileImage, setProfileImage] = React.useState(null);

    React.useEffect(() => {
        const imageRef = ref(db, `users/${user.id}/profileImage`);
        get(imageRef).then((snapshot) => {
            if (snapshot.exists()) {
                const imageUrl = snapshot.val();
                setProfileImage(imageUrl);
            } else {
                console.log("No image URL found.");
            }
        }).catch((error) => {
            console.error("Error fetching profile image:", error);
        });
    }
    , []);

    const sendEmail = async () => {
        Linking.openURL('mailto:' + user.email).catch(error => {
            console.log(error);
        });
    };
  
    return (
      <TouchableOpacity style={styles.card} onPress={sendEmail}>
        <View style={styles.cardLayout}>
            <View style={styles.profileItems}>
                <View style={styles.avatar}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.addPhotoText}></Text>
                  )}
                </View>
                <CustomText style={styles.profileText} text={user.userName} font="bold" />
            </View>
        
            <TouchableOpacity style={styles.button} onPress={sendEmail}>
                <Ionicons name="chatbubble" size={30} color={Colors.lightPurple} />
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
        width: '95%',
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
  
  export default ChatCard;