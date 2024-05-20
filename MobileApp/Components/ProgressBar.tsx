import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBar, { width: `${progress}%` }]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarBackground: {
    height: "100%",
    width: "80%",
    backgroundColor: "lightblue",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "blue",
    borderRadius: 5,
  },
});

export default ProgressBar;

