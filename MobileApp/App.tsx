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
import SettingsScreen from "./screens/SettingsScreen";
import ManagePermissionsScreen from "./screens/ManagePermissionsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

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
            component={() => <MedicalPlanScreen patientId={"123"} />}
            options={{ tabBarLabel: "MedPlan" }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsStackNavigator}
            options={{ tabBarLabel: "Settings" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
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
        options={{ title: 'Manage Permissions' }}
      />
    </SettingsStack.Navigator>
  );
}

// no need for this for now, wont remove it for now

// function MedicalPlanStack() {
//   const patientId = "123"; 
//   return (
//     <Stack.Navigator>
     
//       <Stack.Screen
//         name="MedPlanDetailsScreen"
//         component={MedPlanDetailsScreen}
//       />
//        <Stack.Screen
//         name="MedicalPlan11"
//         component={() => <MedicalPlanScreen patientId={patientId} />} 
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// }
export default App;
