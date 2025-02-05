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
import { MemberProvider } from "../../createContext/ParishMemberContext";
import { router } from "expo-router";

type PhotoType = {
  uri: string;
  filename: string;
  type: string;
} | null;

const Create: React.FC = () => {
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
  const [photo, setPhoto] = useState<PhotoType>(null);
  const [selectedYear, setSelectedYear] = useState<string>("1950");
  const [selectedMonth, setSelectedMonth] = useState<string>("01");
  const [selectedDay, setSelectedDay] = useState<string>("01");

  // Generate years from 1950 to 2000
  const years = Array.from({ length: 2024 - 1950 + 1 }, (_, i) =>
    (1950 + i).toString()
  );

  // Months (1–12)
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  // Days (1–31, dynamically updated based on the selected month and year)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(Number(selectedYear), Number(selectedMonth)) },
    (_, i) => (i + 1).toString().padStart(2, "0")
  );

  // Update DOB when year, month, or day changes
  useEffect(() => {
    setDob(`${selectedYear}-${selectedMonth}-${selectedDay}`);
  }, [selectedYear, selectedMonth, selectedDay]);

  // Fetch deaneries from the API
  useEffect(() => {
    const fetchDeaneries = async () => {
      try {
        const response = await fetch(
          "https://sbparish.or.ke/adncmatechnical/api/deaneries"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        const data = JSON.parse(text);
        if (data.status === "success") {
          setDeaneries(data.data);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch deaneries. Please try again.");
      }
    };

    fetchDeaneries();
  }, []);

  // Fetch parishes when a deanery is selected
  useEffect(() => {
    if (selectedDeanery) {
      const fetchParishes = async () => {
        try {
          const response = await fetch(
            `https://sbparish.or.ke/adncmatechnical/api/parishes/by-deanery/${selectedDeanery}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const text = await response.text();
          const data = JSON.parse(text);
          if (data.status === "success") {
            setParishes(data.data);
          }
        } catch (error) {
          Alert.alert("Error", "Failed to fetch parishes. Please try again.");
        }
      };

      fetchParishes();
    } else {
      setParishes([]);
    }
  }, [selectedDeanery]);

  // Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      console.log("asset", asset);
      setPhoto({
        uri: asset.uri as string,
        filename: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      });
    }
  };

  const handleSubmit = async () => {
    if (!name || !idNo || !cellNo) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      let photoUrl = "";

      // Upload to Cloudinary if photo exists
      if (photo) {
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
        console.log("photoUrl", photoUrl);
      }

      // Prepare form data for your backend
      const formData = new FormData();

      formData.append("Name", name);
      formData.append("IdNo", idNo);
      formData.append("DOB", dob);
      formData.append("ParishCode", "P005");
      formData.append("StationCode", station || "");
      formData.append("Commissioned", commStatus || "");
      formData.append("CommissionNo", commissionNo || "");
      formData.append("Status", status || "");
      formData.append("LithurgyStatus", "Completed");
      formData.append("DeanCode", "D005");
      formData.append("Rpt", "Report005");
      formData.append("CellNo", cellNo);
      formData.append("Bapt", isBaptChecked ? "Yes" : "No");
      formData.append("Conf", isConfChecked ? "Yes" : "No");
      formData.append("Euc", isEucChecked ? "Yes" : "No");
      formData.append("Marr", isMarrChecked ? "Yes" : "No");
      formData.append("email", "member@example.com");
      formData.append("parish_id", "6");

      // Add Cloudinary URL if available
      if (photoUrl) {
        formData.append("photo", photoUrl);
      }

      // Send data to your backend
      const response = await fetch(
        "https://sbparish.or.ke/adncmatechnical/api/parish/parish-members",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (response.ok && data.status === "success") {
        Alert.alert("Success", "Parish member created successfully!");
        router.replace("/register");
      } else {
        Alert.alert("Error", data.message || "Failed to register member.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MemberProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#0cc"
            translucent
          />
          <View style={styles.container}>
            <Text style={styles.title}>Register New Parish Member</Text>

            {/* Deanery Picker */}
            <View style={styles.div}>
              <Text style={styles.label}>Deanery:</Text>
              <Picker
                selectedValue={selectedDeanery}
                onValueChange={(itemValue) => setSelectedDeanery(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Deanery" value="" />
                {deaneries.map((deanery) => (
                  <Picker.Item
                    key={deanery.id}
                    label={deanery.name}
                    value={deanery.id}
                  />
                ))}
              </Picker>
            </View>

            {/* Parish Picker (Conditional Rendering) */}
            {selectedDeanery && (
              <View style={styles.div}>
                <Text style={styles.label}>Parish:</Text>
                <Picker
                  selectedValue={station}
                  onValueChange={(itemValue) => setStation(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Parish" value="" />
                  {parishes.map((parish) => (
                    <Picker.Item
                      key={parish.id}
                      label={parish.name}
                      value={parish.code}
                    />
                  ))}
                </Picker>
              </View>
            )}

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

            {/* Date of Birth Picker */}
            <View style={styles.div}>
              <Text style={styles.label}>Date of Birth:</Text>
              <View style={styles.datePickerContainer}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(itemValue) => setSelectedYear(itemValue)}
                  style={styles.datePicker}
                >
                  {years.map((year) => (
                    <Picker.Item key={year} label={year} value={year} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                  style={styles.datePicker}
                >
                  {months.map((month) => (
                    <Picker.Item key={month} label={month} value={month} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={selectedDay}
                  onValueChange={(itemValue) => setSelectedDay(itemValue)}
                  style={styles.datePicker}
                >
                  {days.map((day) => (
                    <Picker.Item key={day} label={day} value={day} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Other Fields */}
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
              <Text style={styles.label}>Comm. Status:</Text>
              <Picker
                selectedValue={commStatus}
                onValueChange={(itemValue) => setCommStatus(itemValue)}
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
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Active" value="Active" />
                <Picker.Item label="Inactive" value="Inactive" />
              </Picker>
            </View>

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
                  <Checkbox
                    value={isEucChecked}
                    onValueChange={setEucChecked}
                  />
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

            {/* Photo Upload */}
            <View style={styles.div}>
              <Text style={styles.label}>Photo:</Text>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick an image</Text>
              </TouchableOpacity>
              {photo && (
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.imagePreview}
                />
              )}
            </View>

            {/* Submit Button  */}
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
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </MemberProvider>
  );
};

export default Create;

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
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datePicker: {
    flex: 1,
    marginHorizontal: 4,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
});
