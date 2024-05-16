import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import profilePlaceholder from "../images/profile_placeholder.jpg";
import { Country } from "../enums";

const LinkSSNToAccountScreen = () => {
  const [ssnList, setSsnList] = useState<
    Array<{ country: Country; ssn: string }>
  >([
    { country: Country.Denmark, ssn: "12431234" },
    { country: Country.Lithuania, ssn: "2134124" },
    { country: Country.Bulgaria, ssn: "43563456" },
  ]);
  const [country, setCountry] = useState<Country | "">("");
  const [ssn, setSsn] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contentHeight, setContentHeight] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  const filteredCountries = Object.keys(Country)
    .filter((key) => key.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((key) => Country[key as keyof typeof Country]);

  const handleAddSsn = () => {
    if (country && ssn && /^\d+$/.test(ssn)) {
      setSsnList([...ssnList, { country, ssn }]);
      setCountry("");
      setSsn("");
    } else {
      Alert.alert(
        "Error",
        "Please enter a valid country from the list and a numeric SSN."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        onLayout={(event) => setViewHeight(event.nativeEvent.layout.height)}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setContentHeight(contentHeight)
        }
      >
        <View style={styles.profileContainer}>
          <Image source={profilePlaceholder} style={styles.profileImage} />
          <Text style={styles.profileName}>Tomas Anonymous</Text>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.pickerContainer}
          >
            <Text style={styles.pickerText}>{country || "Select Country"}</Text>
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
            </View>
          ))}
        </View>
      </ScrollView>
      {contentHeight > viewHeight && (
        <View style={styles.scrollArrowContainer}>
          <Icon name="down" style={styles.scrollArrow} />
        </View>
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
            <View style={styles.scrollArrowContainer}></View>
            <Icon name="up" style={styles.scrollArrow} />
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
            <View style={styles.scrollArrowContainer}>
              <Icon name="down" style={styles.scrollArrow} />
            </View>
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
  scrollArrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  scrollArrow: {
    fontSize: 24,
    color: "grey",
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default LinkSSNToAccountScreen;
