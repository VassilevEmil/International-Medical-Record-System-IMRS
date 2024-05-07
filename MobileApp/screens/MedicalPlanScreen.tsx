import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Button } from "react-native";
import GetDrugsService from "../services/GetDrugRecordsService";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
// import { Ionicons } from "react-native-vector-icons/Ionicon";


const MedicalPlanScreen = ({ patientId }: { patientId: string }) => {
 
  const [drugRecords, setDrugRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRecordIndex, setExpandedRecordIndex] = useState<number | null>(
    null);
  const navigation = useNavigation();

  
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
          console.log("nigaaaaaaaaaaaaa", response.data);
          
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

  // will do lateer - actually might not need it 
  //  // Function to handle press on a record
  //  const handleRecordPress = (record) => {
  //   navigation.navigate("MedPlanDetailsScreen", { record: record }); 
  // };
  
  const toggleRecordExpansion = (index: number) => {
    setExpandedRecordIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  return (
    <View style={styles.container}>
      {drugRecords.map((record, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          onPress={() => toggleRecordExpansion(index)}
        >
          <View style={styles.recordItem}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordTitle}>{record.nameOfDrug}</Text>
              <TouchableOpacity onPress={() => toggleRecordExpansion(index)}>
                <Icon
                  name={
                    expandedRecordIndex === index
                      ? "caret-down-outline"
                      : "caret-forward-outline"
                  }
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            {expandedRecordIndex === index && (
              <View style={styles.expandedContent}>
                <Text style={styles.recordSubtitle}>
                  Start Date: {record.startTreatmentDate}
                </Text>
                <Text style={styles.recordSubtitle}>
                  Duration: {record.duration} {record.durationType}
                </Text>
                <Text style={styles.recordSubtitle}>
                  Comment: {record.comment}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
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
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  expandedContent: {
    marginTop: 10,
  },
});
export default MedicalPlanScreen;
