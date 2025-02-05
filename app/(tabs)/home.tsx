import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { themeStyles } from "@/constants/Colors";

const Menu: React.FC = () => {
  return (
    <SafeAreaView style={themeStyles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={themeStyles.themeColor}
        translucent
      />
      <ScrollView style={themeStyles.scrollContainer}>
        <Link href="/(tabs)/create" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>Register Member</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs)/register" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>Parish Register</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/correctregister" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>Correct Register</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/passportupload" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>Member Passport Upload</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/viewpassports" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>View Uploaded Passports</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/makepayments" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>Make Payment</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>Parish Detailed Mpesa Payment</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <Link href="/parishsummarizedmpesa" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>Parish Summarized Mpesa</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  linkContainer: {
    marginBottom: 20,
    width: "90%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: "#0cc",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
    paddingVertical: 10,
  },
});
