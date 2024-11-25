import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import {  FontAwesome5 } from "@expo/vector-icons";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";


const { width } = Dimensions.get("window");

export default function Welcome() {
  const navigation=useNavigation();
  useEffect(() => {
    console.log("epicare!")
  })
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#E9DEFA", "#FBFCDB", "#E9DEFA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <LottieView
            source={{
              uri: "https://assets8.lottiefiles.com/packages/lf20_xyadoh9h.json",
            }}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>
            Welcome to <Text style={styles.highlightText}>EpiCare</Text>
          </Text>
          <Text style={styles.subtitle}>
            Your personal epilepsy management companion
          </Text>

          <View style={styles.featuresContainer}>
            <FeatureItem icon="calendar-alt" text="Track seizures" />
            <FeatureItem icon="pills" text="Medication reminders" />
            <FeatureItem icon="chart-line" text="View trends" />
          </View>

          <TouchableOpacity style={styles.button}
          onPress={()=>navigation.navigate("signin")}
          >
            <LinearGradient
              colors={["#6B4CE6", "#9D7BEA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.decorations}>
          <View style={[styles.star, styles.starSmall]} />
          <View style={[styles.star, styles.starLarge]} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }) {
  return (
    <View style={styles.featureItem}>
      <FontAwesome5 name={icon} size={24} color="#6B4CE6" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  animation: {
    width: width * 0.5,
    height: width * 0.5,
    alignSelf: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D1F4B",
    marginBottom: 10,
    textAlign: "center",
  },
  highlightText: {
    color: "#6B4CE6",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#34495E",
  },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(107, 76, 230, 0.1)",
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
  decorations: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  star: {
    position: "absolute",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopColor: "#6B4CE6",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },
  starSmall: {
    right: 40,
    bottom: "30%",
    borderWidth: 15,
    opacity: 0.3,
  },
  starLarge: {
    right: 80,
    bottom: "20%",
    borderWidth: 25,
    opacity: 0.2,
  },
});
