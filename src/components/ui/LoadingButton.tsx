import React from "react";

interface LoadingButtonProps {
  loading: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  children,
  loadingText,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative h-[42px] overflow-hidden rounded-md px-5 text-sm text-white transition-all disabled:cursor-not-allowed ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "300ms" }}></div>
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "600ms" }}></div>
          </div>
          {loadingText && <span className="ml-2 text-sm">{loadingText}</span>}
        </div>
      )}
      <span className={`${loading ? "opacity-0" : "opacity-100"} transition-opacity`}>
        {children}
      </span>
    </button>
  );
};

export default LoadingButton;