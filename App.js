import { View, Platform, UIManager} from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigation/Navigation";
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const App = () => {
  return (
    <SafeAreaProvider >
    <View style={{ flex: 1 }}>
      <Navigation />
    </View>
    </SafeAreaProvider>
  );
};

export default App;
