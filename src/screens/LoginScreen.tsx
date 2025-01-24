import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Navigation = {
  navigate: (screen: string) => void;
};

export default function LoginScreen() {
  const navigation = useNavigation<Navigation>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in both fields.');
      return;
    }
  
    setLoading(true);
  
    try {
      console.log('Attempting login with email:', email);
  
      const response = await fetch('http://192.168.43.42:5002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (response.ok && data.token && data.user) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        navigation.navigate('Main');
      } else {
        throw new Error(data.message || 'Login failed');
      }
      
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Login error:', errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Logo2.png')} style={styles.logo} />
      <Text style={styles.title}>LOGIN</Text>
      <Text style={styles.subtitle}>Welcome Back!</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#BEBEBE" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#BEBEBE" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          placeholderTextColor="#BEBEBE"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#BEBEBE"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'LOADING...' : 'LOGIN'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Don’t Have An Account?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          SIGN UP
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 60,
    backgroundColor: '#F3F3F3',
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#343A4A',
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 5,
    marginTop: 40,
  },
  loginButtonText: {
    color: '#FDE1C7',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  registerLink: {
    color: '#000',
    fontWeight: 'bold',
  },
});
