import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ref, get, set, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../backend/FirebaseConfig';
import Header from '../components/Header';

const Request = () => {
  const [requestMembers, setRequestMembers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchRequests(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    filterRequests(searchQuery);
  }, [requestMembers, searchQuery]);

  const fetchRequests = async (userId) => {
    const requestsRef = ref(db, `users/${userId}/requests`);
    try {
      const snapshot = await get(requestsRef);
      if (snapshot.exists()) {
        const requestIds = snapshot.val();
        const userDetailsPromises = requestIds.map(async (requestId) => {
          const userRef = ref(db, `users/${requestId}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            return { id: requestId, userName: userSnapshot.val().userName };
          }
          return null;
        });
        const userDetails = await Promise.all(userDetailsPromises);
        setRequestMembers(userDetails.filter(Boolean));
        setFilteredRequests(userDetails.filter(Boolean));
      } else {
        setRequestMembers([]);
        setFilteredRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    // update mentees array
    // get snapshot
    const menteesRef = ref(db, `users/${user.uid}/mentees`);
    const menteesSnapshot = await get(menteesRef);

    // update mentees array
    let menteesArray = menteesSnapshot.val() || [];
    menteesArray.push(requestId);
    await set(menteesRef, menteesArray);

    // update requests array
    // get snapshot
    const requestsRef = ref(db, `users/${user.uid}/requests`);
    const requestsSnapshot = await get(requestsRef);

    // update requests array
    let requestsArray = requestsSnapshot.val() || [];
    requestsArray = requestsArray.filter((id) => id !== requestId);
    await set(requestsRef, requestsArray);

    // Refresh the request list
    fetchRequests(user.uid);
  };

  const handleIgnoreRequest = async (requestId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    // update requests array
    // get snapshot
    const requestsRef = ref(db, `users/${user.uid}/requests`);
    const requestsSnapshot = await get(requestsRef);

    // update requests array
    let requestsArray = requestsSnapshot.val() || [];
    requestsArray = requestsArray.filter((id) => id !== requestId);
    await set(requestsRef, requestsArray);

    // Refresh the request list
    fetchRequests(user.uid);
  };

  const filterRequests = (query) => {
    const filtered = requestMembers.filter((request) =>
      request.userName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRequests(filtered);
  };

  const renderRequests = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.userName}>{item.userName}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleAcceptRequest(item.id)}>
          <MaterialCommunityIcons name="check-circle-outline" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIgnoreRequest(item.id)}>
          <MaterialCommunityIcons name="close-circle-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header text="Requests" />
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a user..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredRequests}
        renderItem={renderRequests}
        keyExtractor={(item) => item.id}
      />
    <View style={styles.container}>
      <Header text="Requests" />
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a user..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredRequests}
        renderItem={renderRequests}
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
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

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
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Request;

