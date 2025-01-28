import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const PageLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="correctregister" options={{ headerShown: false }} />
        <Stack.Screen name="makepayments" options={{ headerShown: false }} />
        <Stack.Screen
          name="parishDetailedMpesaPayments"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="parishDetailedMpesaPayments"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="parishsummarizedmpesa"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="passportupload" options={{ headerShown: false }} />
        <Stack.Screen name="viewpassports" options={{ headerShown: false }} />
        <Stack.Screen name="editProfile" options={{ headerShown: false }} />
        <Stack.Screen name="[id]" options={{ headerShown: false }} />

        <StatusBar
          barStyle="light-content"
          backgroundColor="#0ccc"
          translucent={true}
        />
      </Stack>
    </>
  );
};

export default PageLayout;

const styles = StyleSheet.create({});
