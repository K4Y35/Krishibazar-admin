import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import UpdateAdminComponent from "@/components/Page/UpdateAdmin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Update Admin",
  description:
    "This is the Update Admin Page",
};

const UpdateAdmin: React.FC = () => {  
  return (
    <UpdateAdminComponent />
  );
};

export default UpdateAdmin;
