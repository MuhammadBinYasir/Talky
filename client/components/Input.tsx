import React from "react";

type InputProps = {
  Icon: React.ElementType;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const Input = ({ Icon, inputProps }: InputProps) => {
  return (
    <div
      className={`w-full h-12 rounded-lg border flex items-center gap-2 px-3 bg-white shadow-sm transition-all
    ${inputProps?.value ? "border-gray-400" : "border-gray-200"}
    focus-within:ring-2  focus-within:ring-blue-500 focus-within:border-blue-500
  ${inputProps && inputProps.disabled && "bg-[#f5f5f5!important]"}`}
    >
      <Icon
        className={`w-5 h-5 transition-all
      ${inputProps?.value ? "text-gray-500" : "text-gray-300"}
    `}
      />
      <input
        className="flex-1 h-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
        {...inputProps}
        autoComplete="off"
      />
    </div>
  );
};

export default Input;
