import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screen imports:
import MedicalRecordsScreen from "./screens/MedicalRecordsScreen";

// This will be deleted later on: // It does not belong here
function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MedicalRecords">
        <Stack.Screen
          name="MedicalRecords"
          component={MedicalRecordsScreen}
          options={{ headerShown: true, title: "Medical Records" }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: true, title: "HomeScreen" }}
        />
        {/* Other screens go below */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
