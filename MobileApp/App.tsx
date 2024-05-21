import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingScreen } from "./screens";
import { AuthenticatedTabNavigator } from "./navigation/AuthenticatedTabNavigator";
import { AuthStackNavigator } from "./navigation/AuthStackNavigator";
import NotificationService from "./services/NotificationService";

function AppNavigator() {
  const { token, isLoading } = useAuth();

  // useEffect(() => {
  //   const initializeNotifications = async () => {
  //     await NotificationService.requestPermissions();
  //     NotificationService.configurePushNotifications();
  //   };

  //   initializeNotifications();
  // }, []);

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
