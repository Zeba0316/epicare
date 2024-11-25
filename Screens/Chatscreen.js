import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_URL = process.env.EXPO_PUBLIC_SERVER || "http://localhost:3000";

export default function ChatScreen() {
  const isFocused = useIsFocused();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [image_url, setImage_url] = useState("");
  const navigation = useNavigation();
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("id");
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER}/auth/getInfo/${storedUserId}`
        );
        const data = await res.json();

        setUserId(storedUserId);
        setUsername(data.username);
        setImage_url(data.image_url);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();

    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketRef.current.on("message-client", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  const formatDate = (date) => {
    const year = date.getUTCFullYear(); // Get UTC year
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
    const day = String(date.getUTCDate()).padStart(2, "0"); // Day with leading zero
    const hours = String(date.getUTCHours()).padStart(2, "0"); // Hours in UTC with leading zero
    const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Minutes in UTC with leading zero
    const seconds = String(date.getUTCSeconds()).padStart(2, "0"); // Seconds in UTC with leading zero
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0"); // Milliseconds in UTC with leading zero

    // Return formatted UTC string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER}/messages/get`
        );
        if (res.ok) {
          const messages = await res.json();
          setMessages(messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (isFocused) {
      getMessages();
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [isFocused]);

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    const messageData = {
      id: parseInt(userId),
      message: inputMessage.trim(),
      timestamp: new Date(),
    };

    socketRef.current.emit("message-server", messageData);
    const today = new Date();
    const formattedDate = formatDate(today);
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...messageData, timestamp: formattedDate },
    ]);
    setInputMessage("");
  };

  const renderMessage = ({ item }) => {
    return (
      <>
        {
          <View
            style={[
              styles.messageContainer,
              item.id === parseInt(userId)
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Image
              source={{
                uri: item.id === parseInt(userId) ? image_url : item.image_url,
              }}
              style={styles.profileImage}
            />
            <View style={styles.messageContent}>
              <Text
                style={[
                  styles.username,
                  {
                    textAlign: item.id === parseInt(userId) ? "right" : "left",
                  },
                ]}
              >
                {item.id === parseInt(userId) ? "You" : item.username}
              </Text>
              <View
                style={[
                  styles.messageBubble,
                  item.id === parseInt(userId)
                    ? styles.sentBubble
                    : styles.receivedBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.id === parseInt(userId)
                      ? styles.sentMessageText
                      : styles.receivedMessageText,
                  ]}
                >
                  {item.message}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {`${new Date(
                  new Date(item.timestamp).getTime() + 5.5 * 60 * 60 * 1000
                ).getHours()}: ${new Date(
                  new Date(item.timestamp).getTime() + 5.5 * 60 * 60 * 1000
                ).getMinutes()}`}
              </Text>
            </View>
          </View>
        }
      </>
    );
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat Room</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString() + item.timestamp}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#2D1F4B",
  },
  messageList: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  messageContent: {
    flexShrink: 1,
  },
  username: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2D1F4B",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  sentBubble: {
    backgroundColor: "#6B4CE6",
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: "#FFFFFF",
  },
  receivedMessageText: {
    color: "#2D1F4B",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#6B4CE6",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
