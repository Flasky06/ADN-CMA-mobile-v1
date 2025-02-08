import React, { createContext, useContext, useState, useEffect } from "react";

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

// Add updateMember function
const updateMember = async (updatedMember: Member) => {
  try {
    const response = await fetch(
      `https://sbparish.or.ke/adncmatechnical/api/parish/parish-members/${updatedMember.Regno}`, // Use Regno from updatedMember
      {
        method: "PUT", // Or PATCH, depending on your API documentation
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMember),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Update failed, HTTP status:", response.status);
      console.error("Response data:", data); // Log response data for more details
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    if (data.status === "success") {
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.Regno === updatedMember.Regno ? updatedMember : member
        )
      );
    } else {
      console.error("Update failed, API status:", data.status);
      console.error("API message:", data.message);
      throw new Error(data.message || "Failed to update the member");
    }
  } catch (error) {
    console.error("Error in updateMember function:", error);
    throw error;
  }
};

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMemberContext must be used within a MemberProvider");
  }
  return context;
};
function setMembers(arg0: (prevMembers: any) => any) {
  throw new Error("Function not implemented.");
}
