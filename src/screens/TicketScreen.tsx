import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigation/AppNavigator';

type TicketScreenRouteProp = RouteProp<StackParamList, 'Ticket'>;
type NavigationProps = StackNavigationProp<StackParamList, 'Ticket'>;

const TicketScreen: React.FC = () => {
  const route = useRoute<TicketScreenRouteProp>();
  const navigation = useNavigation<NavigationProps>();

  const {
    movieTitle,
    moviePoster,
    cinemaName,
    date,
    time,
    seats,
    bookingCode,
    totalPrice,
  } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Your Ticket</Text>

      {/* Ticket Card */}
      <View style={styles.card}>
        <Image source={{ uri: moviePoster }} style={styles.poster} />

        {/* Movie Details */}
        <View style={styles.ticketDetails}>
          <Text style={styles.movieTitle}>{movieTitle}</Text>
          <Text style={styles.details}>{cinemaName}</Text>
          <Text style={styles.details}>{`${date}, ${time}`}</Text>
        </View>

        <View style={styles.separator} />

        {/* Booking Information */}
        <View style={styles.ticketInfo}>
          <Text style={styles.infoLabel}>Seats</Text>
          <Text style={styles.infoValue}>{seats.join(', ')}</Text>

          <Text style={styles.infoLabel}>Booking Code</Text>
          <Text style={styles.infoValue}>{bookingCode}</Text>

          <Text style={styles.infoLabel}>Total Price</Text>
          <Text style={styles.infoValue}>
            Rp {totalPrice.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.doneButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  poster: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  ticketDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  details: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  ticketInfo: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  doneButton: {
    backgroundColor: '#D4B996',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicketScreen;
