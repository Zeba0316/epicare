import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Profilescreen() {
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [neurologist, setNeurologist] = useState('');
  const [hospital, setHospital] = useState('');
  const [address, setAddress] = useState('');
  const [seizureFrequency, setSeizureFrequency] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');

  const handleUpdate = () => {
    // Implement update logic here
    console.log('Profile updated');
  };

  const handleRemoveAccount = () => {
    // Implement account removal logic here
    console.log('Account removed');
  };

  return (
      <LinearGradient
        colors={['#E9DEFA', '#FBFCDB', '#E9DEFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity>
              <FontAwesome5 name="arrow-left" size={24} color="#6B4CE6" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <InputField label="Birthday" value={birthday} onChangeText={setBirthday} placeholder="dd-MM-yyyy" />
          <InputField label="Gender" value={gender} onChangeText={setGender} placeholder="Select Your Gender" />
          <InputField label="Name of your neurologist" value={neurologist} onChangeText={setNeurologist} placeholder="Dr Aditi" />
          <InputField label="Your hospital" value={hospital} onChangeText={setHospital} />
          <InputField label="Address" value={address} onChangeText={setAddress} multiline />
          <InputField label="Seizure frequency" value={seizureFrequency} onChangeText={setSeizureFrequency} placeholder="More Than 1 Per Month" />
          <InputField label="Country (*)" value={country} onChangeText={setCountry} />

          <Text style={styles.sectionTitle}>Optional information</Text>
          <InputField label="Phone" value={phone} onChangeText={setPhone} placeholder="-" />

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <LinearGradient
              colors={['#6B4CE6', '#9D7BEA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Update</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRemoveAccount}>
            <Text style={styles.removeAccount}>Remove account</Text>
          </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
      </LinearGradient>
  );
}

const InputField = ({ label, value, onChangeText, placeholder, multiline = false }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D1F4B',
    marginLeft: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2D1F4B',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D1F4B',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D1F4B',
    marginTop: 20,
    marginBottom: 10,
  },
  updateButton: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
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
  removeAccount: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});