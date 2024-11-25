import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Welcome from "../Screens/Welcome";
import Signin from "../Screens/Signin";
import Signup from "../Screens/Signup";
import Homescreen from "../Screens/Homescreen";
import Appointmentscreen from "../Screens/Appointmentscreen";
import Medicinescreen from "../Screens/Medicinescreen";
import Moodscreen from "../Screens/Moodscreen";
import Profilescreen from "../Screens/Profilescreen";
import Diaryscreen from "../Screens/Diaryscreen";
import SigninDr from "../Screens/SigninDr";
import AddSeizure from "../Screens/AddSeizure";
import medRecords from "../Screens/medRecords";
import DrAppointmentRecords from "../Screens/DrAppointmentRecords";
import SeizureDetails from "../Screens/SeizureDetails";
import VideoCallScreen from "../Screens/VideoCallScreen";
import Alert from "../Screens/Alert";
import ChatScreen from "../Screens/Chatscreen";
const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="welcome">
          <Stack.Screen
            name="VideoCall"
            component={VideoCallScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="maintab"
            component={TabNavigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signin"
            component={Signin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="mood"
            component={Moodscreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signindr"
            component={SigninDr}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="addseizure"
            component={AddSeizure}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="medRecords"
            component={medRecords}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DrAppointmentsRecords"
            component={DrAppointmentRecords}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SeizureDetails"
            component={SeizureDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Alert"
            component={Alert}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 60,
          alignItems: "center",
          paddingTop: 10,
          position: "relative",
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={Homescreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: 60,
                height: 50,
              }}
            >
              <FontAwesome5
                name="home"
                size={20}
                color={focused ? "#6B4CE6" : "#BDBDBD"}
              />
              <Text
                style={{ fontSize: 12, color: focused ? "#6B4CE6" : "#BDBDBD" }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="appointment"
        component={Appointmentscreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: 60,
                height: 50,
              }}
            >
              <FontAwesome5
                name="calendar-check"
                size={20}
                color={focused ? "#6B4CE6" : "#BDBDBD"}
              />
              <Text
                style={{ fontSize: 12, color: focused ? "#6B4CE6" : "#BDBDBD" }}
              >
                Schedule
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="diary"
        component={Diaryscreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: 60,
                height: 50,
              }}
            >
              <FontAwesome5
                name="book"
                size={20}
                color={focused ? "#6B4CE6" : "#BDBDBD"}
              />
              <Text
                style={{ fontSize: 12, color: focused ? "#6B4CE6" : "#BDBDBD" }}
              >
                Diary
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="medicine"
        component={Medicinescreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: 60,
                height: 50,
              }}
            >
              <FontAwesome5
                name="prescription-bottle-alt"
                size={20}
                color={focused ? "#6B4CE6" : "#BDBDBD"}
              />
              <Text
                style={{ fontSize: 12, color: focused ? "#6B4CE6" : "#BDBDBD" }}
              >
                Treatment
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: 60,
                height: 50,
              }}
            >
              <Ionicons
                name="chatbox"
                size={20}
                color={focused ? "#6B4CE6" : "#BDBDBD"}
              />
              <Text
                style={{ fontSize: 12, color: focused ? "#6B4CE6" : "#BDBDBD" }}
              >
                ChatRoom
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
