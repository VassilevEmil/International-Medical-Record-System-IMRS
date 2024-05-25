import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import IconE from "react-native-vector-icons/Entypo";
import IconFA from "react-native-vector-icons/FontAwesome";
import { getAllowedInstitutions } from "../services/GetAllowedInstitutions";
import { searchInstitution } from "../services/SearchAllowedInstitutions";
import { Institution } from "../models/institution";
import profilePlaceholder from "../images/profile_placeholder.jpg";
import { removeAllowedInstitution } from "../services/RemoveAllowedInstituion";
import { addAllowedInstitution } from "../services/AddAllowedInstitution";
import { useAuth } from "../context/AuthContext";
import CustomAlert from "../Components/CustomAlert";

const ManagePermissionsScreen: React.FC = () => {
  const [allowedInstitutions, setAllowedInstitutions] = useState<Institution[]>(
    []
  );
  const [recentlyRemovedInstitutions, setRecentlyRemovedInstitutions] =
    useState<Institution[]>([]);
  const [searchResults, setSearchResults] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertButtonText, setAlertButtonText] = useState("OK");

  const patientId = useAuth().patientId;

  type Func = (...args: any[]) => void;

  const debounce = (func: Func, delay: number): ((...args: any[]) => void) => {
    let debounceTimer: NodeJS.Timeout;
    return function (...args: any[]) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      handleSearch(term);
    }, 800),
    []
  );

  const handleSearch = async (term: string) => {
    setIsSearching(true);
    try {
      const results = await searchInstitution(term);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching institutions:", error);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    if (searchTerm !== "") {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchAllowedInstitutions();
    setRecentlyRemovedInstitutions([]);
  }, []);

  const fetchAllowedInstitutions = async () => {
    try {
      if (!patientId) {
        console.log("Not authenticated");
        return;
      }
      const institutions = await getAllowedInstitutions(patientId);
      setAllowedInstitutions(institutions);
    } catch (error) {
      console.error("Error fetching allowed institutions:", error);
    }
  };

  const handleAddInstitution = async (
    institutionId: string,
    addedInstitution: Institution
  ) => {
    console.log("adding, ", patientId);
    if (!patientId) {
      console.log("Not authenticated");
      return;
    }
    try {
      await addAllowedInstitution(institutionId, patientId);
      await fetchAllowedInstitutions();
      setAlertTitle("Success");
      setAlertMessage("Institution added successfully");
      setAlertButtonText("OK");
      setAlertVisible(true);
      if (addedInstitution) {
        setRecentlyRemovedInstitutions((prevInstitutions) =>
          prevInstitutions.filter(
            (institution) =>
              institution.institutionId !== addedInstitution.institutionId
          )
        );
      }
    } catch (error) {
      setAlertTitle("Error");
      setAlertMessage("Failed to add institution");
      setAlertButtonText("OK");
      setAlertVisible(true);
    }
  };

  const handleRemoveInstitution = async (
    institutionId: string,
    removedInstitution: Institution
  ) => {
    if (patientId) {
      try {
        await removeAllowedInstitution(institutionId, patientId);
        await fetchAllowedInstitutions();
        setAlertTitle("Success");
        setAlertMessage("Institution removed successfully");
        setAlertButtonText("OK");
        setAlertVisible(true);
        if (removedInstitution) {
          setRecentlyRemovedInstitutions((prevInstitutions) => [
            ...prevInstitutions,
            removedInstitution,
          ]);
        }
      } catch (error) {
        setAlertTitle("Error");
        setAlertMessage("Failed to remove institution");
        setAlertButtonText("OK");
        setAlertVisible(true);
      }
    }
  };

  const isAllowedInstitution = (institution: Institution) => {
    return allowedInstitutions.some((allowed) => allowed.id === institution.id);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const toggleDetails = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const institutionsToDisplay = React.useMemo(() => {
    if (searchTerm) {
      return searchResults;
    }

    const institutionMap = new Map();

    recentlyRemovedInstitutions.forEach((institution) => {
      institutionMap.set(institution.institutionId, institution);
    });

    allowedInstitutions.forEach((institution) => {
      institutionMap.set(institution.institutionId, institution);
    });

    return Array.from(institutionMap.values());
  }, [
    searchTerm,
    searchResults,
    allowedInstitutions,
    recentlyRemovedInstitutions,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
          <Image source={profilePlaceholder} style={styles.profileImage} />
          <Text style={styles.profileName}>Tomas Anonymous</Text>
        </View>
        <View style={styles.searchBar}>
          <IconE name="magnifying-glass" style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            style={styles.searchText}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <TouchableOpacity onPress={handleClearSearch}>
            <Icon name="closecircle" style={styles.searchClearIcon} />
          </TouchableOpacity>
        </View>
        {isSearching ? (
          <Text style={styles.sectionTitle}>Searching:</Text>
        ) : searchTerm ? (
          <Text style={styles.sectionTitle}>Search results:</Text>
        ) : (
          <Text style={styles.sectionTitle}>Authorized access:</Text>
        )}
        <View style={styles.accessContainer}>
          {institutionsToDisplay.length === 0 &&
            !isSearching &&
            !searchTerm && (
              <Text style={styles.noResultsText}>
                No institutions have rights to edit or view your medical records
              </Text>
            )}
          {searchTerm && searchResults.length === 0 && !isSearching && (
            <Text style={styles.noResultsText}>
              No medical institutions found with the provided name
            </Text>
          )}
          {institutionsToDisplay.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleDetails(item.institutionId)}
              style={styles.accessItem}
            >
              <IconFA
                name="institution" // Example icon of an institution
                style={styles.iconInstitution}
              />
              <View style={styles.textContainer}>
                <Text style={styles.institutionName}>{item.name}</Text>
                <Text style={styles.institutionId}>{item.institutionId}</Text>
                {selectedId === item.institutionId && (
                  <View style={styles.detailView}>
                    <Text style={styles.detailsText}>
                      Address: {item.address}
                    </Text>
                    <Text style={styles.detailsText}>
                      Country: {item.country}
                    </Text>
                  </View>
                )}
              </View>
              {isAllowedInstitution(item) ? (
                <TouchableOpacity
                  onPress={() =>
                    handleRemoveInstitution(item.institutionId, item)
                  }
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleAddInstitution(item.institutionId, item)}
                  style={styles.addButton}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        buttonText={alertButtonText}
        onClose={() => setAlertVisible(false)}
      />
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
    borderBottomWidth: 1,
    borderColor: "#d1d1d1",
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
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
    color: "gray",
  },
  searchClearIcon: {
    fontSize: 20,
    marginHorizontal: 10,
    color: "gray",
  },
  searchText: {
    fontSize: 18,
    color: "gray",
    fontWeight: "bold",
    alignItems: "flex-start",
    flex: 1,
  },
  searchBar: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#d1d1d1",
    marginBottom: 20,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
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
  iconInstitution: {
    marginRight: 10,
    fontSize: 25,
    color: "#383838",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  institutionName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    flexWrap: "wrap",
    paddingRight: 5,
  },
  institutionId: {
    fontSize: 14,
    color: "gray",
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
    borderRadius: 5,
    width: 70,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 12,
    color: "blue",
    fontWeight: "bold",
  },
  detailView: {
    marginTop: 5,
  },
  detailsText: {
    fontSize: 14,
    color: "gray",
  },
  noResultsText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default ManagePermissionsScreen;
