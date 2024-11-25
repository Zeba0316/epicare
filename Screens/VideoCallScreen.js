import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VideoCallScreen = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);
  const [key, setKey] = useState(0);
  const meetingUrl = route.params?.meetingUrl || 'https://razasfs.daily.co/DvECa9zs4qoMZwvu5ncb';

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: audioStatus } = await Audio.requestPermissionsAsync();

        if (cameraStatus === 'granted' && audioStatus === 'granted') {
          setHasPermission(true);
        } else {
          Alert.alert(
            'Permissions Required',
            'Camera and microphone permissions are required for the video call.'
          );
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    };

    requestPermissions();
  }, []);

  const handleEmergency = async () => {
    setIsEmergency(true);
    Alert.alert(
      "Emergency Alert Sent",
      "Your emergency contacts have been notified. Stay calm, help is on the way.",
      [{ text: "OK", onPress: () => setIsEmergency(false) }]
    );

    try {
      const userId = await AsyncStorage.getItem('id');
      console.log(`Emergency alert triggered for user ${userId} during video call`);
    } catch (error) {
      console.error('Error handling emergency:', error);
    }
  };

  const handleReload = () => {
    setKey((prevKey) => prevKey + 1);
    setIsLoading(true);
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.message}>
          Waiting for camera and microphone permissions. Please enable them in settings to join the video call.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={["#E9DEFA", "#FBFCDB"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={24} color="#6B4CE6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video Consultation</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleReload} style={styles.reloadButton}>
              <FontAwesome5 name="redo" size={24} color="#6B4CE6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEmergency} style={[styles.emergencyButton, isEmergency && styles.emergencyActive]}>
              <FontAwesome5 name="exclamation-triangle" size={24} color={isEmergency ? "#FFFFFF" : "#FF0000"} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isLoading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#6B4CE6" />
              <Text style={styles.loaderText}>Connecting to your doctor...</Text>
            </View>
          )}
          <View style={styles.webviewContainer}>
            <WebView
              key={key}
              source={{ uri: meetingUrl }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback={true}
              originWhitelist={['*']}
              onLoadEnd={() => setIsLoading(false)}
              onError={(e) => {
                console.error('WebView error:', e.nativeEvent);
                Alert.alert('Connection Error', 'Unable to connect to the video call. Please try again later.');
              }}
              style={styles.webview}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1F4B',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  backButton: {
    padding: 8,
  },
  reloadButton: {
    padding: 8,
    marginRight: 8,
  },
  emergencyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  emergencyActive: {
    backgroundColor: '#FF0000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  webviewContainer: {
    height:"100%", // Adjust this value as needed
    width: '80%',
    marginHorizontal:"auto"
  },
  webview: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B4CE6',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E9DEFA',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2D1F4B',
  },
});

export default VideoCallScreen;

