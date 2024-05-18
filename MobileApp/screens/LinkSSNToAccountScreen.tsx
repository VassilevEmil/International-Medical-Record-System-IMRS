import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import profilePlaceholder from "../images/profile_placeholder.jpg";
import { getSSNList } from "../services/GetSSNList";
import { Country } from "../enums";
import { addSSN } from "../services/AddSSN";
import { deleteSSN } from "../services/RemoveSSN";
import { useAuth } from "../context/AuthContext";

const LinkSSNToAccountScreen = () => {
  const [ssnList, setSsnList] = useState<
    Array<{ country: Country; ssn: string }>
  >([]);
  const [country, setCountry] = useState<Country | "">("");
  const [ssn, setSsn] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { patientId } = useAuth();

  useEffect(() => {
    const fetchSSNList = async () => {
      try {
        if (!patientId) {
          console.log("Not authenticated");
          return;
        }
        const data = await getSSNList(patientId);
        setSsnList(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchSSNList();
  }, [patientId]);

  const filteredCountries = Object.keys(Country)
    .filter((key) => key.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((key) => Country[key as keyof typeof Country]);

  const handleAddSsn = async () => {
    if (country && ssn && /^\d+$/.test(ssn)) {
      try {
        if (!patientId) {
          Alert.alert("Not authenticated");
          return;
        }
        await addSSN(patientId, ssn, country);
        setSsnList([...ssnList, { country, ssn }]);
        setCountry("");
        setSsn("");
        Alert.alert("Success", "SSN added successfully");
      } catch (error) {
        Alert.alert("Error", "Failed to add SSN");
      }
    } else {
      Alert.alert(
        "Error",
        "Please enter a valid country from the list and a numeric SSN."
      );
    }
  };

  const handleDeleteSsn = async (
    ssnToDelete: string,
    countryToDelete: Country
  ) => {
    try {
      if (!patientId) {
        console.log("Not authenticated");
        return;
      }
      await deleteSSN(patientId, ssnToDelete);
      setSsnList(
        ssnList.filter(
          (item) => item.ssn !== ssnToDelete || item.country !== countryToDelete
        )
      );
      Alert.alert("Success", "SSN deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete SSN");
    }
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.profileContainer}>
            <Image source={profilePlaceholder} style={styles.profileImage} />
            <Text style={styles.profileName}>Tomas Anonymous</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.pickerContainer}
            >
              <Text style={styles.pickerText}>
                {country || "Select Country"}
              </Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Social Security Number"
              style={styles.input}
              value={ssn}
              keyboardType="numeric"
              onChangeText={(text) => setSsn(text.replace(/[^0-9]/g, ""))}
            />
            <TouchableOpacity onPress={handleAddSsn} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add SSN</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.accessContainer}>
            {ssnList.map((item, index) => (
              <View key={index} style={styles.accessItem}>
                <Icon name="idcard" style={styles.iconPlus} />
                <View style={styles.textContainer}>
                  <Text style={styles.ssnText}>Country: {item.country}</Text>
                  <Text style={styles.ssnText}>SSN: {item.ssn}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteSsn(item.ssn, item.country)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.searchTitle}>Supported Countries</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Search Country"
              onChangeText={setSearchTerm}
              value={searchTerm}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setCountry(item);
                    setModalVisible(false);
                    setSearchTerm("");
                  }}
                >
                  <Text style={styles.countryText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
    backgroundColor: "#ffffff",
    borderRadius: 100,
    borderBottomWidth: 1,
    borderColor: "#d1d1d1",
    alignSelf: "center",
    margin: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  pickerText: {
    fontSize: 16,
    color: "grey",
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderColor: "#d1d1d1",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "transparent",
    borderRadius: 5,
    width: 70,
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 12,
    color: "red",
    fontWeight: "bold",
  },
  addButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "blue",
    backgroundColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    color: "blue",
    fontWeight: "bold",
  },
  accessContainer: {
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  accessItem: {
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#d1d1d1",
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
  },
  iconPlus: {
    marginRight: 10,
    fontSize: 25,
    color: "#383838",
  },
  iconDelete: {
    fontSize: 25,
    color: "red",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  ssnText: {
    fontSize: 14,
    color: "gray",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "blue",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    height: "90%",
    width: "80%",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  searchTitle: {
    color: "black",
    fontSize: 20,
    marginTop: -10,
  },
  modalInput: {
    margin: 20,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderColor: "#d1d1d1",
    borderWidth: 1,
    borderRadius: 10,
  },
  countryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  countryText: {
    fontSize: 18,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default LinkSSNToAccountScreen;
