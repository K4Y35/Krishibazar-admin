"use client";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
  } = useLoginSubmit();

  return (
    <div className="flex h-screen w-full items-center justify-center">      

      <div className="flex h-screen w-full flex-wrap">
        {/* Left side banner */}
        <div className="hidden w-full bg-[#AC0340] xl:block xl:w-1/2">
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
       

            <h2 className="mb-3 text-3xl font-semibold text-white">
              KrishiBazar Admin Portal
            </h2>
            <p className="max-w-xs text-base text-gray-100">
              Secure access to your KrishiBazar administration dashboard
            </p>
          </div>
        </div>

        {/* Right side login form */}
        <div className="flex w-full flex-col items-start justify-start border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-6 sm:p-12 xl:p-16">
            

              <h2 className="mt-4 text-2xl font-semibold text-black dark:text-white">
                Welcome Administrator
              </h2>
            </div>
            <h2 className="mb-8 text-xl font-bold text-[#D61459] dark:text-white">
              Please log in to continue
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="mb-4 w-full">
                <label className="mb-2 block text-base font-medium text-black dark:text-white">
                  Admin Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your admin username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-4 text-black outline-none focus:border-[#E9413E] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors?.username && (
                  <p className="mt-2 text-sm text-red-500">
                    {String(errors?.username?.message) ||
                      "Username is required"}
                  </p>
                )}
              </div>

              <div className="mb-6 w-full">
                <label className="mb-2 block text-base font-medium text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full rounded-lg border border-stroke bg-transparent px-6 py-4 text-black outline-none focus:border-[#E9413E] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors?.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {String(errors?.password?.message) ||
                      "Password is required"}
                  </p>
                )}
              </div>

              <div className="mb-5 mt-10 w-full">
                <input
                  type="submit"
                  value="Log In"
                  className="w-full cursor-pointer rounded-md border border-[#AC0340] bg-[#AC0340] p-3 text-white transition hover:bg-[#D61459]"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Login;
