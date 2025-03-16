import React, { useState } from "react";

const SlideButton = ({ onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div
      className={`w-16 h-8 flex items-center px-1 rounded-full cursor-pointer transition-all duration-300 ${
        isEnabled ? "bg-gray-800" : "bg-gray-300"
      }`}
      onClick={handleToggle} // 🔹 Click to toggle
    >
      {/* White Slider Button with "C" in ON state */}
      <div
        className={`w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
          isEnabled ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {isEnabled ? <span className="text-black font-bold">C</span> : null}
      </div>
    </div>
  );
};

export default SlideButton;

