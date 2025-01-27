import React from "react";
import LoadingScreen from "../components/Loading/LoadingScreen";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-gray-900 to-black p-6">
      <h1 className="text-3xl font-extrabold text-white text-center mb-8 tracking-wide leading-tight">
        About Us
      </h1>
      <div className="max-w-3xl w-full bg-gray-800 p-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
        <p className="text-lg text-gray-300 leading-relaxed">
          Welcome to <span className="font-semibold text-indigo-500">Gyaanhub</span>, where knowledge is a journey, not a destination. 
          Inspired by Socrates’ profound insight, “All I know is that I know nothing,” we embrace intellectual humility and curiosity.
        </p>
        <p className="mt-6 text-lg text-gray-300 leading-relaxed">
          Here, learning is a shared experience. We believe that through open dialogue and exchange, we grow together. Our mission is to create a community where the pursuit of understanding is both celebrated and supported, where every perspective enriches our collective wisdom.
        </p>
        <p className="mt-6 text-lg text-gray-300 leading-relaxed">
          The search for knowledge is infinite, and at <span className="font-semibold text-indigo-500">Gyaanhub</span>, we honor this endless quest. Join us as we embark on a journey where every question is a step toward discovery, and every answer opens new horizons.
        </p>
      </div>
      <LoadingScreen />
    </div>
  );
};

export default page;
