import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen, RegisterScreen } from "../screens";
import { Header } from "react-native/Libraries/NewAppScreen";

const AuthStack = createNativeStackNavigator();

export function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          header: "hide",
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
          header: "hide",
        }}
      />
    </AuthStack.Navigator>
  );
}
