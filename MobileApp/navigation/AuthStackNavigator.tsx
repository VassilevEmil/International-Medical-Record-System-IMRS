import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen, RegisterScreen } from "../screens";

const AuthStack = createNativeStackNavigator();

export function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}
