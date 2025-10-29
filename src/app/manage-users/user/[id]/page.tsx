import React, { useState } from "react";
import { Metadata } from "next";
import UserDetailsPage from "@/components/Page/UserDetailsPage";
export const metadata: Metadata = {
  title: "Admin Dashboard | User Details",
  description: `This is  ${process.env.NEXT_SITE_NAME} User Details Page`,
};

const UserDetails = () => {
  
  return (
    <UserDetailsPage />
  );
};

export default UserDetails;
