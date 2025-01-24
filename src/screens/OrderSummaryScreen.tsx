import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type StackParamList = {
  OrderSummary: {
    moviePoster: string;
    movieTitle: string;
    cinemaName: string;
    date: string;
    time: string;
    seats: string[];
    ticketPrice: number;
    convenienceFee: number;
    paymentMethod: string;
  };
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
    convenienceFee: number;
    totalTickets: number;
    token: string;
    paymentSuccess: boolean;
  };
};

type RouteProps = RouteProp<StackParamList, 'OrderSummary'>;
type NavigationProps = StackNavigationProp<StackParamList, 'OrderSummary'>;

const OrderSummaryScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();

  const {
    moviePoster,
    movieTitle,
    cinemaName,
    date,
    time,
    seats,
    ticketPrice,
    convenienceFee,
    paymentMethod,
  } = route.params;

  const totalTicketPrice = ticketPrice * seats.length; 
  const totalConvenienceFee = convenienceFee * seats.length; 
  const totalPrice = totalTicketPrice + totalConvenienceFee; 

  const handleConfirmPayment = () => {
    navigation.navigate('PaymentMethod', {
      userId: '123',
      movieId: '456',
      cinemaId: '789',
      cinemaName,
      movieTitle,
      moviePoster,
      orderNumber: `ORD${Math.random().toFixed(6).substring(2)}`,
      paymentMethod,
      seats,
      date,
      time,
      ticketPrice,
      totalPrice,
      totalTickets: seats.length,
      convenienceFee,
      token: 'user-token-placeholder',
      paymentSuccess: false,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        <View style={styles.movieDetails}>
          <Image source={{ uri: moviePoster }} style={styles.moviePoster} />
          <View>
            <Text style={styles.movieTitle}>{movieTitle}</Text>
            <Text style={styles.cinemaName}>{cinemaName}</Text>
            <Text style={styles.movieTime}>{`${date}, ${time}`}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Order Details */}
        <Text style={styles.detailLabel}>Seat</Text>
        <Text style={styles.detailValue}>{seats.join(', ')}</Text>

        <Text style={styles.detailLabel}>Payment Method</Text>
        <Text style={styles.detailValue}>{paymentMethod}</Text>

        <Text style={styles.detailLabel}>Regular Seat</Text>
        <Text style={styles.detailValue}>
          {`Rp ${ticketPrice.toLocaleString('id-ID')} x ${seats.length}`}
        </Text>

        <Text style={styles.detailLabel}>Convenience Fee</Text>
        <Text style={styles.detailValue}>
          {`Rp ${convenienceFee.toLocaleString('id-ID')} x ${seats.length}`}
        </Text>

        <View style={styles.divider} />

        {/* Total Price */}
        <Text style={styles.totalLabel}>Actual Pay</Text>
        <Text style={styles.totalValue}>
          {`Rp ${totalPrice.toLocaleString('id-ID')}`}
        </Text>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.button} onPress={handleConfirmPayment}>
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 20,
    marginTop: 80,
  },
  movieDetails: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  moviePoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cinemaName: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  movieTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#D4B996',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderSummaryScreen;
