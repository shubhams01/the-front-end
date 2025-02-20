import React from "react";
import LoadingScreen from "../components/Loading/LoadingScreen";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-black to-gray-900 px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-wide leading-tight relative self-center">
        About Us
      </h1>

      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-[1.02]">
        <p className="text-lg text-gray-300 leading-relaxed text-left md:text-center break-words sm:break-normal">
          Welcome to <span className="font-semibold text-white">Gyaanhub</span>,
          where knowledge is a journey, not a destination. Inspired by Socrates’
          profound insight,
          <span className="italic text-gray-400">
            {" "}
            <span className="font-bold text-white">
              “all I know is that I know nothing”
            </span>{" "}
          </span>
          , we embrace intellectual humility and curiosity.
        </p>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed text-left md:text-center break-words sm:break-normal">
          Here, learning is a shared experience. Through open dialogue and
          exchange, we grow together. Our mission is to create a community where
          the pursuit of understanding is both celebrated and supported, where
          every perspective enriches our collective wisdom.
        </p>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed text-left md:text-center break-words sm:break-normal">
          The search for knowledge is infinite, and at{" "}
          <span className="font-semibold text-white">Gyaanhub</span>, we honor
          this endless quest. Join us on this journey where every question leads
          to discovery, and every answer unlocks new horizons.
        </p>
      </div>

      <div className="absolute inset-0 flex justify-center items-center -z-10">
        <div className="h-96 w-96 bg-white/5 blur-3xl rounded-full"></div>
      </div>

      <LoadingScreen />
    </div>
  );
};

export default AboutPage;
