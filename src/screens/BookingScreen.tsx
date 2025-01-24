import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Star, ChevronDown } from 'lucide-react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, parse } from 'date-fns';


type RootStackParamList = {
  SeatSelection: {
    movie: Movie;
    cinema: Cinema;
    date: string;
    time: string;
  };
};

type Cinema = {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  seats: string[];
  movies: string[];
  price: number;
};

type Movie = {
  poster: string;
  title: string;
  rating: number;
  genre: string[];
  director: string;
  writer: string[];
  duration: number;
  thumbnailUrl: string;
  runtime: number;
  showtimes: {
    dates: string[];
    times: Record<string, string[]>;
  };
};

type RouteParams = {
  movie: Movie;
};

export default function MovieBookingScreen() {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const movie: Movie = route.params?.movie || {
    poster: '',
    title: 'Default Movie',
    rating: 0,
    genre: ['Unknown'],
    director: 'Unknown',
    writer: ['Unknown'],
    duration: 0,
    thumbnailUrl: '',
    runtime: 0,
    showtimes: {
      dates: [],
      times: {},
    },
  };

  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCinemaList, setShowCinemaList] = useState(false);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await fetch('http://192.168.43.42:5002/api/cinemas');
        const data = await response.json();
        setCinemas(data);
      } catch (error) {
        console.error('Error fetching cinemas:', error);
      }
    };

    fetchCinemas();
  }, []);

  const handleSelectSeat = () => {
    if (selectedCinema && selectedDate && selectedTime) {
      navigation.navigate('SeatSelection', {
        movie,
        cinema: selectedCinema,
        date: selectedDate,
        time: selectedTime,
      });
    } else {
      alert('Please select cinema, date, and time first.');
    }
  };

  const renderHeader = () => (
    <View style={styles.headerImage}>
      <Image source={{ uri: movie.poster }} style={styles.backgroundImage} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.ratingContainer}>
          <Star color="#FFD700" size={16} fill="#FFD700" />
          <Text style={styles.rating}>{`${movie.rating}/10 from IMDb`}</Text>
        </View>
      </View>
    </View>
  );

  const renderCinemaSelector = () => (
    <View style={styles.cinemaContainer}>
      <TouchableOpacity
        style={styles.cinemaSelector}
        onPress={() => setShowCinemaList(!showCinemaList)}
      >
        <Text style={styles.cinemaName}>
          {selectedCinema ? selectedCinema.name : 'Select Cinema'}
        </Text>
        <ChevronDown color="#333" size={20} />
      </TouchableOpacity>

      {showCinemaList && (
        <View style={styles.cinemaDropdown}>
          {cinemas.map((cinema) => (
            <TouchableOpacity
              key={cinema._id}
              style={styles.cinemaOption}
              onPress={() => {
                setSelectedCinema(cinema);
                setShowCinemaList(false);
              }}
            >
              <Text style={styles.cinemaOptionText}>{cinema.name}</Text>
              <Text style={styles.cinemaLocation}>{cinema.location}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedCinema && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>GOLD 2D</Text>
          <Text style={styles.priceValue}>
            Rp {selectedCinema.price.toLocaleString('id-ID')}
          </Text>
        </View>
      )}
    </View>
  );

  const renderShowtimes = () => (
    <View style={styles.showtimeContainer}>
      {selectedDate && movie.showtimes.times[selectedDate] ? (
        movie.showtimes.times[selectedDate].map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.timeButton,
              selectedTime === time && styles.selectedTimeButton,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.timeText,
                selectedTime === time && styles.selectedTimeText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.availabilityText}>
          Tidak ada jadwal tersedia untuk tanggal ini.
        </Text>
      )}
    </View>
  );

  const renderSchedule = () => {
    return (
      <View style={styles.scheduleContainer}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateList}>
            {movie.showtimes && movie.showtimes.dates ? (
              movie.showtimes.dates.map((date, index) => {
                const formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'MMMM dd');
  
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateButton,
                      selectedDate === date && styles.selectedDateButton,
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        selectedDate === date && styles.selectedDateText,
                      ]}
                    >
                      {formattedDate}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text>Tidak ada tanggal yang tersedia.</Text>
            )}
          </View>
        </ScrollView>
        {renderCinemaSelector()}
        {renderShowtimes()}
      </View>
    );  
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scrollView}>
        {renderHeader()}
        {renderSchedule()}
        <TouchableOpacity
          style={styles.selectSeatButton}
          onPress={handleSelectSeat}
        >
          <Text style={styles.selectSeatText}>Select Seat</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  headerImage: {
    height: 410,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  headerContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  availabilityText: {
    
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600'
  },
  scheduleContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateList: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dateButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    minWidth: 60,
  },
  selectedDateButton: {
    backgroundColor: '#D2B48C',
    borderColor: '#D2B48C',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: 'white',
  },
  cinemaContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  cinemaSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
  },
  cinemaDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cinemaOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cinemaOptionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  cinemaLocation: {
    fontSize: 12,
    color: '#666',
  },
  cinemaName: {
    fontSize: 14,
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  showtimeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  timeButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTimeButton: {
    backgroundColor: '#D2B48C',
    borderColor: '#D2B48C',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  selectedTimeText: {
    color: 'white',
  },
  selectSeatButton: {
    margin: 16,
    backgroundColor: '#D2B48C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectSeatText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
