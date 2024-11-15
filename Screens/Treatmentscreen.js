import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function Treatmentscreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Treatment</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.progressIndicator}>
          <Ionicons name="medical" size={24} color="#8E44AD" />
          <View style={styles.progressLine}>
            <View style={[styles.progressDot, styles.activeDot]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
        </View>
        <Text style={styles.stepTitle}>Info</Text>
        <View style={styles.form}>
          <FormField label="Reason for treatment" value="Epilepsy" />
          <FormField label="Type of treatment" value="Medication" />
          <FormField label="Type of intake" value="Pill" />
          <FormField label="Name of treatment" value="Fusarium Mix - Gibberella fujikuroi and Fusarium solani" />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TreatmentFrequency')}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FormField({ label, value }) {
  return (
    <View style={styles.formField}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <Text style={styles.inputText}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressLine: {
    flexDirection: 'row',
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginLeft: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#8E44AD',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8E44AD',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});