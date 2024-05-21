import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "../Components/CustomAlert";

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  function validateInput() {
    if (!email.trim()) {
      setErrorMsg("Email is required.");
      return false;
    }
    if (!password) {
      setErrorMsg("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return false;
    }
    if (!patientFirstName.trim()) {
      setErrorMsg("First name is required.");
      return false;
    }
    if (!patientLastName.trim()) {
      setErrorMsg("Last name is required.");
      return false;
    }
    return true;
  }

  const handleRegister = async () => {
    if (validateInput()) {
      try {
        const response = await axios.post(
          "https://imrs-server-12m3e12kdk1k12mek.tech/api/auth/register",
          {
            email,
            password,
            patientFirstName,
            patientLastName,
          }
        );
        console.log(response);
        if (response.status === 201) {
          setAlertVisible(true);
        } else {
          setErrorMsg("Failed to register patient");
        }
      } catch (error: any) {
        if (error.response.data.message) {
          console.log(error);
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg("An error occurred. Please try again.");
        }
        console.error(error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("../images/health.jpg")}
        style={styles.container}
        resizeMode="cover"
        imageStyle={styles.image}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <View style={styles.innerContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Register</Text>
              {errorMsg ? (
                <Text style={styles.errorMsg}>{errorMsg}</Text>
              ) : null}
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#666"
                value={patientFirstName}
                onChangeText={setPatientFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#666"
                value={patientLastName}
                onChangeText={setPatientLastName}
              />
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.registerText}>
                  Already have an account? Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        <CustomAlert
          visible={alertVisible}
          title="Success"
          buttonText="Go to Login"
          message="Patient registered successfully"
          onClose={() => {
            setAlertVisible(false);
            navigation.navigate("Login");
          }}
        />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: height * 0.72,
    top: -100,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#ffffff",
    padding: 20,
    paddingTop: 70,
    width: width,
    height: height,
    marginTop: 150,
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#273675",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "85%",
    backgroundColor: "#edf0f7",
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#273675",
    width: "85%",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: "#273675",
  },
  errorMsg: {
    color: "red",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default RegisterScreen;
