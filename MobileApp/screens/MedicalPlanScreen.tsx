import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Button } from "react-native";
import GetDrugsService from "../services/GetDrugRecordsService";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import IconFace from "react-native-vector-icons/FontAwesome";
import { ScrollView } from 'react-native';

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
    <ScrollView>
    <View style={styles.container}>
      {drugRecords.map((record, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          onPress={() => toggleRecordExpansion(index)}
        >
          <View
            style={[
              styles.recordItem,
              expandedRecordIndex === index && styles.selectedRecord,
            ]}
          >
            <View style={styles.recordHeader}>
              <View>
                <Text style={styles.recordTitle}>{record.nameOfDrug}  </Text>
                <Text style={styles.recordSubtitle}>
                  {record.duration} {record.durationType}
                </Text>
              </View>
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
               <View  style={styles.expandedContent}>
               <Text style={styles.recordSubtitle}>
                <Text style={styles.boldText}>Start Date:</Text>{" "}
                  {record.startTreatmentDate} {"                                                         "} {}
                    <Text style={styles.boldText}>Duration:</Text>{" "}
                      {record.duration} {record.durationType} {"\n"}
                </Text>
                <Text style={styles.recordSubtitle}>
                  <Text style={styles.boldText}>Comment:</Text>{"\n \n"} {}
                   <Text>{record.comment}</Text> {"\n"}
                    </Text>
                    <View style={styles.progressContainer}>
                      <Text>Progress</Text>
              {/* Progress Bar */}
              {/* Logic for the progress bar will be implemented later */}
              <View style={styles.progressBar}></View>
            </View>
            <Text style={styles.reminderText}>Reminder: {record.reminder} {"      "} {"plain text for now"} {"\n"}</Text>
           
                {/* <Text>
                  <Text style={styles.boldText}>Prescribed by:</Text>{" "}
                  {record.prescribedBy} on {record.timeStamp}
                </Text> */}

            <Text style={styles.recordSubtitle}>
            <IconFace name="user-md" size={20} color="blue" />{"   "}
 
              {record.prescribedBy} on {record.timeStamp}
              </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
  },
  recordItem: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 15,
    marginVertical: 10,
    elevation: 1,
  },

  // dont like it how it is, will just 

  selectedRecord: {
    backgroundColor: "",
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordTitle: {
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
  boldText: {
    fontWeight: "bold",
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
    // Add more styles as needed
  },
  reminderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
    // Add more styles as needed
  },
});
export default MedicalPlanScreen;

