"use client";

import React, { useContext, useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="mx-auto max-w-full md:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-5 rounded-lg bg-white p-4 dark:bg-gray-800 md:flex-row">
        <h4 className="text-2xl font-bold text-primaryPink  dark:text-white md:text-3xl">
          Dashboard
        </h4>
      </div>
    </div>
  );
};

export default Dashboard;
