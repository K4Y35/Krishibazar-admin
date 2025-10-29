import React from "react";
import { Metadata } from "next";
import ManageAdminComponent from "@/components/Page/ManageAdmin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Manage Admins",
  description:
    "This is the Manage Admins Page",
};

const ManageAdmin: React.FC = () => {
  return (
    <ManageAdminComponent />
  );
}

export default ManageAdmin;
