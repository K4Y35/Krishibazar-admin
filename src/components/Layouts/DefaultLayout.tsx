"use client";
import React, { useState, ReactNode, useContext, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SiteContext } from "@/context/SiteContext";
import rbacService from "@/services/rbacServices";
import { Toaster } from "react-hot-toast";
import AdminChatWidget from "@/components/Chat/AdminChatWidget";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setUser, setToken, setPermissions, logout, isLogoutModalOpen, setLogoutModalOpen } =
    useContext<any>(SiteContext);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("admin_token") === null) {
      window.location.href = "/login";
    } else {
      setToken(localStorage.getItem("admin_token"));
      setUser(JSON.parse(localStorage.getItem("admin_user") || "{}"));
      setPermissions(JSON.parse(localStorage.getItem("admin_permissions") || "[]"));
      setShow(true);
    }
  }, []);

  useEffect(() => {
    // Fallback: if authenticated but permissions are empty, fetch from API
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const cachedPerms = typeof window !== "undefined" ? localStorage.getItem("admin_permissions") : null;
    if (token && (!cachedPerms || cachedPerms === "[]")) {
      rbacService
        .getMyPermissions()
        .then((res: any) => {
          const perms = res.data || [];
          localStorage.setItem("admin_permissions", JSON.stringify(perms));
          setPermissions(perms);
        })
        .catch(() => {

        });
    }
  }, []);

  return (
    <>
      {show && (
        <div className="flex">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Toaster />
          <div className="relative flex flex-1 flex-col lg:ml-72.5">
            {/* <!-- ===== Header Start ===== --> */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* <!-- ===== Header End ===== --> */}

            {/* <!-- ===== Main Content Start ===== --> */}
            <main className="min-h-screen">
              <div className="mx-auto max-w-screen-2xl p-3 md:p-3 2xl:p-3">
                {children}
              </div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          <AdminChatWidget />
        </div>
      )}
    </>
  );
}
