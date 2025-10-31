"use client";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import React from "react";
import { Toaster } from "react-hot-toast";

const Login: React.FC = () => {
  const { register, handleSubmit, onSubmit, errors } = useLoginSubmit();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Toaster position="top-right" />
      <div className="flex h-screen w-full flex-wrap">
        {/* Left side banner */}
        <div className="hidden w-full bg-gradient-to-br from-green-600 to-green-800 xl:flex xl:w-1/2">
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-8">
              <h1 className="mb-4 text-4xl font-bold text-white">
                <span className="text-green-300">Krishi</span>Bazar
              </h1>
              <h2 className="mb-3 text-3xl font-semibold text-white">
                Admin Portal
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-green-50">
              Secure access to your KrishiBazar administration dashboard. Manage
              investments, products, users, and more from one centralized
              platform.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 text-left">
              <div className="flex items-center space-x-3 text-green-50">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-400">
                  <svg
                    className="h-4 w-4 text-green-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>User Management</span>
              </div>
              <div className="flex items-center space-x-3 text-green-50">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-400">
                  <svg
                    className="h-4 w-4 text-green-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Investment Oversight</span>
              </div>
              <div className="flex items-center space-x-3 text-green-50">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-400">
                  <svg
                    className="h-4 w-4 text-green-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Analytics & Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side login form */}
        <div className="flex w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 xl:w-1/2">
          <div className="w-full max-w-md p-6 sm:p-8 xl:p-10">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 sm:p-8">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
                  Welcome Administrator
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Sign in to access the admin dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your admin username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    className="relative block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                  {errors?.username && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {String(errors?.username?.message) ||
                        "Username is required"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="relative block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                  {errors?.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {String(errors?.password?.message) ||
                        "Password is required"}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Log In
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  KrishiBazar Admin Portal © {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
