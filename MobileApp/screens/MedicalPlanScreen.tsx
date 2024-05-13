import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import GetDrugsService from "../services/GetDrugRecordsService";

import Icon from "react-native-vector-icons/Ionicons";
import IconFace from "react-native-vector-icons/FontAwesome";
import ProgressContainer from "../Components/ProgressContainer";

import Reminder from "../Components/Reminder";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicalPlanScreen = ({ patientId }: { patientId: string }) => {
  const [drugRecords, setDrugRecords] = useState<any[]>([]);
  const [reminderInfo, setReminderInfo] = useState("No Reminders");
  
  const [expandedRecordIndex, setExpandedRecordIndex] = useState<number | null>(null);


  useEffect(() => {
    const fetchDrugRecords = async () => {
      try {
        const response = await GetDrugsService.fetchDrugRecordsByPatientId("123", 1, 10);
        if (response.success && response.data) {
          setDrugRecords(response.data);
        }
      } catch (error) {
        console.error("An error occurred while fetching records", error);
      }
    };
    fetchDrugRecords();

    

    AsyncStorage.getItem('reminderInfo').then((storedReminderInfo) => {
      if (storedReminderInfo) {
        setReminderInfo(storedReminderInfo);
      }
    });
  }, [patientId]);

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

  const handleReminderSet = (record, selectedDate, selectedTime) => {
    const notificationDateTime = new Date(selectedDate);
    notificationDateTime.setHours(selectedTime.getHours());
    notificationDateTime.setMinutes(selectedTime.getMinutes());

    // this is saving the info to the local storage 

    AsyncStorage.setItem('reminderInfo', reminderInfo);

    
    setReminderInfo(reminderInfo);
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
                <View style={[styles.titleContainer, isExpanded && styles.expandedTitleContainer]}>
  <Text style={styles.recordTitle}>{record.nameOfDrug}</Text>
  {!isExpanded && (
    <Text style={styles.recordSubtitle}>
      {record.duration} {record.durationType}
    </Text>
  )}
  {!isExpanded && (
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
                    <View style={styles.subtitleRow}>
    <Text style={styles.boldText}>Duration: </Text>
    <Text>{record.duration} {record.durationType}</Text>
 
                      
    <View style = {styles.startDate}>               
    <Text style={styles.boldText}>Start Date:</Text>
    <Text>{formatDate(record.startTreatmentDate)}</Text>
    </View>
  </View>
                      
                    </Text>
                    <Text style={styles.recordSubtitle}>
                      <Text style={styles.boldText}>Comment:</Text>{"\n \n"} {}
                      <Text>{record.comment}</Text> {"\n"}
                    </Text>
                    {isExpanded && (
                      <ProgressContainer progress={calculateProgress(record)} />
                    )}
                    <Reminder
                      onPress={(selectedDate, selectedTime) => handleReminderSet(record, selectedDate, selectedTime)}
                      drugName={record.nameOfDrug}
                      onUpdateReminderInfo={setReminderInfo}
                    />
                    <View style={styles.prescribedTextContainer}>
  <View style={styles.iconContainer}>
    <IconFace name="calendar" size={20} color="blue" />
  </View>
  <Text style={styles.labelText}>Prescribed on</Text>
  <Text style={styles.prescribedText}>
    {formatDate(record.timeStamp)}
  </Text>
</View>
<View style={styles.prescribedByContainer}>
  <View style={styles.iconContainer}>
    <IconFace name="user-md" size={20} color="blue" />
  </View>
  <Text style={styles.prescribedByText}>
    {record.prescribedBy}
  </Text>
</View>
                    
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
  selectedRecord: {},
  prescribedText: {
    fontSize: 16,
    color: "#838383",
    marginRight: 5,
    marginLeft: 5,
  },
  prescribedBy: {
    fontSize: 16,
    color: "#838383",
    paddingTop: 15,
    marginLeft: 5,
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
  subtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginBottom: 5,
  },
  startDate: {
    marginLeft: 300
  },
  expandedTitleContainer: {
    borderBottomWidth: 1, 
    borderBottomColor: "#ccc", 
    paddingBottom: 5, 
  },
  prescribedTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  iconContainer: {
    marginRight: 5,
  },
  labelText: {
    fontSize: 16,
    color: "#838383",
  },
  prescribedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },


  
  prescribedByText: {
    fontSize: 16,
    color: "#838383",
    marginLeft: 5, 
  },
 
});

export default MedicalPlanScreen;
