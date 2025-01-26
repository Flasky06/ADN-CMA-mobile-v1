import React, { createContext, useContext, useState, useEffect } from "react";

// Define the structure for member data
type Member = {
  Regno: number;
  Name: string;
  IdNo: string;
  StationCode: string;
  Commissioned: string;
  CommissionNo: string;
  Status: string;
  photo: string;
  LithurgyStatus: string;
  DeanCode: string;
  Rpt: string;
  CellNo: string;
  Bapt: string;
  Conf: string;
  Euc: string;
  Marr: string;
  email: string;
  parish_id: number;
  created_at: string;
  updated_at: string;
};

type MemberContextType = {
  members: Member[];
  fetchMembers: () => Promise<void>;
  addMember: (newMember: Member) => Promise<void>;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [members, setMembers] = useState<Member[]>([]);

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
      console.error(error);
      alert("Something went wrong while fetching members.");
    }
  };

  const addMember = async (newMember: Member) => {
    try {
      const response = await fetch(
        "https://sbparish.or.ke/adncmatechnical/api/parish/parish-members",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMember),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "success") {
        setMembers((prev) => [...prev, newMember]);
      } else {
        alert(data.message || "Failed to add the member");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding the member.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <MemberContext.Provider value={{ members, fetchMembers, addMember }}>
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
