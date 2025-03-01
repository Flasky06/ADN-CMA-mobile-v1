import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { cmaLogo } from "@/constants/assets";
import { AuthProvider } from "@/createContext/AuthContext";
import { themeStyles } from "@/constants/Colors";

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaView style={themeStyles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#0cc"
          translucent={false}
        />
        <View style={styles.container}>
          <Image source={cmaLogo} style={styles.logo} />
          <Text style={styles.title}>CMA</Text>
          <Text style={styles.subtitle}>Catholic Men's Association</Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: "#0ccc",
    fontSize: 64,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: themeStyles.themeColor,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: themeStyles.themeColor,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 54,
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default App;
