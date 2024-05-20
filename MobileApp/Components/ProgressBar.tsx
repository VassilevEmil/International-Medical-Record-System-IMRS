import React from "react";
import { View, StyleSheet } from "react-native";

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
    marginLeft: 10,
  },
  progressBarBackground: {
    height: "100%",
    width: "100%",
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
