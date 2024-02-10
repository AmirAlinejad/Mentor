import React from "react";
import { View, Text, Button } from "react-native";

export default function MemberCard() {
    const sendRequest = async (mentorUserId) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
      
        if (!currentUser) {
          console.error('User must be logged in to send requests');
          return;
        }
      
        const menteeUserId = currentUser.uid; // The current user's userId
      
        try {
          // Path to the mentor's requests in Firebase
          const mentorRequestsRef = ref(db, `users/${mentorUserId}/requests`);
      
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
          await update(mentorRequestsRef, requests);
      
          console.log('Request sent successfully');
        } catch (error) {
          console.error('Error sending request:', error);
        }
      };
      

};