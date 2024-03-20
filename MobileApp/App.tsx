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

// Redux configuration imports
import configureStore from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const Tab = createBottomTabNavigator();

const { store, persistor } = configureStore();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Home") {
                  iconName = focused ? "home" : "home-outline";
                } else if (route.name === "MedicalRecords") {
                  iconName = focused ? "list" : "list"; // change later, cant find normal one
                }

                // You can return any component that you like here!
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
            {/* ... add other tabs/screens as needed ... */}
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
