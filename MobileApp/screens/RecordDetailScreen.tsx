import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fetchRecord } from "../services/GetRecordsService";
import { useAuth } from "../context/AuthContext";

const RecordDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { logout } = useAuth();
  const { recordId } = route.params;
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIdVisible, setIsIdVisible] = useState(false);

  const formatDate = (timestamp) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(timestamp)
      .toLocaleDateString("en-GB", options)
      .replace(/ /g, " ");
  };

  useEffect(() => {
    const getRecord = async () => {
      setIsLoading(true);
      try {
        console.log(recordId)
        const response = await fetchRecord(recordId, logout);
        if (response.success && response.data) {
          setRecord(response.data);
        } else {
          console.error("Failed to fetch record:", response.message);
        }
      } catch (error) {
        console.error("Error fetching record:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (recordId) {
      getRecord();
    }
  }, [recordId]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!record) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>Record not found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.detailBox}>
            <View style={styles.detailContainer}>
              <Icon name="access-time" size={20} color="#666" />
              <Text style={styles.detailText}>
                Date: {formatDate(record.timeStamp)}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="account-balance" size={20} color="#666" />
              <Text style={styles.detailText}>
                Institution: {record.institution.name}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="location-on" size={20} color="#666" />
              <Text style={styles.detailText}>
                Address: {record.institution.address}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="flag" size={20} color="#666" />
              <Text style={styles.detailText}>
                Country: {record.institution.country}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="person" size={20} color="#666" />
              <Text style={styles.detailText}>
                Doctor Name: {record.doctorFirstName} {record.doctorLastName}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="local-hospital" size={20} color="#666" />
              <Text style={styles.detailText}>Diagnosis: {record.title}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="fingerprint" size={20} color="#666" />
              <Text style={styles.detailText}>
                ID: {isIdVisible ? record.id : "****"}
              </Text>
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsIdVisible(!isIdVisible)}
              >
                <Icon
                  name={isIdVisible ? "visibility" : "visibility-off"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.commentTitle}>Comment:</Text>
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>{record.text}</Text>
          </View>
          {record.files && record.files.length > 0 && (
            <>
              <Text style={styles.subtitle}>Attached Files:</Text>
              {record.files.map((file, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.fileItem}
                  onPress={() =>
                    navigation.navigate("FileView", {
                      recordId: recordId,
                      fileId: file.id,
                    })
                  }
                >
                  <Icon name="attach-file" size={20} color="#666" />
                  <Text style={styles.fileText}>{file.name}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </ScrollView>
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
  scrollViewContent: {
    padding: 20,
    paddingBottom: 80,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
  },
  eyeButton: {
    marginLeft: 10,
  },
  commentTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    color: "red",
  },
  commentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  fileText: {
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0340b6",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    width: 120,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RecordDetailScreen;
