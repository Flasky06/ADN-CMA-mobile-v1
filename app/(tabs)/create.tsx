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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";

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

  // Date Picker State
  const [selectedYear, setSelectedYear] = useState<string>("1950");
  const [selectedMonth, setSelectedMonth] = useState<string>("01");
  const [selectedDay, setSelectedDay] = useState<string>("01");

  // Generate years from 1950 to 2000
  const years = Array.from({ length: 51 }, (_, i) => (1950 + i).toString());

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
        console.log("Raw Response:", text);

        const data = JSON.parse(text);
        if (data.status === "success") {
          setDeaneries(data.data);
        }
      } catch (error) {
        console.error("Error fetching deaneries:", error);
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
          console.log("Raw Response:", text);

          const data = JSON.parse(text);
          if (data.status === "success") {
            setParishes(data.data);
          }
        } catch (error) {
          console.error("Error fetching parishes:", error);
          Alert.alert("Error", "Failed to fetch parishes. Please try again.");
        }
      };

      fetchParishes();
    } else {
      setParishes([]);
    }
  }, [selectedDeanery]);

  const handleSubmit = async () => {
    const payload = {
      Name: name,
      IdNo: idNo,
      DOB: dob,
      ParishCode: "P005",
      StationCode: station,
      Commissioned: commStatus,
      CommissionNo: commissionNo,
      Status: status,
      photo: "http://example.com/photo5.jpg",
      LithurgyStatus: "Completed",
      DeanCode: "D005",
      Rpt: "Report005",
      CellNo: cellNo,
      Bapt: isBaptChecked ? "Yes" : "No",
      Conf: isConfChecked ? "Yes" : "No",
      Euc: isEucChecked ? "Yes" : "No",
      Marr: isMarrChecked ? "Yes" : "No",
      email: "test@example.com",
      parish_id: 6,
    };

    try {
      const response = await fetch(
        "https://sbparish.or.ke/adncmatechnical/api/parish/parish-members",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await response.text(); // Log the raw response
      console.log("Raw Response (Submit):", text);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = JSON.parse(text);
      if (data.status === "success") {
        Alert.alert(
          "Success",
          data.message || "Parish member created successfully"
        );
        console.log("Created Parish Member:", data.data);

        // Reset the form
        setName("");
        setIdNo("");
        setDob("");
        setStation("");
        setCellNo("");
        setCommStatus("");
        setCommissionNo("");
        setStatus("");
        setBaptChecked(false);
        setConfChecked(false);
        setEucChecked(false);
        setMarrChecked(false);
      } else {
        Alert.alert(
          "Error",
          typeof data.message === "string"
            ? data.message
            : JSON.stringify(data.message || "Failed to register member")
        );
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#0cc" translucent />
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

          {/* Select-Based Date Picker */}
          <View style={styles.div}>
            <Text style={styles.label}>Date of Birth:</Text>
            <View style={styles.datePickerContainer}>
              {/* Year Picker */}
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.datePicker}
              >
                {years.map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>

              {/* Month Picker */}
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.datePicker}
              >
                {months.map((month) => (
                  <Picker.Item key={month} label={month} value={month} />
                ))}
              </Picker>

              {/* Day Picker */}
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

          <View style={styles.div}>
            <Text style={[styles.input, styles.button]} onPress={handleSubmit}>
              Submit
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
});
