import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ProgressBar from "./ProgressBar";

const { width } = Dimensions.get("window");

const ProgressContainer = ({ progress }) => {
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>Progress</Text>
      <ProgressBar progress={progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: width * 0.8, // 90% of screen width
  },
  progressText: {
    marginRight: 10, // Add some space between the text and the progress bar
  },
});

export default ProgressContainer;
