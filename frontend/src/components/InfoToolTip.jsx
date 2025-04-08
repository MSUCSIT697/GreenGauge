// components/InfoTooltip.jsx
import React from "react";

// components/InfoTooltip.jsx
import { Info } from "lucide-react";

export default function InfoTooltip({ message, position = "top" }) {
  return (
    <div className="tooltip" data-tip={message}>
      <div className="rounded-full p-1 hover:bg-base-200 transition cursor-pointer">
        <Info className="w-6 h-6 text-gray-600" />
      </div>
    </div>
  );
}

