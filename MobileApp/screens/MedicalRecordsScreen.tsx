import React, { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  SectionList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../context/AuthContext";
import { getRecords } from "../services/GetRecordsService";

const MedicalRecordsScreen = () => {
  const [groupedRecords, setGroupedRecords] = useState([]);
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await getRecords(page, 10, logout);
      console.log("Fetched records:", response);

      if (response.success && response.data) {
        const newGrouped = groupRecordsByYear(response.data.medicalRecords);
        console.log("GROUPED records:", newGrouped);
        setGroupedRecords((prev) => [...prev, ...newGrouped]);
        setHasMore(response.data.medicalRecords.length === 10);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : "An unknown error occurred");
    }
    setLoading(false);
  };

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
        id: record.id,
        date: formattedDate,
        type: record.typeOfRecord,
        location: record.institution?.id || "N/A",
        title: record.title,
        files: record.files,
        iconName: "flask-outline",
      });
    });

    return Object.entries(grouped).map(([year, dates]) => ({
      year,
      data: Object.entries(dates).map(([date, records]) => ({
        date,
        records,
      })),
    }));
  };

  const renderItem = useCallback(({ item }) => (
    <View>
      <Text style={styles.dateText}>{item.date}</Text>
      {item.records.map((record) => (
        
        <TouchableOpacity
          key={record.id}
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
            <Text style={styles.recordSubtitle}>{record.location}</Text>
            <View style={styles.actionContainer}>
              <View style={styles.typeActionContainer}>
                <Text style={styles.typeActionText}>
                  Type: {record.type}
                </Text>
              </View>
              {record.files && record.files.length > 0 && (
                <View style={styles.filesActionContainer}>
                  <Text style={styles.filesActionText}>Files</Text>
                </View>
              )}
            </View>
          </View>
          <MaterialIcon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  ), [navigation]);

  const renderSectionHeader = ({ section: { year } }) => (
    <View style={styles.yearLabel}>
      <Text style={styles.yearText}>{year}</Text>
    </View>
  );

  const keyExtractor = (item, index) => {
    // the year and the exact date (day and month)
    // ensures uniquess for our "sections" in our case.
    // Our components here are section blocks of unique date (year / month and day)
    console.log(`${item.date}`)
    return `${item.date}`;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.timeline} />
      <SectionList
        sections={groupedRecords}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        onEndReached={fetchRecords}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          <View style={{ height: 35, justifyContent: 'center', alignItems: 'center' }}>
            {loading && <ActivityIndicator size="large" color="#0340b6" />}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
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
    paddingBottom: 35,
  },
  innerContainer: {
    flex: 1,
  },
  timeline: {
    position: "absolute",
    left: 41,
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
    marginLeft: 55,
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
});

export default MedicalRecordsScreen;

