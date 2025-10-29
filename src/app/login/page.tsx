import React, { useState } from "react";
import { Metadata } from "next";
import LoginComponent from "@/components/Page/Login";
export const metadata: Metadata = {
  title: "Admin Dashboard | Login",
  description: "This is GCPAY Login Page",
};

const Login: React.FC = () => {
  
  return (
    <LoginComponent />
  );
};

export default Login;
