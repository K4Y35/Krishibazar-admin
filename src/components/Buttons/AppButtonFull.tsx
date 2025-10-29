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

const AppButtonFull: React.FC<ButtonProps> = ({
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
            "mb-2 cursor-pointer rounded-lg bg-gradient-to-r px-5 py-2.5 text-center text-sm font-normal text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50" +
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
            "focus:ring-charcoal-300 dark:focus:ring-charcoal-800 mb-2 mr-2 w-full cursor-pointer rounded-md border bg-[#D5145A] bg-gradient-to-r px-5 py-3  text-center text-sm font-normal text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50" +
            className
          }
        >
          {loading ? loaderBtn : text}
        </button>
      )}
    </>
  );
};

export default AppButtonFull;
