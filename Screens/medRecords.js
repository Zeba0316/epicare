import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function MedRecords({ route }) {
  const { id } = route.params;
  const [medicines, setMedicines] = useState([]);
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState(null);
  const animatedHeights = useRef({}).current;

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/medicine/get/${id}`
      );
      const data = await response.json();
      if(response.status != 200) {return;}
      setMedicines(data);

      // Initialize animated values for each card
      data.forEach((medicine) => {
        animatedHeights[medicine.med_id] = new Animated.Value(0);
      });
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const deleteMedicine = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this medicine?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_SERVER}/medicine/delete/${id}`,
            { method: "DELETE" }
          );
          if (res.status == 200) {
            fetchMedicines();
          }
        },
      },
    ]);
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      // Collapse the currently expanded card
      Animated.timing(animatedHeights[id], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedId(null));
    } else {
      // Collapse the previously expanded card
      if (expandedId !== null) {
        Animated.timing(animatedHeights[expandedId], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }

      // Expand the selected card
      setExpandedId(id);
      Animated.timing(animatedHeights[id], {
        toValue: 80, // Height of the expanded content
        duration: 300,
        useNativeDriver: false,
      }).start();
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
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("maintab", { screen: "medicine" })}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Your Health Journey</Text>
        <Text style={styles.headerSubtitle}>Track, Manage, Thrive</Text>
        <ScrollView style={styles.scrollView}>
          {medicines.map((medicine) => (
            <TouchableOpacity
              key={medicine.med_id}
              style={styles.card}
              onPress={() => toggleExpand(medicine.med_id)}
            >
              <LinearGradient
                colors={["#6B4CE6", "#9D7BEA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{medicine.name}</Text>
                  <TouchableOpacity
                    onPress={() => deleteMedicine(medicine.med_id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardDate}>
                  Since {new Date(medicine.create_time).toLocaleDateString()}
                </Text>
                <Text style={styles.cardDate}>
                  {medicine.frequency} times a day
                </Text>
                <Animated.View
                  style={[
                    styles.expandedContent,
                    { height: animatedHeights[medicine.med_id] || 0 },
                  ]}
                >
                  <Text style={styles.cardDate}>
                  {medicine.dosage}mg
                </Text>
                  <Text style={styles.cardDate}>
                  Timings: {medicine.time.map((time, index) => `${time}${index < medicine.time.length - 1 ? ", " : ""}`)}
                </Text>
                <Text style={styles.cardSubtitle}>
                    Notes: {medicine.specialinstructions || "No special instructions"}
                  </Text>
                </Animated.View>
                <Ionicons
                  name={expandedId === medicine.med_id ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="white"
                  style={styles.expandIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          ))}
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
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#6B4CE6",
    borderRadius: 20,
    padding: 10,
  },
  addButton: {
    backgroundColor: "#6B4CE6",
    borderRadius: 20,
    padding: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D1F4B",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#6B4CE6",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    borderRadius: 15,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardDate: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  deleteButton: {
    padding: 5,
  },
  expandedContent: {
    overflow: "hidden",
  },
  expandIcon: {
    alignSelf: "center",
    marginTop: 10,
  },
});
