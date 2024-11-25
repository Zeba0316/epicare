import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Medicinescreen() {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [times, setTimes] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
  };

  const handleSave = async () => {
    const id = await AsyncStorage.getItem("id");
    if (!medicineName || !dosage || !frequency || times.length === 0) {
      Alert.alert("Please fill all the required fields");
      return;
    }
    const body = {
      id,
      name: medicineName,
      dosage,
      frequency,
      specialinstructions: instructions,
      times,
    };
    const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER}/medicine/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log(res.status);
    if (res.status === 200) {
      console.log("Medicine saved:", {
        medicineName,
        dosage,
        frequency,
        instructions,
        times,
      });
      // Schedule notifications
      for (let time of times) {
        console.log(`Scheduling notification for time: ${time}`);
        await scheduleNotification(time);
      }
      setMedicineName("");
      setDosage("");
      setFrequency("");
      setInstructions("");
      setTimes([]);
      Alert.alert("Medicine saved successfully!");
    } else {
      Alert.alert("Something went wrong");
    }
  };

  const scheduleNotification = async (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const trigger = new Date();
    trigger.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (trigger <= new Date()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medicine Reminder",
        body: `Time to take ${medicineName} - ${dosage}mg`,
      },
      trigger,
    });
    console.log(
      `Scheduled notification for ${trigger.toLocaleString()} with ID: ${notificationId}`
    );
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTimes((prevTimes) => {
        const newTimes = [...prevTimes];
        newTimes[currentTimeIndex] = selectedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return newTimes;
      });
    }

    if (currentTimeIndex < parseInt(frequency) - 1) {
      setCurrentTimeIndex((prevIndex) => prevIndex + 1);
      setShowTimePicker(true);
    }
  };

  return (
    <LinearGradient
      colors={["#E9DEFA", "#FBFCDB", "#E9DEFA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Add Medicine</Text>
            </View>

            <View style={styles.iconContainer}>
              <FontAwesome5 name="pills" size={40} color="#6B4CE6" />
            </View>

            <Text style={styles.subtitle}>
              Keep track of your medications to manage your health effectively.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Medicine Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter medicine name"
                value={medicineName}
                onChangeText={setMedicineName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dosage</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 500"
                value={dosage}
                onChangeText={setDosage}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Frequency (times per day)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 2"
                value={frequency}
                onChangeText={(text) => {
                  setFrequency(text);
                  setTimes(new Array(parseInt(text) || 0).fill(""));
                }}
                keyboardType="numeric"
              />
            </View>

            {times.map((time, index) => (
              <View key={index} style={styles.inputContainer}>
                <Text style={styles.label}>Time {index + 1}</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setCurrentTimeIndex(index);
                    setShowTimePicker(true);
                  }}
                >
                  <Text>{time || "Select time"}</Text>
                </TouchableOpacity>
              </View>
            ))}

            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Special Instructions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special instructions"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <LinearGradient
                colors={["#6B4CE6", "#9D7BEA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Save Medicine</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D1F4B",
    marginLeft: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#2D1F4B",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2D1F4B",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 30,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
