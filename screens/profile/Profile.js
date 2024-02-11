import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { db } from '../../backend/FirebaseConfig'; // Adjust based on your project structure
import { getAuth } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Header from '../../components/Header';
import CustomText from '../../components/CustomText';
import { Colors } from '../../styles/Colors';
import { getUserData, getUserID } from '../../functions/functions';

const Profile = ({ route, navigation }) => {
  let profileUserID = getUserID();

  if (route) {
    profileUserID = route.params.profileUserID;
  }

  const [profileImage, setProfileImage] = useState("");
  const [profileUserData, setProfileUserData] = useState({});

  const auth = getAuth();
  const storage = getStorage(); // Ensure Firebase Storage is initialized

  useEffect(() => {
    console.log("Profile user ID:", profileUserID);
    getUserData(profileUserID, setProfileUserData);

    const currentUser = auth.currentUser;
    if (currentUser) {
      const imageRef = ref(db, `users/${currentUser.uid}/profileImage`);
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

  }, []);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const selectedImageUri = pickerResult.assets[0].uri;
      const currentUser = auth.currentUser;
      if (currentUser) {
        const fileName = `profile_${currentUser.uid}_${Date.now()}`;
        const imageRef = storageRef(storage, `profile_images/${fileName}`);
        try {
          const response = await fetch(selectedImageUri);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);
          const downloadURL = await getDownloadURL(imageRef);
          saveProfileImageToDatabase(downloadURL);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Error uploading image.");
        }
      }
    }
  };

  const saveProfileImageToDatabase = (imageUrl) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const imageRef = ref(db, `users/${currentUser.uid}/profileImage`);
      set(imageRef, imageUrl).then(() => {
        console.log('Profile image updated successfully!');
        setProfileImage(imageUrl);
      }).catch((error) => {
        console.error('Error updating profile image:', error);
      });
    } else {
      console.error('User not authenticated');
    }
  };

  const profileImg = () => (
    <View style={[styles.avatar, { backgroundColor: profileUserData.profileImage ? 'transparent' : '#f0f0f0' }]}>
      {profileUserData.profileImage ? (
        <Image source={{ uri: profileUserData.profileImage }} style={styles.avatarImage} />
      ) : (
        <Text style={styles.addPhotoText}></Text>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <Header navigation={navigation} text="Profile" back={profileUserID != getUserID()} />
      <View style={styles.profileData}>
        {profileUserID === getUserID() ? (
          <TouchableOpacity onPress={handleImageUpload}>
            {profileImg()}
          </TouchableOpacity>) : (
            <View>
              {profileImg()}
            </View>
          )
        }
        <View style={styles.infoContainer}>
        {profileUserData && 
          <View>
            <CustomText style={styles.userName} text={profileUserData.userName} font="bold" />
            <CustomText style={styles.description} text={profileUserData.aboutYou} />
            <View style={{flexDirection: 'row', gap: 20, justifyContent: 'center'}}>
            {profileUserData.interests && profileUserData.interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <CustomText key={index} style={styles.interest} text={interest} />
              </View>
            ))}
            </View>
          </View>
        }
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  profileData: {
    marginTop: 50,
    alignItems: 'center',
  },
  avatar: {
    width:200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0', // Placeholder background color
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100, // Ensure the image is round
  },
  addPhotoText: {
    color: '#a9a9a9', // Placeholder text color
  },
  infoContainer: {
    marginTop: 20,
  },
  userName: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16, // Adjusted for readability
    marginBottom: 10,
  },
  interest: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14, // Adjusted for consistency
  },
  interestChip: {
    backgroundColor: Colors.lightPurple,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  });
    
    export default Profile;

