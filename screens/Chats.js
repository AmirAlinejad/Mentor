import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ref, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../backend/FirebaseConfig';
import Header from '../components/Header';
import ChatCard from '../components/ChatCard';

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRelationships(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    filterUsers(searchQuery);
  }, [users, searchQuery]);

  const fetchUserRelationships = async (userId) => {
    const userRef = ref(db, `users/${userId}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const relationKey = userData.status === 'mentor' ? 'mentees' : 'mentors';
        const relationIds = userData[relationKey] || [];
        
        const relationDetailsPromises = relationIds.map(async (relationId) => {
          const relationRef = ref(db, `users/${relationId}`);
          const relationSnapshot = await get(relationRef);
          if (relationSnapshot.exists()) {
            return { id: relationId, userName: relationSnapshot.val().userName, email: relationSnapshot.val().email };
          }
          return null;
        });

        const relationsDetails = await Promise.all(relationDetailsPromises);
        setUsers(relationsDetails.filter(Boolean));
        setFilteredUsers(relationsDetails.filter(Boolean));
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.error('Error fetching user relationships:', error);
    }
  };

  const filterUsers = (query) => {
    const filtered = users.filter((user) =>
      user.userName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <ChatCard user={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header text="Chats" />
      {/*<TextInput
        style={styles.searchBar}
        placeholder="Search for a user..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />*/}
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBar: {
    fontSize: 18,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-start',
    padding: 10,
  },
  userName: {
    fontSize: 16,
  },
});

export default Chats;
