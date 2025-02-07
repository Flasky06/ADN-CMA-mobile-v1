import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, router } from "expo-router";
import { useMemberContext } from "../../createContext/ParishMemberContext";
import { Ionicons } from "@expo/vector-icons";
import { themeStyles } from "@/constants/Colors";

type PhotoType = {
  uri: string;
  filename: string;
  type: string;
} | null;

const UpdateParishMember: React.FC = () => {
  const { Regno } = useLocalSearchParams();
  const { fetchMember, updateMember } = useMemberContext();

  const [name, setName] = useState<string>("");
  const [idNo, setIdNo] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [station, setStation] = useState<string>("");
  const [cellNo, setCellNo] = useState<string>("");
  const [commStatus, setCommStatus] = useState<string>("");
  const [commissionNo, setCommissionNo] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isBaptChecked, setBaptChecked] = useState<boolean>(false);
  const [isConfChecked, setConfChecked] = useState<boolean>(false);
  const [isEucChecked, setEucChecked] = useState<boolean>(false);
  const [isMarrChecked, setMarrChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [deaneries, setDeaneries] = useState<any[]>([]);
  const [selectedDeanery, setSelectedDeanery] = useState<string>("");
  const [parishes, setParishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState<PhotoType>(null); // Changed to PhotoType
  const [initialPhotoUrl, setInitialPhotoUrl] = useState<string | null>(null); // Store initial photo URL

  // Fetch member data on mount
  useEffect(() => {
    const loadMemberData = async () => {
      if (Regno) {
        setIsLoading(true);
        try {
          const member = await fetchMember(Number(Regno));
          if (member) {
            setName(member.Name || "");
            setIdNo(member.IdNo || "");
            setDob(member.DOB || "");
            setStation(member.StationCode || "");
            setCellNo(member.CellNo || "");
            setCommStatus(member.Commissioned || "");
            setCommissionNo(member.CommissionNo || "");
            setStatus(member.Status || "");
            setBaptChecked(member.Bapt === "Yes");
            setConfChecked(member.Conf === "Yes");
            setEucChecked(member.Euc === "Yes");
            setMarrChecked(member.Marr === "Yes");
            setSelectedDeanery(member.DeanCode || "");
            // Handle photo loading as PhotoType
            if (member.photo) {
              setPhoto({ uri: member.photo, filename: null, type: null }); // Or determine filename/type if available
              setInitialPhotoUrl(member.photo); // Store initial URL for comparison
            } else {
              setPhoto(null);
              setInitialPhotoUrl(null);
            }
            setEmail(member.email || "");
          } else {
            Alert.alert("Error", "Member not found.");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to load member data.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMemberData();
  }, [Regno]);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPhoto({
        uri: asset.uri as string,
        filename: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !idNo || !cellNo || !email) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    let photoUrl = initialPhotoUrl; // Default to initial photo URL if no new photo picked

    try {
      // Upload to Cloudinary if a new photo is selected
      if (photo && photo.uri && photo.uri !== initialPhotoUrl) {
        // Compare URI to detect new image
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", {
          uri: photo.uri,
          name: photo.filename || `photo_${Date.now()}.jpg`,
          type: photo.type || "image/jpeg",
        });
        cloudinaryFormData.append("upload_preset", "adncmatechnical"); // Replace with your preset
        cloudinaryFormData.append("api_key", "774767986364867");
        cloudinaryFormData.append("cloud_name", "dynok9pj5");

        const cloudinaryResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dynok9pj5/image/upload",
          {
            method: "POST",
            body: cloudinaryFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const cloudinaryData = await cloudinaryResponse.json();
        photoUrl = cloudinaryData.secure_url;
        console.log("Updated photoUrl", photoUrl);
      } else {
        console.log("No new photo selected, using initial photo URL or null.");
      }

      const updatedMember = {
        Regno: Number(Regno),
        Name: name,
        IdNo: idNo,
        DOB: dob,
        StationCode: station,
        Commissioned: commStatus,
        CommissionNo: commissionNo,
        Status: status,
        photo: photoUrl, // Use the Cloudinary URL or initial URL
        LithurgyStatus: "Completed",
        DeanCode: selectedDeanery,
        Rpt: "Report005",
        CellNo: cellNo,
        Bapt: isBaptChecked ? "Yes" : "No",
        Conf: isConfChecked ? "Yes" : "No",
        Euc: isEucChecked ? "Yes" : "No",
        Marr: isMarrChecked ? "Yes" : "No",
        email,
        parish_id: 6,
      };

      await updateMember(updatedMember);
      Alert.alert("Success", "Member updated successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/register"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update member. Please try again.");
      console.error("Update Error:", error); // Log the detailed error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#0cc" translucent />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0ccc" />
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.title}>Update Parish Member</Text>

          {/* Form Fields */}
          <View style={styles.div}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter full name"
            />
          </View>

          <View style={styles.div}>
            <Text style={styles.label}>ID No:</Text>
            <TextInput
              style={styles.input}
              value={idNo}
              onChangeText={setIdNo}
              placeholder="Enter ID number"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.div}>
            <Text style={styles.label}>DOB:</Text>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="Enter date of birth (YYYY-MM-DD)"
            />
          </View>

          <View style={styles.div}>
            <Text style={styles.label}>Cell:</Text>
            <TextInput
              style={styles.input}
              value={cellNo}
              onChangeText={setCellNo}
              placeholder="Enter cell phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.div}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
            />
          </View>

          {/* Commission Status */}
          <View style={styles.div}>
            <Text style={styles.label}>Comm. Status:</Text>
            <Picker
              selectedValue={commStatus}
              onValueChange={setCommStatus}
              style={styles.picker}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Commissioned" value="Yes" />
              <Picker.Item label="In Waiting" value="No" />
            </Picker>
          </View>

          {/* Status */}
          <View style={styles.div}>
            <Text style={styles.label}>Status:</Text>
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
              style={styles.picker}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Active" value="Active" />
              <Picker.Item label="Inactive" value="Inactive" />
            </Picker>
          </View>

          {/* Sacraments */}
          <Text style={styles.label}>Sacraments:</Text>

          <View style={styles.divc}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isBaptChecked}
                onValueChange={setBaptChecked}
                color={isBaptChecked ? "#0ccc" : undefined}
              />
              <Text style={styles.checkboxLabel}>Baptism</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isConfChecked}
                onValueChange={setConfChecked}
                color={isConfChecked ? "#0ccc" : undefined}
              />
              <Text style={styles.checkboxLabel}>Confirmation</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isEucChecked}
                onValueChange={setEucChecked}
                color={isEucChecked ? "#0ccc" : undefined}
              />
              <Text style={styles.checkboxLabel}>Eucharist</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isMarrChecked}
                onValueChange={setMarrChecked}
                color={isMarrChecked ? "#0ccc" : undefined}
              />
              <Text style={styles.checkboxLabel}>Marriage</Text>
            </View>
          </View>

          {/* Upload Photo */}
          <View style={styles.div}>
            <Text style={styles.label}>Profile Photo:</Text>
            <TouchableOpacity onPress={handlePickImage} style={styles.button}>
              <Text style={styles.buttonText}>Update Passport Photo</Text>
            </TouchableOpacity>

            {photo && photo.uri && (
              <Image source={{ uri: photo.uri }} style={styles.photo} />
            )}
          </View>

          {/* Submit Button */}
          <View style={styles.div}>
            <TouchableOpacity
              style={[styles.input, styles.button]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Update
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateParishMember;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  div: {
    marginBottom: 20,
    width: "100%",
  },
  divc: {
    marginBottom: 20,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 6,
    fontSize: 16,
    width: "100%",
    backgroundColor: "#f7f7f7",
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#f7f7f7",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  button: {
    textAlign: "center",
    backgroundColor: themeStyles.themeColor,
    color: "#fff",
    paddingVertical: 14,
    borderRadius: 6,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    width: "80%",
    marginHorizontal: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 15,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: themeStyles.themeColor,
    marginHorizontal: "auto",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});
