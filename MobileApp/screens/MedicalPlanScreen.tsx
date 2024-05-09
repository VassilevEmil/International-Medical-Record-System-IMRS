import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import GetDrugsService from "../services/GetDrugRecordsService";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import IconFace from "react-native-vector-icons/FontAwesome";
import { ScrollView } from 'react-native';
import ProgressContainer from "../Components/ProgressContainer";




const MedicalPlanScreen = ({ patientId }: { patientId: string }) => {
  const [drugRecords, setDrugRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRecordIndex, setExpandedRecordIndex] = useState<number | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDrugRecords = async () => {
      setIsLoading(true);
      try {
        const response = await GetDrugsService.fetchDrugRecordsByPatientId("123", 1, 10);
        if (response.success && response.data) {
          setDrugRecords(response.data);
          setIsLoading(false);

          // response.data.forEach((record, index) => {
          //   const durationInMilliseconds = calculateDurationInMilliseconds(record);
          //   const notificationTime = new Date(Date.now() + durationInMilliseconds);
          //   const notificationMessage = `Time to take ${record.nameOfDrug}`;

          //  // PushNotification.localNotificationSchedule({
          //     message: notificationMessage,
          //     date: notificationTime,
          //   });
          // });

        } else {
          setError(response.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : "An unknown error occurred");
        setError("An error occurred while fetching records");
        setIsLoading(false);
      }
    };
    fetchDrugRecords();
  }, [patientId]);

  // const calculateDurationInMilliseconds = (record) => {
  //   let durationInMilliseconds = 0;
  //   switch (record.durationType) {
  //     case 'minutes':
  //       durationInMilliseconds = record.duration * 60 * 1000;
  //       break;
  //     case 'hours':
  //       durationInMilliseconds = record.duration * 60 * 60 * 1000;
  //       break;
  //     case 'days':
  //       durationInMilliseconds = record.duration * 24 * 60 * 60 * 1000;
  //       break;
     
  //   }
  //   return durationInMilliseconds;
  // };
  

  const toggleRecordExpansion = (index: number) => {
    setExpandedRecordIndex((prevIndex) => prevIndex === index ? null : index);
  };

  const calculateProgress = (record: any) => {
    const startDate = new Date(record.startTreatmentDate);
    const endDate = new Date(startDate.getTime() + record.duration * 24 * 60 * 60 * 1000);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const remainingDuration = endDate.getTime() - new Date().getTime();
    const progress = ((totalDuration - remainingDuration) / totalDuration) * 100;
    return Math.max(Math.min(progress, 100), 0); 
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {drugRecords.map((record, index) => {
          const isExpanded = expandedRecordIndex === index;
          
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => toggleRecordExpansion(index)}
            >
              <View style={[styles.recordItem, isExpanded && styles.selectedRecord]}>
                <View style={styles.recordHeader}>
                <View style={styles.titleContainer}>
  <Text style={styles.recordTitle}>{record.nameOfDrug}</Text>
  {!isExpanded && (
    <Text style={styles.recordSubtitle}>
      {record.duration} {record.durationType}
    </Text>
  )}
  {(!isExpanded) && (
    <ProgressContainer progress={calculateProgress(record)} />
  )}
</View>

                  <TouchableOpacity onPress={() => toggleRecordExpansion(index)}>
                    <Icon
                      name={isExpanded ? "caret-down-outline" : "caret-forward-outline"}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.recordSubtitle}>
                      <Text style={styles.boldText}>Start Date:</Text>{" "}
                      {record.startTreatmentDate} {" "}
                      <Text style={styles.boldText}>Duration:</Text>{" "}
                      {record.duration} {record.durationType} {"\n"}
                    </Text>
                    <Text style={styles.recordSubtitle}>
                      <Text style={styles.boldText}>Comment:</Text>{"\n \n"} {}
                      <Text>{record.comment}</Text> {"\n"}
                    </Text>
                    {isExpanded && (
                      <ProgressContainer progress={calculateProgress(record)} />
                    )}
                    <Text style={styles.reminderText}>
                      Reminder: {record.reminder} {"      "} {"plain text for now"} {"\n"}
                    </Text>
                    <Text style={styles.prescribedText}>
                      <IconFace name="calendar" size={20} color="blue" /> Prescribed on {formatDate(record.timeStamp)}
                    </Text>
                    <Text style={styles.prescribedText}>
                      <IconFace name="user-md" size={20} color="blue" /> {record.prescribedBy}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
  },
  titleContainer: {
    flex: 1,
  },
  recordItem: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 15,
    marginVertical: 10,
    elevation: 1,
  },
  selectedRecord: {
    
  },
  prescribedText: {
    fontSize: 16,
    color: "#838383",
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
  reminderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
  arrowContainer: {
    marginLeft: 10,
    zIndex: 1, 
  },
  progressAndArrowContainer: {
    flexDirection: "row",
    alignItems: "center",
  }
});

export default MedicalPlanScreen;
