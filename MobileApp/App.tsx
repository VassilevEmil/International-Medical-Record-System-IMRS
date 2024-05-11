import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import MedicalPlanScreen from './screens/MedicalPlanScreen'

import HomeScreen from "./screens/HomeScreen";
import MedicalRecordsScreen from "./screens/MedicalRecordsScreen";
import { Provider } from "react-redux";
import store from "./redux/store";
import { useEffect } from "react";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App() {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = "home";
              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "MedicalRecords") {
                iconName = focused ? "list" : "list";
              } else if (route.name === "MedicalPlan") {
                iconName = focused ? "medkit" : "medkit-outline"; 
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray",
          })}
        >
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
            options={{ tabBarLabel: "MedPlan" }}
          >
            {() => <MedicalPlanScreen patientId={"123"} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}


export default App;
