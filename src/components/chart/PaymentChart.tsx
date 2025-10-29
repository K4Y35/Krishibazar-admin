"use client";

import Image from "next/image";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const PaymentChart: React.FC<any> = ({ chartsData, selectedCurrency }) => {
  const renderLegend = (currency: string) => (
    <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:gap-4">
      <div className="flex items-center gap-2 rounded-md bg-primaryLightBlue px-3 py-1 dark:bg-boxdark-2 sm:px-4 sm:py-2">
        <div className="h-3 w-3 rounded-sm bg-[#8884d8] sm:h-4 sm:w-4" />
        <h2 className="text-sm font-medium text-black dark:text-white sm:text-base">
          Transfer Of {currency}
        </h2>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-primaryLightBlue px-3 py-1 dark:bg-boxdark-2 sm:px-4 sm:py-2">
        <div className="h-3 w-3 rounded-sm bg-[#82ca9d] sm:h-4 sm:w-4" />
        <h2 className="text-sm font-medium text-black dark:text-white sm:text-base">
          Deposit Of {currency}
        </h2>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-primaryLightBlue px-3 py-1 dark:bg-boxdark-2 sm:px-4 sm:py-2">
        <div className="h-3 w-3 rounded-sm bg-[#ffc658] sm:h-4 sm:w-4" />
        <h2 className="text-sm font-medium text-black dark:text-white sm:text-base">
          Withdraw Of {currency}
        </h2>
      </div>
    </div>
  );

  return (
    <div className="mb-10 rounded-md border-2 border-primaryBorder bg-white p-2 dark:border-strokedark dark:bg-boxdark sm:p-4">
      <div className="mb-6 flex items-center justify-between sm:mb-10">
        <div className="flex items-center justify-start gap-2">
          <h4 className="text-lg font-medium text-black dark:text-white sm:text-xl">
            Transaction Chart Of {selectedCurrency}
          </h4>
          <Image
            src="/images/icon/help-circle.png"
            alt="info"
            width={20}
            height={20}
            className="hidden dark:invert sm:block"
          />
        </div>
      </div>
      {renderLegend(selectedCurrency)}
      <div className="w-full overflow-x-auto">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="month" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  color: "#fff",
                  border: "none",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Transfer" stroke="#8884d8" />
              <Line type="monotone" dataKey="Deposit" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Withdraw" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PaymentChart;