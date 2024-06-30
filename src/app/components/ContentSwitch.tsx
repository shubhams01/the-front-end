import { useState } from "react";

const ContentSwitch = ({ onSwitch }) => {
  const [isTrending, setIsTrending] = useState(true);

  const toggleContent = () => {
    setIsTrending((prevIsTrending) => !prevIsTrending);
    onSwitch(!isTrending); // Notify parent component about the switch
  };

  return (
    <div className="flex justify-center items-center my-4 bg-gray-100 rounded-full p-4 transition-all duration-300">
      <button
        className={`mx-2 px-4 py-2 font-bold rounded ${
          isTrending ? "bg-gray-500 text-white ring-offset-2 ring-4 ring-stone-950" : "bg-gray-200 text-stone-700"
        }`}
        onClick={toggleContent}
      >
        TRENDING
      </button>
      <button
        className={`mx-2 px-4 py-2 font-bold rounded ${
          !isTrending ? "bg-gray-500 text-white ring-offset-2 ring-4 ring-stone-950" : "bg-gray-200 text-stone-700"
        }`}
        onClick={toggleContent}
      >
        LATEST
      </button>
    </div>
  );
};

export default ContentSwitch;
