import Link from "next/link";
import React from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral"; // Optional trend indicator
  trendPercentage?: string; // Optional custom trend percentage
  description?: string; // Optional additional description
  pageUrl: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  icon,
  trend = "neutral",
  trendPercentage,
  description = "vs last period",
  pageUrl
}) => {
  const trendColors = {
    up: "text-meta-3 dark:text-meta-3",
    down: "text-red DEFAULT dark:text-red",
    neutral: "text-bodydark dark:text-bodydark1",
  };

  const trendBgColors = {
    up: "bg-meta-2 dark:bg-meta-4/30",
    down: "bg-red-50 dark:bg-red-900/20",
    neutral: "bg-primaryLightPink dark:bg-primaryGray/30",
  };

  const trendIcons = {
    up: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    down: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    neutral: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <Link href={pageUrl}>
      <div className="relative overflow-hidden rounded-lg border border-stroke bg-white p-6 shadow-default transition-shadow duration-300 hover:shadow-card dark:border-strokedark dark:bg-boxdark h-52 flex items-center justify-start">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            {/* Icon with dynamic background based on trend */}
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg ${trendBgColors[trend]}`}
            >
              <div className="text-xl text-primaryPink dark:text-white">
                {icon}
              </div>
            </div>

            {/* Trend indicator (small version) */}
            {trend !== "neutral" && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${trendBgColors[trend]} ${trendColors[trend]}`}
              >
                {trendIcons[trend]}
                <span className="ml-1">
                  {trendPercentage || (trend === "up" ? "12%" : "5%")}
                </span>
              </span>
            )}
          </div>

          {/* Content */}
          <div>
            <h4 className="mb-1 text-sm font-medium text-body dark:text-bodydark1">
              {title}
            </h4>
            <p className="mb-2 text-2xl font-bold text-black dark:text-white">
              {total}
            </p>
          </div>

          {/* Optional trend indicator (expanded version) */}
          {trend !== "neutral" && (
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${trendColors[trend]} flex items-center`}
              >
                {trendIcons[trend]}
                <span className="ml-1">
                  {trendPercentage || (trend === "up" ? "12%" : "5%")}
                </span>
              </span>
              {description && (
                <span className="ml-2 text-xs text-bodydark dark:text-bodydark2">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardDataStats;
