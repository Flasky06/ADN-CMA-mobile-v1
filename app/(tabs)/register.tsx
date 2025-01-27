import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useMemberContext } from "../createContext/ParishMemberContext";

const Register = () => {
  const { members, fetchMembers } = useMemberContext(); // Access context
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from the API using the context
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMembers(); // Use the fetchMembers function from context
      } catch (error) {
        console.error(error);
        alert("Something went wrong, please try again.");
      } finally {
        setLoading(false); // Stop loading once the request is finished
      }
    };

    loadData(); // Call the function to fetch the members data
  }, [fetchMembers]); // Dependency on fetchMembers

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading members...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registered Members</Text>

      <View style={styles.row}>
        <Text style={[styles.cell, styles.header]}>No</Text>
        <Text style={[styles.cell, styles.header]}>Name</Text>
        <Text style={[styles.cell, styles.header]}>RegNo</Text>
        <Text style={[styles.cell, styles.header]}>Status</Text>
        <Text style={[styles.cell, styles.header]}>Cell</Text>
        <Text style={[styles.cell, styles.header]}>Comm Status</Text>
        <Text style={[styles.cell, styles.header]}>Comm No</Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.Regno.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.Name}</Text>
            <Text style={styles.cell}>{item.Regno}</Text>
            <Text style={styles.cell}>{item.Status}</Text>
            <Text style={styles.cell}>{item.CellNo}</Text>
            <Text style={styles.cell}>{item.Commissioned}</Text>
            <Text style={styles.cell}>{item.CommissionNo}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderLeftColor: "#ccc",
    borderRightColor: "#ccc",
  },
  cell: {
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 2,
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#0ccc",
    paddingVertical: 8,
    color: "#fff",
    fontSize: 20,
  },
});
