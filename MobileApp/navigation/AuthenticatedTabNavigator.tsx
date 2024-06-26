import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen, MedicalPlanScreen } from "../screens";
import SettingsStackNavigator from "./SettingsStackNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import { tabBarOptions } from "../styles/styles";
import MedicalRecordsStackNavigator from "./MedicalRecordsStackNavigator";

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ route, focused }) => {
  const icons = {
    Home: "home",
    MedicalRecordsStack: "list",
    MedicalPlan: "medkit",
    Settings: "settings",
  };
  const iconName = focused
    ? `${icons[route.name]}`
    : `${icons[route.name]}-outline`;
  return (
    <Ionicons
      name={iconName}
      size={30}
      color={
        focused
          ? tabBarOptions.activeTintColor
          : tabBarOptions.inactiveTintColor
      }
    />
  );
};

export const AuthenticatedTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabBarIcon route={route} focused={focused} />
        ),
        tabBarActiveTintColor: tabBarOptions.activeTintColor,
        tabBarInactiveTintColor: tabBarOptions.inactiveTintColor,
        tabBarStyle: tabBarOptions.style,
        tabBarLabelStyle: tabBarOptions.labelStyle,
        tabBarIconStyle: tabBarOptions.iconStyle,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="MedicalRecordsStack"
        component={MedicalRecordsStackNavigator}
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
};
