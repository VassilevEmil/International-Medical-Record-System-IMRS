// Default react imports
import * as React from "react";
import { View, Text } from "react-native";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Icon
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import MedicalRecordsScreen from "./screens/MedicalRecordsScreen";
import HomeScreen from "./screens/HomeScreen";
import MedicalPlanScreen from './screens/MedicalPlanScreen'
// import MedPlanDetailsScreen from './screens/MedPlanDetailsScreen'

// Redux configuration imports
import store from "./redux/store";
import { Provider } from "react-redux";
import { UseSelector } from "react-redux";

const Tab = createBottomTabNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = "home"; // Default icon name

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "MedicalRecords") {
                iconName = focused ? "list" : "list";
              } else if (route.name === "MedicalPlan") {
                iconName = focused ? "medkit" : "medkit-outline"; 
              }
              
              // Return the Ionicons component with the determined icon name
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray",
          })}
        >
          {/* ... START OF THE TAB COMPONENTS ... */}
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarLabel: "Home" }}
          />
          <Tab.Screen
            name="MedicalRecords"
            component={MedicalRecordsScreen}
            options={{ tabBarLabel: "Records" }}
          />
         <Tab.Screen
            name="MedicalPlan"
            component={() => <MedicalPlanScreen patientId={"123"} />}
            options={{ tabBarLabel: "MedPlan" }}
          />
          {/* ... add other tabs/screens as needed ... */}
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
