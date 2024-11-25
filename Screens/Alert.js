import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, FlatList, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SMSComponent() {
  const navigation = useNavigation();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [smsHistory, setSmsHistory] = useState([
    { id: '1', date: '2023-05-15 14:30', status: 'Sent' },
    { id: '2', date: '2023-05-10 09:45', status: 'Failed' },
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');

  useEffect(() => {
    fetchEmergencyContacts();
  }, []);

  const fetchEmergencyContacts = async () => {
    try {
      const userId = await AsyncStorage.getItem('id');
      console.log(userId);
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER}/phone/get/${userId}`);
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setEmergencyContacts(data);
      }
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      Alert.alert("Error", "Failed to fetch emergency contacts. Please try again.");
    }
  };

  const saveEmergencyContact = async () => {
    try {
      if(!newContactName.trim() || !newContactNumber){
        Alert.alert("Error", "Please enter both name and number.");
        return;
      }
      const userId = await AsyncStorage.getItem('id');
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER}/phone/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          name: newContactName,
          number: newContactNumber,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
        setNewContactName('');
        setNewContactNumber('');
        fetchEmergencyContacts();
      } else {
        throw new Error(data.error || "Failed to save contact");
      }
    } catch (error) {
      console.error("Error saving emergency contact:", error);
      Alert.alert("Error", "Failed to save emergency contact. Please try again.");
    }
  };

  const deleteEmergencyContact = async (contactId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER}/phone/delete/${contactId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Contact deleted successfully");
        fetchEmergencyContacts();
      } else {
        throw new Error(data.error || "Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
      Alert.alert("Error", "Failed to delete emergency contact. Please try again.");
    }
  };

  const sendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert("Error", "SMS is not available on this device.");
      return;
    }

    Alert.alert(
      "Confirmation",
      "Are you sure you want to send an emergency SMS?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: async () => {
            try {
              const { result } = await SMS.sendSMSAsync(
                emergencyContacts.map(contact => contact.phone_number.toString()),
                "Emergency: I need immediate assistance. This is an automated message from Epicare."
              );
              if (result === SMS.SentStatus.SENT) {
                setSmsHistory(prev => [{ id: Date.now().toString(), date: new Date().toLocaleString(), status: 'Sent' }, ...prev]);
                Alert.alert("Success", "Emergency SMS sent successfully.");
              } else {
                // throw new Error("Failed to send SMS");
              }
            } catch (error) {
              setSmsHistory(prev => [{ id: Date.now().toString(), date: new Date().toLocaleString(), status: 'Failed' }, ...prev]);
              // Alert.alert("Error", "Failed to send emergency SMS. Please try again.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <FontAwesome5 name="user-circle" size={24} color="#6B4CE6" />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactNumber}>{item.phone_number}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteEmergencyContact(item.contact_id)}
      >
        <MaterialIcons name="delete" size={24} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <MaterialIcons 
        name={item.status === 'Sent' ? "check-circle" : "error"} 
        size={24} 
        color={item.status === 'Sent' ? "#4CAF50" : "#F44336"} 
      />
      <View style={styles.historyInfo}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={styles.historyStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#E9DEFA", "#FBFCDB", "#E9DEFA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#6B4CE6"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Emergency SMS</Text>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send Emergency SMS</Text>
            <TouchableOpacity style={styles.smsButton} onPress={sendSMS}>
              <LinearGradient
                colors={["#6B4CE6", "#9D7BEA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.smsButtonGradient}
              >
                <FontAwesome5
                  name="sms"
                  size={24}
                  color="#FFFFFF"
                  style={styles.smsIcon}
                />
                <Text style={styles.smsButtonText}>Send Emergency SMS</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.infoText}>
              This will send an emergency SMS to all your emergency contacts.
              Use this feature only in case of a genuine emergency.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <View style={styles.addContactForm}>
              <TextInput
                style={styles.input}
                placeholder="Contact Name"
                value={newContactName}
                onChangeText={setNewContactName}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={newContactNumber}
                onChangeText={setNewContactNumber}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.addButton} onPress={saveEmergencyContact}>
                <Text style={styles.addButtonText}>Add Emergency Contact</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={emergencyContacts}
              renderItem={renderContactItem}
              keyExtractor={item => item.contact_id.toString()}
              scrollEnabled={false}
            />
          </View>

          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>SMS History</Text>
            <FlatList
              data={smsHistory}
              renderItem={renderHistoryItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View> */}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D1F4B",
    marginLeft: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D1F4B",
    marginBottom: 15,
  },
  smsButton: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  smsButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  smsIcon: {
    marginRight: 10,
  },
  smsButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D1F4B",
  },
  contactNumber: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: "rgba(107, 76, 230, 0.1)",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#6B4CE6",
    fontSize: 16,
    fontWeight: "600",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyInfo: {
    marginLeft: 15,
  },
  historyDate: {
    fontSize: 14,
    color: "#2D1F4B",
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  addContactForm: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
});

