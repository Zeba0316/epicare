import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Signup() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    console.log("started");
    
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedName || !trimmedPassword) {
      Alert.alert("Error", "Please enter All fields.");
      return;
    }
    const form = new FormData();
    form.append("username", trimmedName);
    form.append("email", trimmedEmail);
    form.append("password", trimmedPassword);
    if (image) {
      form.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "image.jpg",
      });
    }
    console.log(form);
    
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SERVER}/auth/signup`,
      {
        method: "POST",
        body: form,
      }
    );
    const result = await response.json();
    console.log(response.status)
    if (response.status === 200) {
      Alert.alert("Success", "User created successfully");
      navigation.navigate("signin");
    } else if (response.status === 400) {
      Alert.alert("Error", "User already exists");
    } else {
      Alert.alert("Error", "Something went wrong");
    }
    console.log("Sign up with:", { name, email, password, image });
  };

  const handleGoogleSignUp = () => {
    // Implement Google sign up logic here
    console.log("Sign up with Google");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#E9DEFA", "#FBFCDB", "#E9DEFA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <Text style={styles.title}>
            Sign up for <Text style={styles.highlightText}>EpiCare</Text>
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            style={styles.imagePickerContainer}
          >
            <View style={styles.imagePlaceholder}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <FontAwesome5 name="user-plus" size={30} color="#6B4CE6" />
              )}
            </View>
            <Text style={styles.imagePickerText}>Add Profile Picture</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <FontAwesome5
              name="user"
              size={20}
              color="#6B4CE6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5
              name="envelope"
              size={20}
              color="#6B4CE6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5
              name="lock"
              size={20}
              color="#6B4CE6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <LinearGradient
              colors={["#6B4CE6", "#9D7BEA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignUp}
          >
            <FontAwesome5 name="google" size={20} color="#6B4CE6" />
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
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
    justifyContent: "center",
  },
  animation: {
    width: width * 0.4,
    height: width * 0.4,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D1F4B",
    marginBottom: 30,
    textAlign: "center",
  },
  highlightText: {
    color: "#6B4CE6",
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePickerText: {
    color: "#6B4CE6",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#2D1F4B",
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 15,
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
  orText: {
    color: "#666",
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    height: 56,
    borderRadius: 12,
    marginBottom: 15,
  },
  googleButtonText: {
    color: "#6B4CE6",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  loginText: {
    color: "#666",
    fontSize: 16,
  },
  loginLink: {
    color: "#6B4CE6",
    fontSize: 16,
    fontWeight: "600",
  },
});
