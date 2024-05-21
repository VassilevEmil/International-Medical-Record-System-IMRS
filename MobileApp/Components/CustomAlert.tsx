import { BlurView } from "@react-native-community/blur";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";

const CustomAlert = ({
  visible,
  title,
  message,
  buttonText,
  onClose,
  imageSource,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={9}
          reducedTransparencyFallbackColor="#808080"
        />
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>{title} </Text>
          {imageSource && (
            <Image source={imageSource} style={styles.alertImage} />
          )}
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity style={styles.alertButton} onPress={onClose}>
            <Text style={styles.alertButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  alertIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 18,
    color: "#273675",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: "#273675",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  alertButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomAlert;
