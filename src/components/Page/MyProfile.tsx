"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DefaultLayout from "../Layouts/DefaultLayout";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const MyProfile = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    // Prefill with dummy data for testing
    reset({
      name: "John Doe",
      username: "superadmin",
      email: "admin@example.com",
    });
  }, [reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const updateMyProfile = async (values: any) => {
    console.log("Dummy profile submit", values);
    toast.success("Profile updated (dummy)");
  };

  return (
    <DefaultLayout>
      <div className="">
        <div className="rounded-lg bg-white dark:border-strokedark dark:bg-boxdark">
          <div className="px-6.5 py-4 dark:border-strokedark">
            <h2 className="text-2xl font-bold text-primaryPink dark:text-white">
              My Profile
            </h2>
          
          </div>

          <form onSubmit={handleSubmit(updateMyProfile)}>
            <div className="p-6.5">
              

              <div className="flex flex-col gap-8 md:flex-row">
                <div className="w-full md:w-1/3">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black dark:text-white">
                      Profile Picture
                    </h3>
                    
                    <div className="relative group">
                      <div className="overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-primary transition-all duration-200">
                        {preview ? (
                          <Image
                            src={preview}
                            onClick={() => document.getElementById("file")?.click()}
                            width={400}
                            height={400}
                            alt="Profile Preview"
                            className="w-full h-auto object-cover cursor-pointer aspect-square"
                          />
                        ) : (
                          <div 
                            onClick={() => document.getElementById("file")?.click()}
                            className="flex flex-col items-center justify-center p-8 cursor-pointer aspect-square"
                          >
                            <div className="w-20 h-20 mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-400 dark:text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </div>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                              Click to upload a photo
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => document.getElementById("file")?.click()}
                        className="mt-2 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
                      >
                        Change Photo
                      </button>

                      <input
                        type="file"
                        accept="image/*"
                        id="file"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <h3 className="text-lg font-medium text-black dark:text-white">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-black outline-none transition focus:border-primary focus:shadow-input dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {errors?.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {String(errors?.name?.message)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                        Username
                      </label>
                      <input
                        type="text"
                        disabled={true}
                        {...register("username", { required: "Username is required" })}
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-black outline-none transition focus:border-primary focus:shadow-input dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary disabled:bg-gray-100"
                      />
                      {errors?.username && (
                        <p className="mt-1 text-xs text-red-500">
                          {String(errors?.username?.message)}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled={true}
                        {...register("email", { required: "Email is required" })}
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-black outline-none transition focus:border-primary focus:shadow-input dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary disabled:bg-gray-100"
                      />
                      {errors?.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {String(errors?.email?.message)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 ">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#D61459] via-[#AC0340] to-[#AC0340] px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    fill="currentColor"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M433.9 129.9l-83.9-83.9A48 48 0 0 0 316.1 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V163.9a48 48 0 0 0 -14.1-33.9zM224 416c-35.3 0-64-28.7-64-64 0-35.3 28.7-64 64-64s64 28.7 64 64c0 35.3-28.7 64-64 64zm96-304.5V212c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12V108c0-6.6 5.4-12 12-12h228.5c3.2 0 6.2 1.3 8.5 3.5l3.5 3.5A12 12 0 0 1 320 111.5z" />
                  </svg>
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MyProfile;