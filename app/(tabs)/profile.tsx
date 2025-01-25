import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Use expo-router for navigation

const Profile = () => {
  const router = useRouter();

  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+254 712 345 678",
    address: "123 Main St, Nairobi, Kenya",
    profilePicture: "https://via.placeholder.com/150",
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    router.replace("/login"); // Navigate to login screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#0cc" translucent />
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{user.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{user.address}</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.replace("/editProfile")}
            >
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  profileDetails: {
    marginBottom: 30,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: "#666",
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: "#0ccc",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
