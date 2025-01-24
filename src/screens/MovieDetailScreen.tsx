import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  MovieDetail: { movieId: string };
};

type MovieDetailRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;

type Comment = {
  id: string;
  user: string;
  text: string;
  timeAgo: string;
};

type MovieDetail = {
  title: string;
  poster: string;
  synopsis: string;
  release_date: string;
  genres: string;
  runtime: number;
  rating: string;
  trailerCount: number;
  comments: Comment[];
  director: string;
  writer: string;
  showtimes: {
    dates: string[];
    times: { [key: string]: string[] };
  };
};

const MovieDetailScreen = ({ navigation }: any) => {
  const route = useRoute<MovieDetailRouteProp>();
  const movieId = route.params.movieId;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState('Guest');

  useEffect(() => {
    fetchMovieDetail();
    initializeDummyComments();
  }, []);

  const fetchMovieDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.43.42:5002/api/movies/${movieId}`);
      const data = await response.json();
  
      if (response.ok) {
        setMovie({
          title: data.title,
          poster: data.poster,
          synopsis: data.synopsis,
          release_date: new Date(data.releaseDate).toLocaleDateString(),
          genres: data.genre.join(', '),
          runtime: data.duration,
          rating: `${data.rating}`,
          trailerCount: data.trailerCount || 0,
          comments: data.comments || [],
          director: data.director,  
          writer: data.writer,     
          showtimes: {
            dates: data.showtimes.dates,
            times: data.showtimes.times,
            },
        });
      } else {
        throw new Error(data.message || 'Gagal mengambil data film.');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const initializeDummyComments = () => {
    const dummyComments = [
      {
        id: 'c1',
        user: 'JaneDoe',
        text: 'Sangat menyukai film ini, terutama visual yang memukau!',
        timeAgo: '2 jam yang lalu',
      },
      {
        id: 'c2',
        user: 'JohnSmith',
        text: 'Alur ceritanya agak terduga tapi tetap menyenangkan.',
        timeAgo: '1 hari yang lalu',
      },
    ];

    setComments(dummyComments);
  };

  const addComment = () => {
    if (newComment.trim() === '') return;
    const newCommentData = {
      id: `c${Math.random().toString(36).substring(7)}`,
      user: user,
      text: newComment,
      timeAgo: 'Baru saja',
    };

    setComments([...comments, newCommentData]);
    setNewComment('');
  };

  const handleGetTickets = () => {
    navigation.navigate('Booking', { movie });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Gagal memuat detail film.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.posterContainer}>
        <Image source={{ uri: movie.poster }} style={styles.poster} />
        <TouchableOpacity style={styles.playIconContainer}>
          <Text style={styles.playIconText}>▶</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ticketButtonOverlay} onPress={handleGetTickets}>
          <Text style={styles.ticketButtonText}>Get Tickets</Text>
        </TouchableOpacity>
        <LinearGradient
          colors={['transparent', '#1a1a1a']}
          style={styles.gradientOverlay}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.synopsis} numberOfLines={3}>
          {movie.synopsis}
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.genreBadges}>
            {movie.genres.split(', ').map((genre, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{genre}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{movie.rating}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{`${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.commentsSection}>
        <Text style={styles.commentsHeader}>Komentar</Text>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tambahkan komentar..."
            placeholderTextColor="#666"
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Kirim" onPress={addComment} />
        </View>

        {comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {comment.user.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentUser}>{comment.user}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentTime}>{comment.timeAgo}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    textAlign: 'center',
    color: '#ff4444',
    fontSize: 16,
  },
  posterContainer: {
    position: 'relative',
    width: '100%',
    height: 500,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ticketButtonOverlay: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: '#e67e22',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 150,
    marginBottom: 50,
  },
  ticketButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80, 
  },
  infoContainer: {
    padding: 16,
  },
  badgeRow: {
    marginTop: 12,
    marginBottom: 16,
    gap: 8,
  },

  genreBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  infoBadges: {
    flexDirection: 'row',
    gap: 8,
  },

  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  commentsSection: {
    padding: 16,
  },
  commentsHeader: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: '#ccc',
    marginBottom: 4,
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
  },
});

export default MovieDetailScreen;