import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';


const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.4;
const SPACING = 15;

type Movie = {
  _id: string;
  title: string;
  poster: string;
  rating: string | number;
  releaseDate: string;
  synopsis: string;
  cast: string[];
  director: string;
  writer: string[];
  duration: number;
  genre: string[];
  cinema: {
    _id: string;
    name: string;
    location: string;
    capacity: number;
  };
};

type Cinema = {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  seats: any[];
  movies: string[];
  __v: number;
};

const HomeScreen = ({ navigation }: any) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);

  const SIDE_SPACE = (width - CARD_WIDTH) / 2;

  const fetchMovieWithCinema = async (movieId: string, cinemaId: string): Promise<Movie & Cinema | null> => {
    try {
      const cinemaResponse = await fetch(`http://192.168.43.42:5002/api/cinemas/${cinemaId}`);
      const cinemaData = await cinemaResponse.json();
      const movieResponse = await fetch(`http://192.168.43.42:5002/api/movies/${movieId}`);
      const movieData = await movieResponse.json();
      return { ...movieData, cinema: cinemaData };
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };
  

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://192.168.43.42:5002/api/movies');
      const moviesData = await response.json();
      
      const moviesWithCinema = await Promise.all(
        moviesData.map(async (movie: Movie) => {
          if (typeof movie.cinema === 'string') {
            const completeMovieData = await fetchMovieWithCinema(movie._id, movie.cinema);
            return completeMovieData || movie;
          }
          return movie;
        })
      );
      
      setMovies(moviesWithCinema);
    } catch (error) {
      console.error('Error fetching movies:', error);
      alert('Gagal memuat data film. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchMovies();
  }, []);

  const getCinemaName = (cinema: Movie['cinema']) => {
    if (typeof cinema === 'object' && cinema !== null && cinema.name) {
      return cinema.name;
    }
    return 'Loading...';
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / (CARD_WIDTH + SPACING));
        if (newIndex !== activeMovieIndex) {
          setActiveMovieIndex(newIndex);
        }
      },
      useNativeDriver: true
    }
  );

  const renderMovieCard = ({ item, index }: { item: Movie; index: number }) => {
    const isActive = index === activeMovieIndex;
    const navigateToDetails = () => {
        navigation.navigate('MovieDetail', {
            movieId: item._id 
        });
    };

    return (
        <TouchableOpacity
            onPress={navigateToDetails}
            style={styles.movieCardContainer}
        >
            <Animated.View
                style={[
                    styles.movieCard,
                    isActive ? styles.activeMovieCard : null,
                ]}
            >
                <Image source={{ uri: item.poster }} style={styles.moviePoster} />
                {isActive && (
                    <View style={styles.activeFrame}>
                        <View style={styles.frameCorner} />
                        <View style={[styles.frameCorner, styles.frameTopRight]} />
                        <View style={[styles.frameCorner, styles.frameBottomLeft]} />
                        <View style={[styles.frameCorner, styles.frameBottomRight]} />
                    </View>
                )}
            </Animated.View>

            {isActive && (
                <Animated.View style={styles.activeMovieDetails}>
                    <Text style={styles.activeMovieTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <View style={styles.movieTags}>
                        {item.rating && (
                            <Text style={[styles.movieTag, styles.ratingTag]}>
                                {item.rating}+
                            </Text>
                        )}
                        {item.genre && item.genre.slice(0, 1).map((genre, idx) => (
                            <Text key={idx} style={styles.movieTag}>{genre}</Text>
                        ))}
                        <Text style={[styles.movieTag, styles.imaxTag]}>
                            {getCinemaName(item.cinema)}
                        </Text>
                    </View>
                </Animated.View>
            )}
        </TouchableOpacity>
    );
};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D98639" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Segera Tayang</Text>
        </View>

        <Animated.View style={styles.comingSoonCard}>
          <Image
            source={{ uri: movies[0]?.poster || '' }}
            style={styles.comingSoonImage}
          />
          <TouchableOpacity style={styles.playButton}>
            <View style={styles.playButtonInner}>
              <Ionicons name="play" size={32} color="#fff" />
            </View>
          </TouchableOpacity>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.genreContainer}
        >
          <Text style={styles.genreTagActive}>Aksi</Text>
          <Text style={styles.genreTag}>Komedi</Text>
          <Text style={styles.genreTag}>Romansa</Text>
          <Text style={styles.genreTag}>Thriller</Text>
          <Text style={styles.genreTag}>Fantasi</Text>
        </ScrollView>

        <Text style={styles.sectionTitle}>Sedang Tayang</Text>
        <Animated.FlatList
          horizontal
          data={movies}
          renderItem={renderMovieCard}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_data, index) => ({
            length: CARD_WIDTH + SPACING,
            offset: (CARD_WIDTH + SPACING) * index,
            index,
          })}
          contentContainerStyle={[
            styles.movieList,
            { paddingHorizontal: SIDE_SPACE },
          ]}
          initialNumToRender={4}
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTab: {
    color: '#D98639',
    fontWeight: '600',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationDot: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
    position: 'absolute',
    right: -8,
    top: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 20,
  },
  locationText: {
    color: '#fff',
    marginLeft: 5,
  },
  comingSoonCard: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
  },
  comingSoonImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonInner: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  genreContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    paddingLeft: 4,
  },
  genreTagActive: {
    color: '#fff',
    backgroundColor: '#D98639',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  genreTag: {
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    fontSize: 14,
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    fontWeight: '500',
  },
  movieList: {
    paddingVertical: 10,
  },
  movieCardContainer: {
    alignItems: 'center',
    width: CARD_WIDTH + SPACING,
  },
  movieCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: '#000',
  },
  moviePoster: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
  },
  activeMovieCard: {
    borderColor: '#51546C',
    borderWidth: 2,
  },
  activeFrame: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  frameCorner: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderColor: '#fff',
    borderWidth: 2,
  },
  frameTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  frameBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  frameBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  activeMovieDetails: {
    width: '100%',
    marginTop: 12,
    alignItems: 'center',
  },
  activeMovieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  movieTags: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  movieTag: {
    color: '#fff',
    backgroundColor: '#2A2A2A',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 12,
    overflow: 'hidden',
    fontWeight: '500',
  },
  ratingTag: {
    backgroundColor: '#D98639',
  },
  imaxTag: {
    backgroundColor: '#0077FF',
  },
});

export default HomeScreen; 