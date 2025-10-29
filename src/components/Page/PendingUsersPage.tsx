"use client";
import React, { useEffect, useMemo, useState } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";
import userService from "@/services/userServices";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";

const PendingUsersPage: React.FC = () => {

  const [allUsers, setAllUsers] = useState<any>([]);

  const fetchAllUsers = async () => {
    const response = await userService.getAllUsers();
    setAllUsers(response.users);
    console.log(response);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const rows = useMemo(() => {
    if (!Array.isArray(allUsers)) return [];
    return allUsers
      .map((u: any) => {
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim();
      const createdDate = u.created_at ? new Date(u.created_at).toLocaleDateString() : "";
      const isApproved = Number(u.is_approved) === 1 || u.is_approved === true;
      return {
        id: u.id,
        date: createdDate,
        name: fullName || "N/A",
        email: u.email || "",
        phone: u.phone || "",
        status: isApproved ? "Approved" : "Pending",
      };
      })
      .filter((r: any) => r.status === "Pending");
  }, [allUsers]);

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pending Users</h2>
          <span className="text-sm text-gray-500">Total: {rows.length}</span>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-meta-4">
                <th className="px-4 py-3 text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-sm font-medium">Full Name</th>
                <th className="px-4 py-3 text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-sm font-medium">Phone</th>
                <th className="px-4 py-3 text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id} className="border-t border-stroke dark:border-strokedark">
                  <td className="px-4 py-3 text-sm">{r.date}</td>
                  <td className="px-4 py-3 text-sm">{r.name}</td>
                  <td className="px-4 py-3 text-sm">{r.email}</td>
                  <td className="px-4 py-3 text-sm">{r.phone}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.status === "Approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/manage-users/user/${r.id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-stroke px-3 py-1 text-sm hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
                    >
                      <FaRegEye />
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PendingUsersPage;
