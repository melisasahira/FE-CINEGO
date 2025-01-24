import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigation/AppNavigator';

type PaymentReceiptRouteProp = RouteProp<StackParamList, 'PaymentReceipt'>;
type NavigationProp = StackNavigationProp<StackParamList, 'PaymentReceipt'>;

const PaymentReceiptScreen: React.FC = () => {
  const route = useRoute<PaymentReceiptRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const {
    movieTitle,
    moviePoster,
    totalPrice,
    paymentMethod,
    date,
    time,
    seats,
    orderNumber,
    cinemaName,
  } = route.params;

  const handleViewTicket = () => {
    navigation.navigate('Ticket', {
      movieTitle,
      moviePoster,
      cinemaName,
      date,
      time,
      seats,
      bookingCode: orderNumber,
      totalPrice,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Receipt</Text>

      <View style={styles.card}>
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
        </View>

        <Text style={styles.successText}>Payment Success</Text>
        <Text style={styles.description}>
          Your payment for <Text style={styles.boldText}>{movieTitle}</Text> has been successfully completed.
        </Text>

        <Text style={styles.totalPrice}>Rp {totalPrice.toLocaleString('id-ID')}</Text>

        <View style={styles.paymentInfo}>
          <Image source={{ uri: moviePoster }} style={styles.poster} />
          <View style={styles.paymentDetails}>
            <Text style={styles.movieTitle}>{movieTitle}</Text>
            <Text style={styles.paymentDate}>
              {date}, {time}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={handleViewTicket}>
        <Text style={styles.doneButtonText}>View Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    padding: 20,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 150,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  successIcon: {
    backgroundColor: '#E8F5E9',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successIconText: {
    color: '#4CAF50',
    fontSize: 28,
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
  },
  paymentDetails: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
  },
  doneButton: {
    backgroundColor: '#D4B996',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentReceiptScreen;