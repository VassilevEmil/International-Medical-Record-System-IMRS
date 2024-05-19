import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();

  function validateInput() {
    if (!email.trim()) {
      setErrorMsg("Email is required.");
      return false;
    }
    if (!password) {
      setErrorMsg("Password is required.");
      return false;
    }
    return true;
  }

  const handleLogin = async () => {
  if (validateInput()) {
    try {
      await login(email, password);
      setErrorMsg(""); 
    } catch (error: any) {
      setErrorMsg(error.message); 
    }
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              <Text style={styles.title}>Login</Text>
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
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.loginText}>
                  Don't have an account? Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    paddingTop: 85,
    width: width,
    height: height,
    marginTop: 530,
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
  loginLink: {
    marginTop: 20,
  },
  loginText: {
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

export default LoginScreen;
