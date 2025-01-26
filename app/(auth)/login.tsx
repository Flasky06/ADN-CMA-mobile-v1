import React, { useState, useContext } from "react";
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
import { AuthContext } from "../createContext/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading

  const { setAuthData, fetchUserProfile } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    setIsLoading(true); // Set loading to true when the login request starts

    try {
      const response = await axios.post<{
        status: string;
        data: {
          token: string;
          user: { id: string; email: string; name: string };
        };
        message?: string;
      }>("https://sbparish.or.ke/adncmatechnical/api/login", {
        email,
        password,
      });

      const responseData = response.data;

      if (responseData.status === "success") {
        setAuthData({
          token: responseData.data.token,
          user: responseData.data.user,
        });

        // Fetch the user profile after setting the token
        await fetchUserProfile();

        router.replace("/home");
      } else {
        Alert.alert("Error", responseData.message || "Login failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message || "Network error";
        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Reset loading state once the request completes
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]} // Disable button while loading
        onPress={handleLogin}
        disabled={isLoading} // Disable button while loading
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
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
    backgroundColor: "#00cccc",
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
  buttonDisabled: {
    backgroundColor: "#999", // Darker shade to indicate it's disabled
  },
});

export default Login;
