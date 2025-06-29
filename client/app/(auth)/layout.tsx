import { MessageCircle } from "lucide-react";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center p-2">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-[#004b75] p-3 rounded-xl">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default layout;
