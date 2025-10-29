import React, { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa6";

interface ButtonProps {
  text: string;
  action: any;
  type: any;
  className?: string;
  colorCss?: string;
  loading?: boolean;
}

const AppButton: React.FC<ButtonProps> = ({
  text,
  type,
  action,
  className = "",
  colorCss = "",
  loading = false,
}) => {
  const loaderBtn = (
    <span className="flex w-full items-center justify-center gap-2">
      <FaSpinner className="h-4 w-4 animate-spin" />
      <span>Processing...</span>
    </span>
  );
  return (
    <>
      {colorCss ? (
        <button
          type={type}
          onClick={action}
          disabled={loading}
          className={
            "mb-2 rounded-lg bg-gradient-to-r px-5 py-2.5 text-center text-sm font-normal text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 " +
            className +
            " " +
            colorCss
          }
        >
          {loading ? loaderBtn : text}
        </button>
      ) : (
        <button
          type={type}
          onClick={action}
          disabled={loading}
          className={
            "mb-2 rounded-lg bg-[#E9413E] px-5 py-2.5 text-center text-sm font-normal text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-blue-800 " +
            className
          }
        >
          {loading ? loaderBtn : text}
        </button>
      )}
    </>
  );
};

export default AppButton;
