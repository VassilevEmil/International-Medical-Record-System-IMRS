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
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../context/AuthContext";
import { getRecords } from "../services/GetRecordsService";
import { MedicalRecord } from "models/medicalRecord";
import { FileInfo } from "models/fileInfo";
import { NavigationProp } from '@react-navigation/native';
import { TypeOfRecord } from "enums";

type RootStackParamList = {
  MedicalRecordsMain: undefined;
  RecordDetail: { recordId: string };  
  FileView: { fileId: string };
};

type MedicalRecordsScreenNavigationProp = NavigationProp<RootStackParamList, 'MedicalRecordsMain'>;


interface GroupedRecords {
  year: string;
  data: {
    date: string;
    records: Array<{
      id: string;
      date: string;
      type: string;
      institutionName: string;
      title: string;
      files: FileInfo[] | undefined;
      iconName: string;
    }>;
  }[];
}

const getIconName = (type: TypeOfRecord) => {
  switch (type) {
    case 'DIAGNOSIS':
      return 'description';  
    case 'GENERAL_VISIT':
      return 'assignment';  
    case 'BLOODWORK':
      return 'bloodtype';  
    case 'MEDICAL_IMAGING':
      return 'flip';  
    case 'Other':
    default:
      return 'emergency';  
  }
}

const MedicalRecordsScreen: React.FC  = () => {
 
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecords[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<MedicalRecordsScreenNavigationProp>();
  const { logout } = useAuth();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const response = await getRecords(page, 10, logout); 
      if (response.success && response.data) {
        const newGrouped = groupRecordsByYear(response.data.medicalRecords);
        setGroupedRecords(prev => [...prev, ...newGrouped]);
        setHasMore(response.data.medicalRecords.length === 10);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      alert(`An error occurred: ${error.message || 'Unknown error'}`);
    }
    setLoading(false);
  };
  
  const groupRecordsByYear = (medicalRecords: MedicalRecord[]): GroupedRecords[] => {
    const grouped: { [key: string]: { [date: string]: GroupedRecords['data'][number]['records'] } } = {};
    medicalRecords.forEach(record => {
      const timeStamp = new Date(record.timeStamp);
      const year = timeStamp.getFullYear().toString();
      const month = timeStamp.toLocaleString("en-US", { month: "short" });
      const day = timeStamp.getDate();
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
        institutionName: record.institution?.name || "N/A",
        title: record.title,
        files: record.files,
        iconName: getIconName(record.typeOfRecord),

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
  

  const MemoizedRecordItem = React.memo(({ record, navigateToDetail }) => (
    <TouchableOpacity
      key={record.id}
      style={styles.recordItem}
      onPress={() => navigateToDetail(record.id)}
    >
      <MaterialIcon name={record.iconName} size={24} color="#666" />
      <View style={styles.recordContent}>
        <Text style={styles.recordTitle}>{record.title}</Text>
        <Text style={styles.recordSubtitle}>{record.institutionName}</Text>
        <View style={styles.actionContainer}>
          <View style={styles.typeActionContainer}>
            <Text style={styles.typeActionText}>Type: {record.type}</Text>
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
  ));

  const navigateToDetail = useCallback((id: string) => {
    navigation.navigate("RecordDetail", { recordId: id });
}, [navigation]);
  
  const renderItem = useCallback(({ item }) => (
    <View>
      <Text style={styles.dateText}>{item.date}</Text>
      {item.records.map(record => (
        <MemoizedRecordItem key={record.id} record={record} navigateToDetail={navigateToDetail}/>
      ))}
    </View>
  ), [navigation]);

  const renderSectionHeader = ({ section }: { section: GroupedRecords }) => (
    <View style={styles.yearLabel}>
      <Text style={styles.yearText}>{section.year}</Text>
    </View>
  );
  
  const keyExtractor = (item: GroupedRecords['data'][number], index: number) => {
    return `${item.date}`;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
        {groupedRecords.length > 0 && <View style={styles.timeline} />}
      <SectionList
        sections={groupedRecords}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        onEndReached={fetchRecords}
        onEndReachedThreshold={0.8}
        ListFooterComponent={() => (
          <View style={{ height: 35, justifyContent: 'center', alignItems: 'center' }}>
            {loading && <ActivityIndicator size="large" color="#0340b6" />}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        initialNumToRender={10} 
        maxToRenderPerBatch={10} 
        windowSize={5}
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
