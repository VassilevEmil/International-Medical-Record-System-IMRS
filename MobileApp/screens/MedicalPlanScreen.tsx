import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import GetDrugsService from "../services/GetDrugRecordsService";
// import { useNavigation } from "@react-navigation/native";

const MedicalPlanScreen = ({ patientId }: { patientId: string }) => {
 
  const [drugRecords, setDrugRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const navigation = useNavigation();

  
  useEffect(() => {
    const fetchDrugRecords = async () => {
      setIsLoading(true);
      try {
        const response = await GetDrugsService.fetchDrugRecordsByPatientId(
          "123",
          1,
          10
        );
        if (response.success && response.data) {
          console.log("nigaaaaaaaaaaaaaa", response.data);
          
          setDrugRecords(response.data);
          setIsLoading(false);
        } else {
          setError(response.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setError("An error occurred while fetching records");
        setIsLoading(false);
      }
    };
    fetchDrugRecords();
  }, [patientId]);

  // will do lateer
  // Function to handle press on a record
  // const handleRecordPress = (record) => {
  //   navigation.navigate("RecordDetails", { record }); 
  // };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : drugRecords.length === 0 ? (
        <Text>No drug records available</Text>
      ) : (
        drugRecords.map((record, index) => (
         // <TouchableOpacity key={index} onPress={() => handleRecordPress(record)}>
            <View style={styles.recordItem}>
              <Text style={styles.recordTitle}>{record.nameOfDrug}</Text>
              <Text style={styles.recordSubtitle}>
                Start Date: {record.startTreatmentDate}
              </Text>
              <Text style={styles.recordSubtitle}>
                Duration: {record.duration} {record.durationType}
              </Text>
              <Text style={styles.recordSubtitle}>Comment: {record.comment}</Text>
            </View>
         // </TouchableOpacity>
        ))
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  recordItem: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 10,
    margin: 10,
    elevation: 1,
  },
  recordTitle: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  recordSubtitle: {
    fontSize: 16,
    color: "#838383",
    marginBottom: 5,
  },
});
export default MedicalPlanScreen;
