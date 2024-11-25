import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AppointmentScreen() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [doctorType, setDoctorType] = useState("");
  const [physician, setPhysician] = useState("");

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Notification Permission",
        text2: "Please enable notifications to receive reminders.",
      });
    }
  };

  const scheduleNotification = async () => {
    const appointmentDate = new Date(date);
    appointmentDate.setHours(time.getHours(), time.getMinutes());
    console.log("APPOINTMENT DATE:", appointmentDate);
    const trigger = appointmentDate;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Appointment Reminder",
        body: `You have an appointment with ${physician} (${doctorType})`,
      },
      trigger,
    });
  };

  const handleSave = async () => {
    if (doctorType.trim() === "" || physician.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields",
      });
      return;
    }
    const id = await AsyncStorage.getItem("id");
    try {
      const body = {
        id,
        date: date.toISOString(),
        time: time.toISOString(),
        doctorType,
        name: physician,
      };
      console.log(body);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/drappointments/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (res.status === 200) {
        await scheduleNotification();
        console.log("Appointment saved:", {
          date,
          time,
          doctorType,
          physician,
        });
        Toast.show({
          type: "success",
          text1: "Appointment Scheduled",
          text2: "Your appointment has been saved and a reminder has been set.",
        });
        setDoctorType("");
        setPhysician("");
      }
    } catch (error) {
      console.error("Error scheduling notification:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to schedule appointment reminder",
      });
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
          style={styles.keyboardView}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Add Appointment</Text>
            </View>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="calendar-alt" size={24} color="#6B4CE6" />
              </View>
              <TouchableOpacity style={styles.infoButton}>
                <FontAwesome5 name="info-circle" size={20} color="#6B4CE6" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Appointment</Text>
            <Text style={styles.subtitle}>
              Preparing your appointments is very useful! Add them to the app,
              so that I can help you prepare them!
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.input}>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.input}>
                    {time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Doctor Type</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Neurologist"
                    placeholderTextColor="#999"
                    value={doctorType}
                    onChangeText={setDoctorType}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Doctor Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Doctor's name"
                    placeholderTextColor="#999"
                    value={physician}
                    onChangeText={setPhysician}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <LinearGradient
                colors={["#6B4CE6", "#9D7BEA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              setShowTimePicker(false);
              if (selectedDate) setTime(selectedDate);
            }}
          />
        )}
      </SafeAreaView>
      <Toast />
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D1F4B",
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(107, 76, 230, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoButton: {
    position: "absolute",
    right: 0,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B4CE6",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#2D1F4B",
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    color: "#2D1F4B",
  },
  button: {
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
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
