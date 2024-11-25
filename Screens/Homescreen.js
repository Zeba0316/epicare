import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Circle } from "lucide-react-native";

export default function Homescreen() {
  const isfocused = useIsFocused();
  const [show, setShow] = useState(true);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [mail, setMail] = useState("");
  const [seizureData, setSeizureData] = useState({});
  const navigation = useNavigation();

  const handleMedicationReminder = () => {
    navigation.navigate("medRecords", { id: id });
  };
  const handleLogout = async () => {
    try {
      console.log("logout");
      await AsyncStorage.clear();
      navigation.navigate("signin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const handleDrAppointmentReminder = () => {
    navigation.navigate("DrAppointmentsRecords", { id: id });
  };

  const handleHideBox = () => {
    setShow(false);
  };

  const handleSleep = () => {
    console.log("sleep");
  };

  const handleVideoCall = () => {
    // Navigate to the video call screen or initiate a call
    navigation.navigate("VideoCall");
  };

  useEffect(() => {
    const fetchId = async () => {
      const storedId = await AsyncStorage.getItem("id");
      if (storedId) {
        setId(storedId);
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER}/auth/getInfo/${storedId}`
        );
        const data = await res.json();
        if (res.status == 200) {
          console.log(data);
          setName(data.username);
          setMail(data.email);
          setImage(data.image_url);
        }
      }
    };
    fetchId();
  }, []);

  useEffect(() => {
    const fetchSeizureData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER}/seizure/count/last7days/${id}`
        );
        const data = await response.json();
        setSeizureData(data);
      } catch (error) {
        console.error("Error fetching seizure data:", error);
      }
    };
    if (isfocused && id) {
      fetchSeizureData();
    }
  }, [id, isfocused]);

  const getGradientColors = (count) => {
    if (count === 0) return ["#FFFFFF", "#F0F0F0"];
    if (count === 1) return ["#4CAF50", "#45A049"];
    if (count === 2) return ["#FFA500", "#FF8C00"];
    return ["#FF0000", "#CC0000"];
  };

  const getBarHeight = (count) => {
    const maxHeight = 80;
    const minHeight = 10;
    if (count === 0) return minHeight;
    return Math.min(count * 20 + minHeight, maxHeight);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  const articles = [
    {
      id: 1,
      title: "Understanding Epilepsy",
      url: "https://www.epilepsy.com/what-is-epilepsy",
    },
    {
      id: 2,
      title: "New Treatments for Seizures",
      url: "https://www.who.int/news-room/fact-sheets/detail/epilepsy",
    },
    {
      id: 3,
      title: "Living Well with Epilepsy",
      url: "https://livingwellwithepilepsy.com/",
    },
  ];

  return (
    <LinearGradient
      colors={["#E9DEFA", "#FBFCDB", "#E9DEFA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Home</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={{
                  ...styles.videoCallButton,
                  backgroundColor: "rgba(255, 0,0, 0.7)",
                }}
                onPress={() => navigation.navigate("Alert")}
              >
                <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.videoCallButton}
                onPress={handleVideoCall}
              >
                <Ionicons name="videocam" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("addseizure", { id: id })}
              >
                <LinearGradient
                  colors={["#6B4CE6", "#9D7BEA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonText}>Add Seizure</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 15,
              backgroundColor: "#f8f9fa",
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              marginVertical: 15,
              marginTop: 10,
              borderRadius: 10,
              position: "relative",
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                backgroundColor: "transparent",
                borderRadius: 15,
                padding: 10,
                zIndex: 100,
              }}
              onPress={() => {
                handleLogout();
              }}
            >
              <Ionicons name="log-out-outline" size={36} color="#6B4CE6" />
            </TouchableOpacity>
            {/* Profile Picture */}
            <Image
              source={{ uri: image }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 15,
              }}
            />

            {/* Name and Email Section */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#6B4CE6",
                }}
              >
                {name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#555",
                }}
              >
                {mail}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My notifications</Text>
            {show && (
              <NotificationItem
                icon="bell"
                text="Welcome! You'll find your day notifications here. They're here to help you."
                action="Ok"
                callAction={handleHideBox}
              />
            )}
            <NotificationItem
              icon="medkit"
              text="Stay on Track with Your Medications"
              action="Show"
              callAction={handleMedicationReminder}
            />
            <NotificationItem
              icon="moon"
              text="Hi! How well did you sleep last night?"
              action="Answer"
              callAction={handleSleep}
            />
            <NotificationItem
              icon="calendar-check"
              text="Don't Miss Your Upcoming Appointment"
              action="Go"
              callAction={handleDrAppointmentReminder}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My seizures</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("maintab", { screen: "diary" })
                }
              >
                <Text style={styles.moreGraphs}>Explore Diary</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.graphLegend}>
              <View style={styles.legendItem}>
                <Circle size={12} fill="#FF0000" color="#FF0000" />
                <Text style={styles.legendText}>3 or more seizures</Text>
              </View>
              <View style={styles.legendItem}>
                <Circle size={12} fill="#FFA500" color="#FFA500" />
                <Text style={styles.legendText}>2 seizures</Text>
              </View>
              <View style={styles.legendItem}>
                <Circle size={12} fill="#4CAF50" color="#4CAF50" />
                <Text style={styles.legendText}>1 seizure</Text>
              </View>
            </View>
            <View style={styles.graph}>
              {Object.entries(seizureData)
                .reverse()
                .map(([date, count], index) => (
                  <View key={index} style={styles.graphBar}>
                    <LinearGradient
                      colors={getGradientColors(count)}
                      style={[
                        styles.graphBarFill,
                        { height: getBarHeight(count) },
                      ]}
                    />
                    <Text style={styles.graphBarLabel}>{formatDate(date)}</Text>
                  </View>
                ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Articles</Text>
            {articles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleItem}
                onPress={() => {
                  Linking.openURL(article.url);
                }}
              >
               {article.id === 1 && <Image
                  source={require("../assets/understand.jpg")}
                  style={styles.articleImage}
                />}
               {article.id === 2 && <Image
                  source={require("../assets/treatment.webp")}
                  style={styles.articleImage}
                />}
               {article.id === 3 && <Image
                  source={require("../assets/wellEpi.png")}
                  style={styles.articleImage}
                />}
                <Text style={styles.articleTitle}>{article.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const NotificationItem = ({ icon, text, action, callAction }) => (
  <View style={styles.notificationItem}>
    <FontAwesome5
      name={icon}
      size={20}
      color="#6B4CE6"
      style={styles.notificationIcon}
    />
    <Text style={styles.notificationText}>{text}</Text>
    <TouchableOpacity
      style={styles.notificationAction}
      onPress={() => callAction()}
    >
      <Text style={styles.notificationActionText}>{action}</Text>
    </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D1F4B",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoCallButton: {
    backgroundColor: "#6B4CE6",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  addButtonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D1F4B",
    marginBottom: 10,
  },
  moreGraphs: {
    color: "#6B4CE6",
    fontWeight: "600",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: "#34495E",
  },
  notificationAction: {
    backgroundColor: "rgba(107, 76, 230, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  notificationActionText: {
    color: "#6B4CE6",
    fontWeight: "600",
  },
  graphTabs: {
    flexDirection: "row",
    backgroundColor: "rgba(107, 76, 230, 0.1)",
    borderRadius: 20,
    padding: 5,
    marginBottom: 15,
  },
  graphTab: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 5,
    color: "#6B4CE6",
  },
  activeGraphTab: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
  },
  graph: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 110,
    paddingHorizontal: 10,
    alignItems: "flex-end",
  },
  graphBar: {
    width: 30,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  graphBarFill: {
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  graphBarLabel: {
    marginTop: 5,
    color: "#6B4CE6",
  },
  graphLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginRight: 10,
  },
  legendText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#2D1F4B",
  },
  articleItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: "100%",
    height: 150,
  },
  articleTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#2D1F4B",
  },
});
