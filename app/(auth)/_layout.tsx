import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0ccc"
          translucent={true}
        />
      </Stack>
    </>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
