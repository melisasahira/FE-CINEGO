import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type Page = {
  id: string;
  image: any;
  title: string;
  description: string;
};

const pages: Page[] = [
  {
    id: '1',
    image: require('../../assets/Landing1.png'),
    title: 'Get all your services in one place.',
    description: 'Every service you want, we got it. Just come in and book it!',
  },
  {
    id: '2',
    image: require('../../assets/Landing2.png'),
    title: 'Start now!',
    description: 'Register/log in now to start!',
  },
];

interface LandingScreenProps {
  navigation: {
    navigate: (route: string) => void;
  };
}

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };
  

  const handleSkip = () => {
    navigation.navigate('HomeScreen');
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }: { item: Page; index: number }) => (
    <View style={styles.pageContainer}>
      <Image
        source={item.image}
        style={[
          styles.image,
          index === 0 ? styles.pageOneImage : styles.pageTwoImage,
        ]}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <View style={styles.indicatorContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex === pages.length - 1 ? 'Done' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pageContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  image: {
    resizeMode: 'contain',
    marginBottom: 40,
  },
  pageOneImage: {
    width: 280,
    height: 280,
  },
  pageTwoImage: {
    width: 260,
    height: 260,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 22,
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 64,
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },
  nextText: {
    fontSize: 16,
    color: '#FF6600',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FF6600',
  },
});

export default LandingScreen;
