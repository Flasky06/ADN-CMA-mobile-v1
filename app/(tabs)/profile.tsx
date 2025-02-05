// import React, { useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   StatusBar,
//   Text,
//   View,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Button,
//   Alert,
// } from "react-native";
// import * as SecureStore from "expo-secure-store";

// const Profile = () => {
//   const [secureStoreData, setSecureStoreData] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchSecureData = async () => {
//       try {
//         const data = await SecureStore.getItemAsync("authData");
//         setSecureStoreData(data);
//         console.log("Data from SecureStore:", data);
//       } catch (error) {
//         console.error("Error fetching SecureStore data:", error);
//       }
//     };

//     fetchSecureData();
//   }, []);

//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       const authData = await SecureStore.getItemAsync("authData");
//       const parsedData = authData ? JSON.parse(authData) : null;

//       if (!parsedData?.token) {
//         throw new Error("Token is missing");
//       }

//       // Make the logout API request
//       const response = await fetch(
//         "https://sbparish.or.ke/adncmatechnical/api/logout",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${parsedData.token}`,
//           },
//         }
//       );

//       // Check if response is OK before attempting to parse JSON
//       const responseText = await response.text(); // Get raw response text

//       // If response status is not OK, log it and show a friendly message
//       if (!response.ok) {
//         console.error("Error logging out:", responseText);
//         Alert.alert("Error", `Logout failed: ${responseText}`);
//         return;
//       }

//       let parsedResult = null;
//       try {
//         // Try parsing the response as JSON
//         parsedResult = JSON.parse(responseText);
//       } catch (error) {
//         console.error("Error parsing response:", error);
//         Alert.alert(
//           "Error",
//           "Failed to parse response. The server might have returned an HTML error page."
//         );
//         return;
//       }

//       // If the response is successful, clear auth data and log out
//       if (parsedResult?.status === 200) {
//         console.log("Logout successful:", parsedResult);
//         await SecureStore.deleteItemAsync("authData");
//         Alert.alert("Success", "You have been logged out.");
//       } else {
//         Alert.alert("Error", parsedResult?.message || "Failed to log out.");
//       }
//     } catch (error) {
//       console.error("Error logging out:", error);
//       Alert.alert(
//         "Error",
//         error.message || "An error occurred while logging out."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#0cc" translucent />
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.profileCard}>
//           <Text style={styles.title}>Profile Information</Text>

//           {/* Display the stored token */}
//           <Text style={styles.text}>
//             {secureStoreData
//               ? `Stored Data: ${secureStoreData}`
//               : "No data found in SecureStore"}
//           </Text>

//           {/* Logout Button */}
//           <Button
//             title={loading ? "Logging out..." : "Logout"}
//             onPress={handleLogout}
//             disabled={loading}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     paddingTop: 20,
//   },
//   scrollContainer: {
//     alignItems: "center",
//     paddingBottom: 20,
//   },
//   profileCard: {
//     marginVertical: 80,
//     backgroundColor: "#ffeb3b",
//     padding: 20,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });

// export default Profile;
