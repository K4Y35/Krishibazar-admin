import React, { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa6";

interface ButtonProps {
  text: string;
  action: any;
  disabled?: boolean;
}

const CancelButtonOutlined: React.FC<ButtonProps> = ({
  text = "Cancel",
  action = null,
  disabled = false,
}) => {
  return (
    <>
      <button
        type={"button"}
        onClick={action}
        disabled={disabled}
        className={
          "focus:ring-charcoal-300 dark:focus:ring-charcoal-800 mb-2 mr-2 w-full rounded-md border-[1.5px] border-[#D5145A] bg-gradient-to-r px-5 py-3 text-center  text-sm font-medium text-[#D5145A] hover:bg-gradient-to-br focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        }
      >
        {text}
      </button>
    </>
  );
};

export default CancelButtonOutlined;
