import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useMemberContext } from "../../createContext/ParishMemberContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { StatusBar } from "react-native";
import { themeStyles } from "@/constants/Colors";

const Register = () => {
  const { members, fetchMembers } = useMemberContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMembers, setFilteredMembers] = useState(members);
  const router = useRouter();

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

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredMembers(members);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();

      const filtered = members.filter((member) => {
        const regnoString = member.Regno.toString();
        const nameMatch = member.Name.toLowerCase().includes(lowercasedQuery);
        const regnoMatch = regnoString.includes(lowercasedQuery);

        return nameMatch || regnoMatch;
      });

      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading members...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#0cc" translucent />
      <ScrollView style={themeStyles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Registered Parish Members </Text>
          <View style={styles.searchArea}>
            <Text style={styles.searchLabel}>Search Parsh Member :</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Name or RegNo"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <View style={styles.row}>
                {/* Table headers */}
                <Text style={[styles.cell, styles.header, styles.regNo]}>
                  RegNo
                </Text>
                <Text style={[styles.cell, styles.header, styles.name]}>
                  Name
                </Text>
                <Text style={[styles.cell, styles.header, styles.status]}>
                  Status
                </Text>
                <Text style={[styles.cell, styles.header, styles.cellNo]}>
                  Cell
                </Text>
                <Text style={[styles.cell, styles.header, styles.commStatus]}>
                  Comm Status
                </Text>
                <Text style={[styles.cell, styles.header, styles.commNo]}>
                  Comm No
                </Text>
                <Text style={[styles.cell, styles.header, styles.bapt]}>
                  Bapt
                </Text>
                <Text style={[styles.cell, styles.header, styles.conf]}>
                  Conf
                </Text>
                <Text style={[styles.cell, styles.header, styles.dob]}>
                  DOB
                </Text>
                <Text style={[styles.cell, styles.header, styles.deanCode]}>
                  Dean Code
                </Text>
                <Text style={[styles.cell, styles.header, styles.euc]}>
                  Euc
                </Text>
                <Text style={[styles.cell, styles.header, styles.idNo]}>
                  IdNo
                </Text>
                <Text
                  style={[styles.cell, styles.header, styles.lithurgyStatus]}
                >
                  Lithurgy Status
                </Text>
                <Text style={[styles.cell, styles.header, styles.marr]}>
                  Marr
                </Text>
                <Text style={[styles.cell, styles.header, styles.parishCode]}>
                  Parish Code
                </Text>
                <Text style={[styles.cell, styles.header, styles.rpt]}>
                  Rpt
                </Text>
                <Text style={[styles.cell, styles.header, styles.stationCode]}>
                  Station Code
                </Text>
                <Text style={[styles.cell, styles.header, styles.email]}>
                  Email
                </Text>
              </View>

              <FlatList
                data={filteredMembers}
                keyExtractor={(item) => item.Regno.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.row}>
                    <Text style={[styles.cell, styles.regNo]}>
                      {item.Regno}
                    </Text>
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "/update/[Regno]",
                          params: { Regno: item.Regno },
                        })
                      }
                    >
                      <Text
                        style={[styles.cell, styles.clickable, styles.name]}
                      >
                        {item.Name}
                      </Text>
                    </Pressable>

                    <Text style={[styles.cell, styles.status]}>
                      {item.Status}
                    </Text>
                    <Text style={[styles.cell, styles.cellNo]}>
                      {item.CellNo}
                    </Text>
                    <Text style={[styles.cell, styles.commStatus]}>
                      {item.Commissioned}
                    </Text>
                    <Text style={[styles.cell, styles.commNo]}>
                      {item.CommissionNo}
                    </Text>
                    <Text style={[styles.cell, styles.bapt]}>{item.Bapt}</Text>
                    <Text style={[styles.cell, styles.conf]}>{item.Conf}</Text>
                    <Text style={[styles.cell, styles.dob]}>{item.DOB}</Text>
                    <Text style={[styles.cell, styles.deanCode]}>
                      {item.DeanCode}
                    </Text>
                    <Text style={[styles.cell, styles.euc]}>{item.Euc}</Text>
                    <Text style={[styles.cell, styles.idNo]}>{item.IdNo}</Text>
                    <Text style={[styles.cell, styles.lithurgyStatus]}>
                      {item.LithurgyStatus}
                    </Text>
                    <Text style={[styles.cell, styles.marr]}>{item.Marr}</Text>
                    <Text style={[styles.cell, styles.parishCode]}>
                      {item.ParishCode}
                    </Text>
                    <Text style={[styles.cell, styles.rpt]}>{item.Rpt}</Text>
                    <Text style={[styles.cell, styles.stationCode]}>
                      {item.StationCode}
                    </Text>
                    <Text style={[styles.cell, styles.email]}>
                      {item.email}
                    </Text>
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  searchArea: {
    paddingRight: 40,
    paddingLeft: 20,
  },
  searchLabel: {
    fontWeight: "semibold",
    fontSize: 24,
    color: themeStyles.themeColor,
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: themeStyles.themeColor,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    fontSize: 14,
    paddingHorizontal: 4,
    textAlign: "center",
    minWidth: 100,
  },
  header: {
    fontWeight: "bold",
    backgroundColor: themeStyles.themeColor,
    paddingVertical: 8,
    color: "#fff",
    fontSize: 16,
  },
  clickable: {
    color: "blue",
    textDecorationLine: "underline",
  },

  regNo: {
    minWidth: 60,
    fontWeight: "bold",
  },
  name: {
    minWidth: 150,
    textAlign: "left",
  },
  status: {
    minWidth: 80,
  },
  cellNo: {
    minWidth: 100,
  },
  commStatus: {
    minWidth: 100,
  },
  commNo: {
    minWidth: 80,
  },
  bapt: {
    minWidth: 60,
  },
  conf: {
    minWidth: 60,
  },
  dob: {
    minWidth: 100,
  },
  deanCode: {
    minWidth: 80,
  },
  euc: {
    minWidth: 60,
  },
  idNo: {
    minWidth: 80,
  },
  lithurgyStatus: {
    minWidth: 100,
  },
  marr: {
    minWidth: 60,
  },
  parishCode: {
    minWidth: 80,
  },
  rpt: {
    minWidth: 80,
  },
  stationCode: {
    minWidth: 80,
  },
  email: {
    minWidth: 150,
  },
  parishId: {
    minWidth: 80,
  },
});
