import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Implement sign in logic here
    console.log('Sign in with:', email, password);
  };

  const handleGoogleSignIn = () => {
    // Implement Google sign in logic here
    console.log('Sign in with Google');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#E9DEFA', '#FBFCDB', '#E9DEFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <LottieView
            source={{
              uri: 'https://lottie.host/cafbb392-0f9b-4a49-b251-0552efa7e17e/uJ55ujati0.json',
            }}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>
            Sign in to <Text style={styles.highlightText}>EpiCare</Text>
          </Text>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="envelope" size={20} color="#6B4CE6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#6B4CE6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <LinearGradient
              colors={['#6B4CE6', '#9D7BEA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <FontAwesome5 name="google" size={20} color="#6B4CE6" />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  animation: {
    width: width * 0.4,
    height: width * 0.4,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D1F4B',
    marginBottom: 30,
    textAlign: 'center',
  },
  highlightText: {
    color: '#6B4CE6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#2D1F4B',
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 15,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 56,
    borderRadius: 12,
    marginBottom: 15,
  },
  googleButtonText: {
    color: '#6B4CE6',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  forgotPassword: {
    color: '#6B4CE6',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});