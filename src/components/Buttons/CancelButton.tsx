import React, { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa6";

interface ButtonProps {
  text: string;
  action: any;
}

const CancelButton: React.FC<ButtonProps> = ({ text = 'Cancel', action = null }) => {
  return (
  <>
   <button
      type={"button"}
      onClick={action}
      className={"mb-2 rounded-lg bg-gradient-to-r bg-[#808080] px-5 py-2.5 text-center text-sm font-normal text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-charcoal-300 dark:focus:ring-charcoal-800 mr-2"}
    >
      {text}
    </button>
  </>
  );
};

export default CancelButton;
