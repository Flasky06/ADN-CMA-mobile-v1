import React from "react";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { MemberProvider } from "@/createContext/ParishMemberContext";

const TabLayout = () => {
  return (
    <MemberProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Add Member",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person-add" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="register"
          options={{
            title: "View Register",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="list" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </MemberProvider>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#00cccc", // Fixed color code
    borderTopWidth: 1,
    borderTopColor: "#00cccc",
    height: 60, // Adjusted height
  },
});
