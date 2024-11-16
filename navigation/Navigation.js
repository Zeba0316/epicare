import { View} from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Welcome from "../Screens/Welcome";
import Test from "../Screens/Test";
import Signin from "../Screens/Signin";
import Signup from "../Screens/Signup";
import Homescreen from "../Screens/Homescreen";
const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="signup">
          <Stack.Screen name="welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="test" component={Test} options={{ headerShown: false }} />
          <Stack.Screen name="signin" component={Signin} options={{ headerShown: false }} />
          <Stack.Screen name="signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="home" component={Homescreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigation;
