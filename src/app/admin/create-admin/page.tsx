import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import CreateAdminComponent from "@/components/Page/CreateAdmin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Create Admin",
  description:
    "This is the Create Admin Page",
};

const CreateAdmin: React.FC = () => {
  
  return (
    <CreateAdminComponent />
  );
};

export default CreateAdmin;
