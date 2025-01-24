import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

type Movie = {
  id: string;
  title: string;
  director: string;
  writer: string;
  duration: number;
  rating: string;
  poster: string;
  price: number;
};

const MovieListScreen = ({ navigation }: any) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://192.168.43.42:5002/api/movies"); 
      const data = await response.json();

      if (response.ok) {
        setMovies(data); 
      } else {
        throw new Error("Gagal mengambil data film.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.card}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title.toUpperCase()}</Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Director: </Text>
          {item.director}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Writer: </Text>
          {item.writer}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Duration: </Text>
          {item.duration} minute(s)
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Rating: </Text>
          {item.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      renderItem={renderMovieItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a", 
  },
  listContainer: {
    padding: 16,
    backgroundColor: "#fff", 
    marginTop: 60,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#292929", 
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    padding: 12,
  },
  poster: {
    width: 90,
    height: 120,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: "#C7C7CC",
    marginBottom: 4,
  },
  label: {
    color: "#AAAAAA",
    fontWeight: "bold",
  },
});

export default MovieListScreen;
