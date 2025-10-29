import React, { useState } from "react";
import { Metadata } from "next";
import PendingUsersPage from "@/components/Page/PendingUsersPage";

export const metadata: Metadata = {
  title: "Admin Dashboard | Pending Users",
  description: `This is  ${process.env.NEXT_SITE_NAME} Pending Users Page`,
};

const PendingUsers = () => {
  
  return (
    <PendingUsersPage />
  );
};

export default PendingUsers;
