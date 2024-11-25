import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDl74GliVPGx3s8ZFfXtvnAPuSl1iAy848");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SeizureDetails = ({ route }) => {
  const navigation = useNavigation();
  const { seizure } = route.params;
  const [aiSummary, setAiSummary] = useState("");
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const animatedHeight = new Animated.Value(0);

  const toggleSummary = async () => {
    setSummaryExpanded(true);
    Animated.timing(animatedHeight, {
      toValue: summaryExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    const prompt = `Seizure Attack info:
    seizure_type: ${seizure.seizure_type}
    duration: ${seizure.duration}mins
    date: ${formatDate(seizure.date)}
    time: ${formatTime(seizure.time)}
    felt_it_coming: ${seizure.felt_it_coming}
    during_sleep: ${seizure.during_sleep}
    triggers: ${seizure.triggers}
    location: ${seizure.location}
    medications: ${seizure.medications}
    Not: ONLY gimme a summary of this to present it to the doctor.
    `;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    setAiSummary(result.response.text());
    if (!aiSummary) {
      setSummaryExpanded(false);
    }
  };

  const sendToDoctor = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/seizure/sendToDoctor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({prompt:aiSummary}),
        }
      );
      if (res.status === 200) {
        Alert.alert("Sent to Doctor", "Email sent successfully!");
      } else {
        Alert.alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const validTime = new Date(timeString);
    return validTime.toLocaleTimeString("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const renderField = (icon, label, value) => {
    if (value === null || value === undefined) return null;
    return (
      <View style={styles.field}>
        <Ionicons name={icon} size={24} color="#6B4CE6" />
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value.toString()}</Text>
      </View>
    );
  };

  const renderList = (icon, label, items) => {
    if (!items || items.length === 0) return null;
    return (
      <View style={styles.listContainer}>
        <Ionicons name={icon} size={24} color="#6B4CE6" />
        <Text style={styles.listLabel}>{label}:</Text>
        {items.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {item}
          </Text>
        ))}
      </View>
    );
  };

  // Check if required fields are present
  if (
    !seizure.date ||
    !seizure.time ||
    !seizure.seizure_type ||
    !seizure.duration ||
    seizure.felt_it_coming === undefined ||
    seizure.during_sleep === undefined
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>
            Error: Missing required seizure data
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={26} color="#6B4CE6" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Seizure Details</Text>
          </View>
          <Text style={styles.dateTime}>
            {formatDate(seizure.date)} at {formatTime(seizure.time)}
          </Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.sectionContent}>
              {renderField("flash", "Type", seizure.seizure_type)}
              {renderField("time", "Duration", `${seizure.duration} minutes`)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Circumstances</Text>
            <View style={styles.sectionContent}>
              {renderField(
                "warning",
                "Felt it Coming",
                seizure.felt_it_coming ? "Yes" : "No"
              )}
              {renderField(
                "bed",
                "During Sleep",
                seizure.during_sleep ? "Yes" : "No"
              )}
              {seizure.location &&
                renderField("location", "Location", seizure.location)}
            </View>
          </View>

          {(seizure.triggers || seizure.medications) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Details</Text>
              <View style={styles.sectionContent}>
                {renderList("alert-circle", "Triggers", seizure.triggers)}
                {renderList("medical", "Medications", seizure.medications)}
              </View>
            </View>
          )}

          {seizure.remarks && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Remarks</Text>
              <View style={styles.sectionContent}>
                {renderField("create", "Notes", seizure.remarks)}
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.summaryButton} onPress={toggleSummary}>
          <Text style={styles.summaryButtonText}>Get AI Summary</Text>
        </TouchableOpacity>
        {aiSummary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>{aiSummary}</Text>
            <TouchableOpacity style={styles.sendButton} onPress={sendToDoctor}>
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Send to Dr</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FE",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B4CE6",
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 16,
    color: "#45B7D1",
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B4CE6",
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: "#F8F9FF",
    borderRadius: 10,
    padding: 15,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
    marginRight: 5,
    minWidth: 100,
  },
  value: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  listContainer: {
    marginBottom: 10,
  },
  listLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 34,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 16,
    color: "#666",
    marginLeft: 34,
    marginBottom: 3,
  },
  summaryButton: {
    backgroundColor: "#6B4CE6",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: "#6B4CE6",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SeizureDetails;
