import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProgressBar from "./ProgressBar";

const ProgressContainer = ({ progress }) => {
  console.log("from container", progress);
  
  return (
    <View style={styles.progressContainer}>
      <Text>Progress</Text>
      <ProgressBar progress={progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default ProgressContainer;