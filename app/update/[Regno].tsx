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
import { useLocalSearchParams, router } from "expo-router";
import { useMemberContext } from "../../createContext/ParishMemberContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

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
  const [email, setEmail] = useState<string>(""); // New state for email
  const [deaneries, setDeaneries] = useState<any[]>([]);
  const [selectedDeanery, setSelectedDeanery] = useState<string>("");
  const [parishes, setParishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string | null>(null); // For storing photo URL

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
            setPhoto(member.photo || null);
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !idNo || !cellNo || !email) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
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
      photo,
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

    setIsLoading(true);
    try {
      await updateMember(updatedMember);
      Alert.alert("Success", "Member updated successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/register"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update member. Please try again.");
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

          {/* Upload Photo */}
          <View style={styles.div}>
            <Text style={styles.label}>Profile Photo:</Text>
            <TouchableOpacity onPress={handlePickImage} style={styles.button}>
              <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>

            {photo && <Image source={{ uri: photo }} style={styles.photo} />}
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
          <View style={styles.div}>
            <Text style={styles.label}>Sacraments:</Text>
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
                <Text style={styles.buttonText}>Update</Text>
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
    alignItems: "stretch",
    paddingBottom: 20,
  },
  container: {
    paddingHorizontal: 16,
  },
  div: {
    marginBottom: 20,
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
    color: "#0ccc",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    width: "100%",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  button: {
    textAlign: "center",
    backgroundColor: "#0ccc",
    color: "#fff",
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 10,
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
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
});
