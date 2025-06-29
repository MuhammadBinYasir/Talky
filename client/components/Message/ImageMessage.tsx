import React from "react";

const ImageMessage = ({
  image,
  text,
  type,
}: {
  text?: string;
  type: "Send" | "Receive";
  image: string;
}) => {
  return (
    <div className={`flex ${type == "Send" ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          type == "Send" ? "bg-sky-600 text-white" : "bg-white text-gray-800"
        } rounded-xl shadow-sm max-w-xs overflow-hidden`}
      >
        <div className="w-full object-cover relative">
            <img src={image} className="w-full rounded-t-xl object-cover" />
        <span
          className={`absolute bottom-2 text-white text-shadow-slate-500 right-2 text-[10px] text-right block mt-2`}
        >
          6:03 AM
        </span>
        </div>
        {text &&<p className="text-sm p-4">{text}</p> }
      </div>
    </div>
  );
};

export default ImageMessage;
