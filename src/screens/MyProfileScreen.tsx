import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

interface User {
  id: string;
  name: string;
  email: string;
}

const UserProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('userData'); 
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('userToken'); 
            await AsyncStorage.removeItem('userData'); 
            navigation.dispatch(
              StackActions.replace('Login') 
            );
          } catch (error) {
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => alert('Back pressed')}>
            <Text style={styles.backButton}>&lt; Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <Image
              source={require('../../assets/Aladin.jpg')} 
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.greeting}>Hi,</Text>
              <Text style={styles.name}>{user ? user.name : 'Loading...'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuItem}>
          <Text style={styles.menuTitle}>My Ratings</Text>
          <Text style={styles.menuDescription}>Lorem ipsum dolor sit amet, consectetur adipisci</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuTitle}>Help Center</Text>
          <Text style={styles.menuDescription}>Lorem ipsum dolor sit amet, consectetur adipisci</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuTitle}>Customer Service</Text>
          <Text style={styles.menuDescription}>Lorem ipsum dolor sit amet, consectetur adipisci</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191A1F',
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  menuDescription: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#D9534F',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
