import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./screens/HomeScreen";
import MedicalRecordsScreen from "./screens/MedicalRecordsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ManagePermissionsScreen from "./screens/ManagePermissionsScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MedicalPlanScreen from "./screens/MedicalPlanScreen";
import LoadingScreen from "./screens/LoadingScreen";

import { AuthProvider, useAuth } from "./context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function AuthenticatedTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MedicalRecords") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "MedicalPlan") {
            iconName = focused ? "medkit" : "medkit-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
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
        component={MedicalPlanScreen}
        options={{ tabBarLabel: "MedPlan" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{ tabBarLabel: "Settings" }}
      />
    </Tab.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name="ManagePermissions"
        component={ManagePermissionsScreen}
        options={{ title: "Manage Permissions" }}
      />
    </SettingsStack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {token ? <AuthenticatedTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;
