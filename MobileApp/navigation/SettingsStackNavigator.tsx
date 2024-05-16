import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsScreen, ManagePermissionsScreen } from "../screens";

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
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
