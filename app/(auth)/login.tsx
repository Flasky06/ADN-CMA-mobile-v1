import * as SecureStore from "expo-secure-store";
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { cmaLogo } from "@/constants/assets";
import { AuthContext } from "../../createContext/AuthContext";
import { Image } from "react-native";
import { themeStyles } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setAuthData, fetchUserProfile } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    setIsLoading(true);

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
      const responseTokenData = response.data;

      if (responseTokenData.status === "success") {
        const authData = {
          token: responseTokenData.data.token,
        };

        // Save the token to SecureStore as a JSON string
        await SecureStore.setItemAsync("authData", JSON.stringify(authData));

        // Update context with the token
        await setAuthData(authData);

        console.log("AuthData after login:", authData);
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
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={themeStyles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#0cc"
        translucent={false}
      />
      <View style={styles.container}>
        <View>
          <Image source={cmaLogo} style={styles.logo} />
        </View>
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
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    fontSize: 34,
    fontWeight: "bold",
    marginVertical: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: themeStyles.themeColor,
    borderRadius: 8,
  },
  button: {
    backgroundColor: themeStyles.themeColor,
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
    backgroundColor: "#999",
  },
});

export default Login;
