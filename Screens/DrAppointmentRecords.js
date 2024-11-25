import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";

const DrAppointmentRecords = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/drappointments/get/${id}`,
        {
          method: "GET",
        }
      );
      if (response.status === 200) {
        const result = await response.json();
        setAppointments(result);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    // Log the deleted appointment to the console
    console.log(`Deleted appointment with ID: ${appointmentId}`);

    // Optionally, make a request to delete the appointment from the backend:
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/drappointments/delete/${appointmentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        // Remove the deleted appointment from the state
        setAppointments((prevAppointments) =>
          prevAppointments.filter((item) => item.appointment_id !== appointmentId)
        );
      } else {
        console.error("Failed to delete appointment");
      }
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <TouchableOpacity style={styles.appointmentItem}>
      <LinearGradient
        colors={["#F0F8FF", "#E6E6FA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.appointmentGradient}
      >
        <View style={styles.appointmentHeader}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorType}>{item.doctortype}</Text>
        </View>
        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <FontAwesome5 name="calendar-alt" size={16} color="#6A5ACD" />
            <Text style={styles.detailText}>
              {format(new Date(item.scheduled_date), "MMM dd, yyyy")}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesome5 name="clock" size={16} color="#6A5ACD" />
            <Text style={styles.detailText}>
              {format(new Date(item.scheduled_time), "hh:mm a")}
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={() => handleDelete(item.appointment_id)}
          style={styles.deleteButton}
        >
          <FontAwesome5 name="trash-alt" size={16} color="#FF0000" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchAppointments}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E9DEFA", "#FBFCDB"]} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header with Back and Add Buttons */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#4B0082" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Records</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("maintab", { screen: "appointment" })}
            style={styles.headerButton}
          >
            <FontAwesome5 name="plus" size={20} color="#4B0082" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.appointment_id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No appointments found.</Text>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E9DEFA",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
  },
  headerButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  appointmentItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  appointmentGradient: {
    padding: 16,
  },
  appointmentHeader: {
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
  },
  doctorType: {
    fontSize: 14,
    color: "#6A5ACD",
    marginTop: 4,
  },
  appointmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4B0082",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 50,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    color: "#4B0082",
    textAlign: "center",
  },
});

export default DrAppointmentRecords;
