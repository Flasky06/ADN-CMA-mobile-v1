import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      console.log("Please fill in both email and password."); // Log missing fields
      Alert.alert("Error", "Please fill in both email and password."); // Show alert for missing fields
      return;
    }

    try {
      const response = await axios.post(
        "https://sbparish.or.ke/adncmatechnical/api/login",
        {
          email,
          password,
        }
      );

      const responseData = response.data;
      console.log("API Response:", responseData); // Log the full API response

      if (responseData.status === "success") {
        console.log("Login successful:", responseData.message); // Log success message
        router.replace("/home"); // Navigate to home screen
      } else {
        console.log("Login failed:", responseData.message); // Log failure message
        Alert.alert("Error", responseData.message); // Show alert with API error message
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        const errorMessage = error.response?.data.message || "Network error";
        console.log("Login failed:", errorMessage); // Log the error message
        Alert.alert("Error", errorMessage); // Show alert with API error message
      } else {
        // Handle non-Axios errors
        const errorMessage = "An unexpected error occurred. Please try again.";
        console.log(errorMessage); // Log unexpected errors
        Alert.alert("Error", errorMessage); // Show alert for unexpected errors
      }
      console.error("Login error:", error); // Log the full error for debugging
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email || ""}
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password || ""}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#0ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Login;
