import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import MyProfileComponent from "@/components/Page/MyProfile";

export const metadata: Metadata = {
  title: "Admin Dashboard | My Profile",
  description:
    "This is the My Profile Page",
};

const MyProfile: React.FC = () => {  
  return (
    <MyProfileComponent />
  );
};

export default MyProfile;
