import { useLocalSearchParams } from "expo-router";
import React, { createContext, useContext, useState, useEffect } from "react";

type Member = {
  Regno: number;
  Name: string;
  IdNo?: string;
  StationCode?: string;
  Commissioned?: string;
  CommissionNo?: string;
  Status?: string;
  photo?: string;
  LithurgyStatus?: string;
  DeanCode?: string;
  DOB?: any;
  Rpt?: string;
  CellNo?: string;
  Bapt?: string;
  Conf?: string;
  Euc?: string;
  Marr?: string;
  email?: string;
  parish_id?: number;
  created_at?: string;
  updated_at?: string;
};

type MemberContextType = {
  members: Member[];
  singleMember: Member | null;
  fetchMembers: () => Promise<void>;
  fetchMember: (regno: number) => Promise<Member | null>;
  addMember: (newMember: Member) => Promise<void>;
  updateMember: (updatedMember: Member) => Promise<void>;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [singleMember, setSingleMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      const response = await fetch(
        "https://sbparish.or.ke/adncmatechnical/api/parish/parish-members"
      );
      const data = await response.json();
      if (data.status === "success") {
        setMembers(data.data);
      } else {
        alert(data.message || "Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      alert("Failed to fetch members. Please check your network connection.");
    }
  };

  const fetchMember = async (regno: number): Promise<Member | null> => {
    try {
      const response = await fetch(
        `https://sbparish.or.ke/adncmatechnical/api/parish/parish-members/${regno}`
      );
      const data = await response.json();
      if (data.status === "success" && data.data) {
        setSingleMember(data.data); // Update context state
        return data.data; // Return the fetched member
      } else {
        alert(data.message || "Failed to fetch member");
        return null;
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      alert("Failed to fetch member. Please try again.");
      return null;
    }
  };

  const addMember = async (newMember: Member) => {
    setMembers((prev) => [...prev, newMember]); // Optimistic update
    try {
      const response = await fetch(
        "https://sbparish.or.ke/adncmatechnical/api/parish/parish-members",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMember),
        }
      );
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to add the member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      setMembers((prev) => prev.filter((m) => m.Regno !== newMember.Regno)); // Revert on error
      alert("Failed to add the member. Please try again.");
    }
  };

  const updateMember = async (updatedMember: Member) => {
    if (!updatedMember.Regno) {
      console.warn("No Regno provided to update the member.");
      return;
    }
    setMembers((prev) =>
      prev.map((member) =>
        member.Regno === updatedMember.Regno ? updatedMember : member
      )
    ); // Optimistic update
    try {
      const response = await fetch(
        `https://sbparish.or.ke/adncmatechnical/api/parish/parish-members/${updatedMember.Regno}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMember),
        }
      );
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to update the member");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      setMembers((prev) =>
        prev.map((member) =>
          member.Regno === updatedMember.Regno ? singleMember! : member
        )
      ); // Revert on error
      alert("Failed to update the member. Please try again.");
    }
  };

  useEffect(() => {
    fetchMembers(); // Fetch all members on mount
  }, []);

  return (
    <MemberContext.Provider
      value={{
        members,
        singleMember,
        fetchMembers,
        fetchMember,
        addMember,
        updateMember,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMemberContext must be used within a MemberProvider");
  }
  return context;
};
