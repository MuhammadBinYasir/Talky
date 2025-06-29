import React from "react";

type InputProps = {
  Icon: React.ElementType;
  inputProps?: React.InputHTMLAttributes<HTMLTextAreaElement>;
};

const TextArea = ({ Icon, inputProps }: InputProps) => {
  return (
    <div
      className={`w-full h-20 rounded-lg border flex gap-2 p-3 bg-white shadow-sm transition-all
    ${inputProps?.value ? "border-gray-400" : "border-gray-200"}
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
  `}
    >
      <Icon
        className={`w-5 h-5 transition-all
      ${inputProps?.value ? "text-gray-500" : "text-gray-300"}
    `}
      />
      <textarea
        className="flex-1 resize-none h-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
        {...inputProps}
        autoComplete="off"></textarea>
    </div>
  );
};

export default TextArea

