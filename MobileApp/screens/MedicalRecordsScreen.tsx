import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import GetRecordsService from "../services/GetRecordsService";

const MedicalRecordsScreen = () => {
  const [groupedRecords, setGroupedRecords] = useState([]);

  useEffect(() => {
    const initializeRecords = async () => {
      const medicalRecords = await fetchRecords();
      console.log(medicalRecords);
      if (medicalRecords) {
        const grouped = groupRecordsByYear(medicalRecords);
        setGroupedRecords(grouped);
      }
    };
    initializeRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await GetRecordsService.getRecords(233, 1, 10); // Hardcoded for now // until reg and login is implemented

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
  const groupRecordsByYear = (records) => {
    const grouped = {};

    records.forEach((record) => {
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
        type: record.typeOfRecord,
        location: record.institution?.id || "N/A",
        action: record.title,
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
    <View style={styles.container}>
      <View style={styles.timeline} />
      <ScrollView style={styles.ScrollView}>
        {groupedRecords.map((yearGroup, yearIndex) => (
          <View key={yearIndex}>
            {yearIndex === 0 ||
            recordsData[yearIndex - 1].year !== yearGroup.year ? (
              <View style={styles.yearLabel}>
                <Text style={styles.yearText}>{yearGroup.year}</Text>
              </View>
            ) : null}
            {yearGroup.dates.map((dateGroup, dateIndex) => (
              <View key={dateIndex}>
                <Text style={styles.dateText}>{dateGroup.date}</Text>
                {dateGroup.records.map((record, recordIndex) => (
                  <TouchableOpacity key={recordIndex} style={styles.recordItem}>
                    <Icon name={record.iconName} size={24} color="#666" />
                    <View style={styles.recordContent}>
                      <Text style={styles.recordTitle}>{record.type}</Text>
                      <Text style={styles.recordSubtitle}>
                        {record.location}
                      </Text>
                      <Icon style={styles.recordActionContainer}>
                        <Text style={styles.recordActionText}>
                          {record.action}
                        </Text>
                      </Icon>
                    </View>
                    <MaterialIcon name="chevron-right" size={24} color="#666" />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
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
  recordActionContainer: {
    backgroundColor: "#e6eeff",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingBottom: 6,
    paddingVertical: 3,
    marginRight: "auto",
  },
  recordActionText: {
    fontSize: 13,
    color: "#002a7b",
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
