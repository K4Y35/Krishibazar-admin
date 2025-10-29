import React, { useState } from "react";
import { Metadata } from "next";
import AllUsersPage from "@/components/Page/AllUsersPage";
export const metadata: Metadata = {
  title: "Admin Dashboard | All Users",
  description: `This is  ${process.env.NEXT_SITE_NAME} All Users Page`,
};

const AllUsers = () => {
  
  return (
    <AllUsersPage />
  );
};

export default AllUsers;
