import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LandingScreen from '../screens/LandingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import UserProfileScreen from '../screens/MyProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import CinemaListScreen from '../screens/CinemaListScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import SeatSelectionScreen from '../screens/MovieSeatSelection';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import PaymentReceiptScreen from '../screens/PaymentReceiptScreen';
import TicketScreen from '../screens/TicketScreen';
import BottomNavigator from './BottomNavigator';
import MovieListScreen from '../screens/MovieListScreen';

export type StackParamList = {
  Splash: undefined;
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Profile: undefined;
  Home: undefined;
  MovieDetail: undefined;
  CinemaList: undefined;
  Booking: undefined;
  SeatSelection: undefined;
  OrderSummary: undefined;
  MovieList: undefined;
  PaymentReceipt: {
    movieTitle: string;
    moviePoster: string;
    totalPrice: number;
    paymentMethod: string;
    date: string;
    time: string;
    seats: string[];
    orderNumber: string;
    cinemaName: string; // Ditambahkan untuk PaymentReceipt
  };
  Ticket: {
    movieTitle: string;
    moviePoster: string;
    cinemaName: string; // Ditambahkan untuk TicketScreen
    date: string;
    time: string;
    seats: string[];
    bookingCode: string;
    totalPrice: number;
  };
  PaymentMethod: {
    moviePoster: string;
    movieTitle: string;
    cinemaName: string;
    showDate: string;
    orderNumber: string;
    seats: string[];
    totalPrice: number;
    paymentMethod: string;
    ticketPrice: number;
    convenienceFee: number;
    totalTickets: number;
  };
  TicketHistory: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Profile" component={UserProfileScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen name="CinemaList" component={CinemaListScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="PaymentReceipt" component={PaymentReceiptScreen} />
      <Stack.Screen name="Ticket" component={TicketScreen} />
      <Stack.Screen name="Main" component={BottomNavigator} />
      <Stack.Screen name="MovieList" component={MovieListScreen} />

    </Stack.Navigator>
  );
}
