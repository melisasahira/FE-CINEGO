import React, {useEffect} from "react";
import { View, Text, StyleSheet, Image, StatusBar } from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Landing: undefined;
};

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        setTimeout(() => {
        navigation.navigate('Landing');
    }, 1000);
    }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#343A4A" />
      <Image
        source={require('../../assets/Logo1.png')} 
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343A4A', 
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
