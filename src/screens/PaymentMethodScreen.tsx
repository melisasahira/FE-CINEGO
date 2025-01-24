import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


type StackParamList = {
  PaymentMethod: {
    userId: string;
    movieId: string;
    cinemaId: string;
    cinemaName: string;
    movieTitle: string;
    moviePoster: string;
    orderNumber: string;
    paymentMethod: string;
    seats: string[];
    date: string;
    time: string;
    ticketPrice: number;
    totalPrice: number;
    totalTickets: number;
    convenienceFee: number;
    token: string;
    paymentSuccess: boolean;
  };
  PaymentReceipt: {
    movieTitle: string;
    moviePoster: string;
    totalPrice: number;
    paymentMethod: string;
    date: string;
    time: string;
    seats: string[];
    orderNumber: string;
  };
};

type PaymentMethodRouteProp = RouteProp<StackParamList, 'PaymentMethod'>;
type NavigationProps = StackNavigationProp<StackParamList, 'PaymentMethod'>;

const PaymentMethodScreen: React.FC = () => {
  const route = useRoute<PaymentMethodRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const [loading, setLoading] = useState(false);

  const {
    userId,
    movieId,
    cinemaId,
    cinemaName,
    movieTitle,
    moviePoster,
    orderNumber,
    paymentMethod,
    seats,
    date,
    time,
    ticketPrice,
    totalPrice,
    totalTickets,
    convenienceFee,
    token,
  } = route.params;

  const validateData = (): boolean => {
    if (!userId || !movieId || !cinemaId || !seats.length || !orderNumber) {
      Alert.alert('Error', 'Missing required data. Please check and try again.');
      return false;
    }
    return true;
  };

  const performBooking = async () => {
    const bookingData = {
      userId,
      movieId,
      cinemaId,
      cinemaName,
      movieTitle,
      moviePoster,
      orderNumber,
      paymentMethod,
      seats,
      date,
      time,
      ticketPrice,
      totalPrice,
      totalTickets,
      convenienceFee,
      status: 'booked',
      paymentSuccess: true,
    };

    const response = await fetch('http://192.168.43.42:5002/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Booking failed');
    }

    return response.json();
  };

  const handleConfirmPayment = async () => {
    if (!validateData()) return;

    setLoading(true);
    try {
      await performBooking();
      Alert.alert('Success', 'Booking successful!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('PaymentReceipt', {
              movieTitle,
              moviePoster,
              totalPrice,
              paymentMethod,
              date,
              time,
              seats,
              orderNumber,

            }),
        },
      ]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Method</Text>

      <View style={styles.paymentDetails}>
        <Text style={styles.detailLabel}>Order Number: {orderNumber}</Text>
        <Text style={styles.detailLabel}>Seats: {seats.join(', ')}</Text>
        <Text style={styles.detailLabel}>Total Price: Rp {totalPrice.toLocaleString('id-ID')}</Text>
        <Text style={styles.detailLabel}>Payment Method: {paymentMethod}</Text>
      </View>

      <View style={styles.qrCodeContainer}>
        <QRCode
          value={`Order Number: ${orderNumber}\nSeats: ${seats.join(', ')}\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`}
          size={200}
        />
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, loading && { backgroundColor: '#ccc' }]}
        onPress={handleConfirmPayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', 
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
    marginTop: 50,
  },
  paymentDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  qrCodeContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: '#D2B48C',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PaymentMethodScreen;
