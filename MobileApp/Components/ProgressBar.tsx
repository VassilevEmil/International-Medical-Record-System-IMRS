import React from "react";
import { View, StyleSheet } from "react-native";

const ProgressBar = ({ progress }) => {
  return (
    <View style={[styles.progressBarContainer, { width: `${progress}%` }]}>
      <View style={styles.progressBar}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10,
    backgroundColor: "transparent",
    borderRadius: 5,
    overflow: "hidden",
    marginLeft: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "blue",
    borderRadius: 5,
    marginRight: 130,
  },
});

export default ProgressBar;
