import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CinemaListScreen() {
  const [cinemas, setCinemas] = useState<{ id: number; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.43.42:5002/api/cinema', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCinemas(data);
      } else {
        console.error('Failed to fetch data:', response);
        alert('Failed to load cinemas. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      alert('Error fetching cinemas. Check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderCinema = ({ item }: { item: { id: number; name: string } }) => (
    <TouchableOpacity style={styles.cinemaItem}>
      <Ionicons name="ticket-outline" size={24} color="#000" style={styles.icon} />
      <Text style={styles.cinemaName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Bioskop"
          placeholderTextColor="#BEBEBE"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={20} color="#000" />
        <Text style={styles.locationText}>Pekanbaru</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : (
        <FlatList
          data={cinemas.filter(cinema =>
            cinema.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCinema}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  cinemaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 1,
    marginHorizontal: 10,
  },
  icon: {
    marginRight: 15,
  },
  cinemaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  loading: {
    marginTop: 20,
  },
});
