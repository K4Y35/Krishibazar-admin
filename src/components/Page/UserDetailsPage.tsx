"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useParams, useRouter } from "next/navigation";
import userService from "@/services/userServices";
import Image from "next/image";
import toast from "react-hot-toast";

const UserDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.id as string) || "";

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(userId);
      console.log(response, "response");
      setUser(response.user[0]);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    try {
      setLoading(true);
      await userService.approveUser(userId);
      toast.success("User approved");
      await fetchUserDetails();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Approve failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserDetails();
  }, [userId]);
  

  const fullName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "";

  return (
    <DefaultLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">User Details</h2>
          <button
            onClick={() => router.back()}
            className="rounded-md border border-stroke px-3 py-1 text-sm hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
          >
            Back
          </button>
        </div>

        {loading && (
          <div className="rounded-md border border-stroke p-4 text-sm dark:border-strokedark">Loading...</div>
        )}

        {user && (
          <div className="rounded-md border border-stroke p-4 dark:border-strokedark">
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-gray-500">Full Name</div>
                <div className="text-base font-medium">{fullName || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-base font-medium">{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="text-base font-medium">{user.phone || ""}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Created</div>
                <div className="text-base font-medium">{user.created_at ? new Date(user.created_at).toLocaleString() : ""}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Approved</div>
                <div className="text-base font-medium">{user.is_approved ? "Yes" : "No"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Verified</div>
                <div className="text-base font-medium">{user.is_verified ? "Yes" : "No"}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {user.nid_front && (
                <div>
                  <div className="mb-2 text-sm text-gray-500">NID Front</div>
                  <Image
                    src={`/api/proxy-image?path=public/${user.nid_front}`}
                    alt="nid front"
                    width={500}
                    height={300}
                    className="h-auto w-full rounded-md border border-stroke object-contain dark:border-strokedark"
                  />
                </div>
              )}
              {user.nid_back && (
                <div>
                  <div className="mb-2 text-sm text-gray-500">NID Back</div>
                  <Image
                    src={`/api/proxy-image?path=public/${user.nid_back}`}
                    alt="nid back"
                    width={500}
                    height={300}
                    className="h-auto w-full rounded-md border border-stroke object-contain dark:border-strokedark"
                  />
                </div>
              )}
            </div>

            {!user.is_approved && (
              <div className="mt-6">
                <button
                  onClick={approve}
                  disabled={loading}
                  className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {loading ? "Approving..." : "Approve"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default UserDetailsPage;


