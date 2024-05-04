import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { AppDispatch, RootState } from "../redux/store";

import { fetchMedicalRecords } from "../redux/thunks/MedicalRecords/medicalRecordsThunk";

console.log(Icon);
console.log(MaterialIcon);

const MedicalRecordsScreen = () => {
  const dispatch: AppDispatch = useDispatch();

  // const { data, loading, error } = useSelector(
  //   (state: any) => state.medicalRecords
  // );
  const state = useSelector((state: any) => state.medicalRecords);

  useEffect(() => {
    // JUST FOR POC DISPATCH ACTION WHEN COMPONENT MOUNTS
    dispatch(fetchMedicalRecords());
  }, [dispatch]);

  if (state) {
    console.log(state);
    console.log(state.data);
  }

  return (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  yearSection: {
    paddingVertical: 10,
    backgroundColor: "#e0e0e0",
    paddingLeft: 20,
  },
  yearText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  recordContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  recordTitle: {
    fontSize: 16,
  },
  recordSubtitle: {
    color: "gray",
  },
  recordAction: {
    color: "blue",
  },
});

export default MedicalRecordsScreen;
