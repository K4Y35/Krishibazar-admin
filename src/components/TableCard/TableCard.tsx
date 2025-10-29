import { convertKycStatusToText, convertStatusToText } from "@/utils";
import { formatDateTime } from "@/utils/datehelper";
import React from "react";

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface Action {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
}

interface TableCardProps {
  data: any;
  columns: Column[];
  actions?: Action[];
  className?: string;
}

const TableCard = ({
  data,
  columns,
  actions,
  className = "",
}: TableCardProps) => {
  return (
    <div
      className={`mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-boxdark ${className}`}
    >
      <div className="grid grid-cols-2 gap-4">
        {columns.map((column) => (
          <div key={column.key}>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {column.label}
            </p>
            <p className="text-sm  font-medium text-black dark:text-white">
              {column.render
                ? column.render(data[column.key])
                : data[column.key]}
            </p>
          </div>
        ))}
      </div>
      {actions && actions.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {actions.slice(0, 2).map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-primaryPink bg-white px-2 py-2 text-primaryPink transition hover:bg-primaryPink hover:text-white focus:outline-none focus:ring-2 focus:ring-primaryPink"
              >
                {action.icon}
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {actions.slice(2).map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-primaryPink bg-white px-2 py-2 text-primaryPink transition hover:bg-primaryPink hover:text-white focus:outline-none focus:ring-2 focus:ring-primaryPink"
              >
                {action.icon}
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableCard;
