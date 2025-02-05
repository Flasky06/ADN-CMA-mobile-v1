import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { themeStyles } from "@/constants/Colors";
import { shareAsync } from "expo-sharing";
import { printToFileAsync } from "expo-print";
import { useMemberContext } from "@/createContext/ParishMemberContext";

const RegisterPdf = () => {
  const { members, fetchMembers } = useMemberContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMembers();
      } catch (error) {
        alert("Something went wrong, please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchMembers]);
  const generatePdfHtml = () => {
    return `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 10mm;
            padding: 0;
          }
          h1 {
            text-align: center;
            font-size: 20px;
            color: ${themeStyles.themeColor};
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            font-size: 12px;
            text-align: left;
          }
          th {
            background-color: ${themeStyles.themeColor};
            color: white;
            font-weight: bold;
          }
          td.regNoCell {
            text-align: center;
          }
          td.nameCell, td.emailCell {
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1>Parish Register</h1>
        <table>
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Cell No</th>
              <th>ID No</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            ${members
              .map((member) => {
                return `
                  <tr>
                    <td class="regNoCell">${member.Regno}</td>
                    <td class="nameCell">${member.Name}</td>
                    <td>${member.CellNo}</td>
                    <td>${member.IdNo}</td>
                    <td class="emailCell">${member.email}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </body>
      </html>`;
  };

  const generatePdf = async () => {
    try {
      const file = await printToFileAsync({
        html: generatePdfHtml(),
        base64: false,
      });

      // Share the generated PDF
      await shareAsync(file.uri);
    } catch (error) {
      console.error("Error generating the PDF:", error);
      Alert.alert("Error", "There was an issue generating the PDF.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={themeStyles.themeColor}
        translucent
      />
      <View style={styles.view}>
        <Button title="Download Parish Register" onPress={generatePdf} />
      </View>

      <ScrollView style={{ width: "100%" }}>
        <Text style={styles.textStyles}>Parish Register:</Text>
        <Table members={members} />
      </ScrollView>
    </View>
  );
};

const Table = ({ members }) => {
  return (
    <View>
      <Text style={styles.textStyles}>PARISH REGISTER</Text>
      <ScrollView horizontal style={styles.scrollContainer}>
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headCell, { width: 80 }]}>Reg No</Text>
            <Text style={[styles.headCell, { flex: 1 }]}>Name</Text>
            <Text style={[styles.headCell, { width: 100 }]}>Cell No</Text>
            <Text style={[styles.headCell, { width: 100 }]}>ID No</Text>
            <Text style={[styles.headCell, { flex: 1.5 }]}>Email</Text>
          </View>
          {/* Table Rows */}
          {members.map((member, index) => (
            <View
              style={[
                styles.tableRow,
                index % 2 === 0 && { backgroundColor: "#f9f9f9" },
              ]}
              key={index}
            >
              <Text style={styles.regNoCell}>{member.Regno}</Text>
              <Text style={styles.nameCell}>{member.Name}</Text>
              <Text style={styles.cellNoCell}>{member.CellNo}</Text>
              <Text style={styles.idNoCell}>{member.IdNo}</Text>
              <Text style={styles.emailCell}>{member.email}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  view: {
    marginVertical: 40,
    width: "60%",
    borderRadius: 10,
    paddingVertical: 10,
  },
  textStyles: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: themeStyles.themeColor,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 12,
    backgroundColor: themeStyles.themeColor,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headCell: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
  tableCell: {
    textAlign: "left",
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 5,
  },
  regNoCell: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 5,
    width: 80,
  },
  nameCell: {
    flex: 1,
    textAlign: "left",
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 5,
    width: 120,
  },
  emailCell: {
    flex: 1.5,
    textAlign: "left",
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 5,
    width: 150,
  },
  cellNoCell: {
    width: 100,
    textAlign: "left",
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 5,
  },
  idNoCell: {
    width: 100,
    textAlign: "left",
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 5,
  },
  scrollContainer: {
    marginHorizontal: 5,
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RegisterPdf;
