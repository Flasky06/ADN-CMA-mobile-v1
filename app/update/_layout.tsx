import React from "react";
import { Stack } from "expo-router";
import { MemberProvider } from "@/createContext/ParishMemberContext";

const UpdateLayout = () => {
  return (
    <MemberProvider>
      <Stack>
        <Stack.Screen name="[Regno]" options={{ headerShown: false }} />
      </Stack>
    </MemberProvider>
  );
};

export default UpdateLayout;
