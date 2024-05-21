import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import GetRecordsService from "../services/GetRecordsService";

const MedicalRecordsScreen = () => {
  const [groupedRecords, setGroupedRecords] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeRecords = async () => {
      await fetchRecords();
    };
    initializeRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await GetRecordsService.getRecords(1, 10); 

      if (response.success && response.data) {
        const grouped = groupRecordsByYear(response.data.medicalRecords);
        setGroupedRecords(grouped);
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  // group records by year and sort dates for each year / needed for UI later on
  // the way we display...
  const groupRecordsByYear = (records: any) => {
    const grouped = {};

    records.forEach((record: any) => {
      const timestamp = new Date(record.timeStamp);
      const year = timestamp.getFullYear().toString();
      const month = timestamp.toLocaleString("en-US", { month: "short" });
      const day = timestamp.getDate();
      const formattedDate = `${day} ${month} ${year}`;

      if (!grouped[year]) {
        grouped[year] = {};
      }

      if (!grouped[year][formattedDate]) {
        grouped[year][formattedDate] = [];
      }

      grouped[year][formattedDate].push({
        id: record.id,
        type: record.typeOfRecord,
        location: record.institution?.id || "N/A",
        title: record.title,
        files: record.files,
        iconName: "flask-outline",
      });
    });

    return Object.entries(grouped)
      .map(([year, dates]) => ({
        year,
        dates: Object.entries(dates).map(([date, records]) => ({
          date,
          records,
        })),
      }))
      .sort((a, b) => b.year.localeCompare(a.year)); // Sort in descending order
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.timeline} />
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {groupedRecords.map((yearGroup, yearIndex) => (
              <View key={yearIndex}>
                {yearIndex === 0 ||
                groupedRecords[yearIndex - 1].year !== yearGroup.year ? (
                  <View style={styles.yearLabel}>
                    <Text style={styles.yearText}>{yearGroup.year}</Text>
                  </View>
                ) : null}
                {yearGroup.dates.map((dateGroup, dateIndex) => (
                  <View key={dateIndex}>
                    <Text style={styles.dateText}>{dateGroup.date}</Text>
                    {dateGroup.records.map((record, recordIndex) => (
                      <TouchableOpacity
                        key={recordIndex}
                        style={styles.recordItem}
                        onPress={() => {
                          navigation.navigate("RecordDetail", {
                            recordId: record.id,
                          });
                        }}
                      >
                        <Icon name={record.iconName} size={24} color="#666" />
                        <View style={styles.recordContent}>
                          <Text style={styles.recordTitle}>{record.title}</Text>
                          <Text style={styles.recordSubtitle}>
                            {record.location}
                          </Text>
                          <View
                            style={[
                              styles.actionContainer,
                              { flexDirection: "row", alignItems: "center" },
                            ]}
                          >
                            <View style={styles.typeActionContainer}>
                              <Text style={styles.typeActionText}>
                                Type: {record.type}
                              </Text>
                            </View>
                            {record.files && record.files.length > 0 && (
                              <View style={styles.filesActionContainer}>
                                <Text style={styles.filesActionText}>
                                  Files
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <MaterialIcon
                          name="chevron-right"
                          size={24}
                          color="#666"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    // so that components not visible on the bottom gap between navigation bar and screen end, when scrolling
    paddingBottom: 35,
  },
  innerContainer: {
    flex: 1,
  },
  scrollViewContent: {
    // Scroll view padding!!!
    // This is to control the padding of scrollable components
    paddingBottom: 55,
  },
  timeline: {
    position: "absolute",
    left: 41, // !!
    width: 1,
    backgroundColor: "#BDBDBD",
    top: 20,
    bottom: 0,
  },
  yearLabel: {
    backgroundColor: "#0340b6",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 18,
    marginVertical: 16,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  yearText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dateText: {
    fontWeight: "bold",
    color: "#797979",
    marginLeft: 55, // !!
    fontSize: 16,
    marginVertical: 8,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
    elevation: 1,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "auto",
  },
  typeActionContainer: {
    backgroundColor: "#e6eeff",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginRight: 10,
  },
  typeActionText: {
    fontSize: 13,
    color: "#002a7b",
    fontWeight: "bold",
  },
  filesActionContainer: {
    backgroundColor: "#0340b6",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  filesActionText: {
    fontSize: 13,
    color: "#e6eeff",
    fontWeight: "bold",
  },
  recordContent: {
    flex: 1,
    marginLeft: 10,
  },
  recordTitle: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 15,
  },
  recordSubtitle: {
    fontSize: 14,
    color: "#838383",
    fontWeight: "bold",
    marginBottom: 4,
  },
  recordAction: {
    fontSize: 14,
    color: "#002a7b",
  },
});

export default MedicalRecordsScreen;
