import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type StackParamList = {
  SeatSelection: {
    movie: Movie;
    cinema: Cinema;
    date: string;
    time: string;
  };
  OrderSummary: {
    moviePoster: string;
    movieTitle: string;
    cinemaName: string;
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
    paymentMethod: string;
    ticketPrice: number;
    convenienceFee: number;
    totalTickets: number;
    paymentSuccess: boolean;
  };
};

type Movie = {
  poster: string;
  title: string;
};

type Cinema = {
  _id: string;
  name: string;
  price: number;
};

type SeatSelectionScreenNavigationProp = StackNavigationProp<StackParamList, 'SeatSelection'>;

const SeatSelectionScreen: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const route = useRoute<RouteProp<StackParamList, 'SeatSelection'>>();
  const navigation = useNavigation<SeatSelectionScreenNavigationProp>();

  const { movie, cinema, date, time } = route.params;

  if (!movie || !cinema) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Movie or Cinema data not available</Text>
      </View>
    );
  }

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatId) ? prevSeats.filter((id) => id !== seatId) : [...prevSeats, seatId]
    );
  };

  const handlePayNow = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Error', 'Please select at least one seat.');
      return;
    }

    const totalPrice = selectedSeats.length * cinema.price + 5000; 

    navigation.navigate('OrderSummary', {
      moviePoster: movie.poster,
      movieTitle: movie.title,
      cinemaName: cinema.name,
      date,
      time,
      seats: selectedSeats,
      totalPrice,
      ticketPrice: cinema.price,
      convenienceFee: 5000,
      totalTickets: selectedSeats.length,
      paymentMethod: 'Credit Card',
      paymentSuccess: false,
    });
  };

  const generateSeats = (rows: string[], columns: number[]) =>
    rows.map((row) => (
      <View key={row} style={styles.row}>
        {columns.map((col) => {
          const seatId = `${row}${col}`;
          const isUnavailable = ['D9', 'D10', 'H9', 'H10', 'G7', 'G8'].includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          return (
            <TouchableOpacity
              key={seatId}
              style={[
                styles.seat,
                isSelected && !isUnavailable ? styles.selected : null,
                isUnavailable ? styles.unavailable : null,
              ]}
              onPress={() => handleSeatSelect(seatId)}
              disabled={isUnavailable}
            >
              <Text style={styles.seatText}>{seatId}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Seat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.screen}>
          <Text style={styles.screenText}>Cinema Screen</Text>
        </View>

        <View style={styles.seatsContainer}>
          <View style={styles.legend}>
            {[
              { label: 'Available', style: styles.available },
              { label: 'Unavailable', style: styles.unavailable },
              { label: 'Selected', style: styles.selected },
            ].map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendBox, item.style]} />
                <Text>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.seatsGrid}>
            {generateSeats(['H', 'G', 'F', 'E', 'D', 'C'], Array.from({ length: 9 }, (_, i) => i + 1))}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.location}>
            <Icon name="location-outline" size={20} color="#666" />
            <Text style={styles.locationText}>{cinema.name}</Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Seats</Text>
              <Text style={styles.detailValue}>{selectedSeats.join(', ') || '-'}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.totalPrice}>Total Price</Text>
            <Text style={styles.price}>Rp {(selectedSeats.length * cinema.price).toLocaleString('id-ID')}</Text>
          </View>

          <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
            <Text style={styles.payButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  screen: {
    backgroundColor: '#D4B996',
    padding: 12,
    borderRadius: 8,
    marginBottom: 32,
  },
  screenText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  seatsContainer: {
    marginBottom: 24,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  available: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  unavailable: {
    backgroundColor: '#ccc',
    borderColor: '#bbb',
  },
  selected: {
    backgroundColor: '#D4B996',
    borderColor: '#D4B996',
  },
  seatsGrid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  seat: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  seatText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    marginTop: 24,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 8,
    color: '#666',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: '#666',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  detailValue: {
    fontWeight: '600',
  },
  priceContainer: {
    marginBottom: 16,
  },
  totalPrice: {
    color: '#666',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#D4B996',
  },
  payButton: {
    backgroundColor: '#D4B996',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});


export default SeatSelectionScreen;
