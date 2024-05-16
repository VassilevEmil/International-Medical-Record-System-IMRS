import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeScreen,
  MedicalRecordsScreen,
  MedicalPlanScreen,
} from "../screens";
import SettingsStackNavigator from "./SettingsStackNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import { tabBarOptions } from "../styles/styles";
import { RouteProp } from "@react-navigation/native";

type TabBarIconProps = {
  route: RouteProp<Record<string, object | undefined>, string>;
  focused: boolean;
};

const Tab = createBottomTabNavigator();

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused }) => {
  const icons = {
    Home: "home",
    MedicalRecords: "list",
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

export const AuthenticatedTabNavigator: React.FC = () => {
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
};
