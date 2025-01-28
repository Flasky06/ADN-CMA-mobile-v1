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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, router } from "expo-router";
import { useMemberContext } from "../createContext/ParishMemberContext";
import { Ionicons } from "@expo/vector-icons";

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
  const [deaneries, setDeaneries] = useState<any[]>([]);
  const [selectedDeanery, setSelectedDeanery] = useState<string>("");
  const [parishes, setParishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Date Picker State
  const [selectedYear, setSelectedYear] = useState<string>("1950");
  const [selectedMonth, setSelectedMonth] = useState<string>("01");
  const [selectedDay, setSelectedDay] = useState<string>("01");

  // Fetch member data on mount
  useEffect(() => {
    const loadMemberData = async () => {
      if (Regno) {
        setIsLoading(true);
        try {
          const member = await fetchMember(Number(Regno));
          if (member) {
            setName(member.Name);
            setIdNo(member.IdNo);
            setDob(member.DOB);
            setStation(member.StationCode);
            setCellNo(member.CellNo);
            setCommStatus(member.Commissioned);
            setCommissionNo(member.CommissionNo);
            setStatus(member.Status);
            setBaptChecked(member.Bapt === "Yes");
            setConfChecked(member.Conf === "Yes");
            setEucChecked(member.Euc === "Yes");
            setMarrChecked(member.Marr === "Yes");
            setSelectedDeanery(member.DeanCode);
          }
        } catch (error) {
          console.error("Error loading member data:", error);
          Alert.alert("Error", "Failed to load member data.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMemberData();
  }, [Regno]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !idNo || !cellNo) {
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
      photo: "http://example.com/photo5.jpg",
      LithurgyStatus: "Completed",
      DeanCode: selectedDeanery,
      Rpt: "Report005",
      CellNo: cellNo,
      Bapt: isBaptChecked ? "Yes" : "No",
      Conf: isConfChecked ? "Yes" : "No",
      Euc: isEucChecked ? "Yes" : "No",
      Marr: isMarrChecked ? "Yes" : "No",
      email: "test@example.com",
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
      console.error("Error updating member:", error);
      Alert.alert("Error", "Failed to update member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#0cc" translucent />
        {/* Back Arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Navigate back
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
            <Text style={styles.label}>Cell:</Text>
            <TextInput
              style={styles.input}
              value={cellNo}
              onChangeText={setCellNo}
              placeholder="Enter cell phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Other Fields */}
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

          <View style={styles.div}>
            <Text style={styles.label}>Commission No:</Text>
            <TextInput
              style={styles.input}
              value={commissionNo}
              onChangeText={setCommissionNo}
              placeholder="Enter commission number"
            />
          </View>

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

          {/* Sacraments Checkboxes */}
          <View style={styles.div}>
            <Text style={styles.label}>Sacraments:</Text>
            <View style={styles.section}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={isBaptChecked}
                  onValueChange={setBaptChecked}
                />
                <Text style={styles.paragraph}>Bapt</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={isConfChecked}
                  onValueChange={setConfChecked}
                />
                <Text style={styles.paragraph}>Conf</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox value={isEucChecked} onValueChange={setEucChecked} />
                <Text style={styles.paragraph}>Euc</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={isMarrChecked}
                  onValueChange={setMarrChecked}
                />
                <Text style={styles.paragraph}>Marr</Text>
              </View>
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
  section: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
    padding: 4,
  },
  paragraph: {
    marginLeft: 6,
    fontSize: 18,
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 1,
  },
});
