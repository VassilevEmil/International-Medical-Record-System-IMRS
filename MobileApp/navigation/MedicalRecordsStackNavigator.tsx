import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MedicalRecordsScreen from "../screens/MedicalRecordsScreen";
import RecordDetailScreen from "../screens/RecordDetailScreen";
import FileViewScreen from "../screens/FileViewScreen";

const MedicalRecordsStack = createNativeStackNavigator();

const MedicalRecordsStackNavigator = () => {
  return (
    <MedicalRecordsStack.Navigator>
      <MedicalRecordsStack.Screen
        name="MedicalRecordsMain"
        component={MedicalRecordsScreen}
        options={{ headerShown: false }}
      />
      <MedicalRecordsStack.Screen
        name="RecordDetail"
        component={RecordDetailScreen}
        options={{ headerTitle: "Record Details" }}
      />
      <MedicalRecordsStack.Screen
        name="FileView"
        component={FileViewScreen}
        options={{ headerTitle: "File View" }}
      />
    </MedicalRecordsStack.Navigator>
  );
};

export default MedicalRecordsStackNavigator;
