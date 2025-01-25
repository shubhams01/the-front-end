import React from "react";
import LoadingScreen from "../components/Loading/LoadingScreen";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <h1 className="text-3xl font-bold m-2">About Us</h1>
      <div className="max-w-4xl w-full bg-black p-6 rounded-lg shadow-lg overflow-y-auto">
        <p className="text-gray-50">
          Welcome to Gyaanhub a space dedicated to the noble pursuit of knowledge and the collective journey of learning. Inspired by Socrates’ profound insight, “All I know is that I know nothing,” our platform embraces the spirit of intellectual humility and curiosity. Here at Gyaanhub, we acknowledge that the quest for knowledge is an ever-evolving adventure. No matter how much we learn, there is always more to discover, understand, and explore. This awareness drives our mission to create a dynamic environment where knowledge is freely shared, questions are encouraged, and every perspective is valued.
        </p>
        <p className="mt-4 text-gray-50">
          Our platform is designed to be a space where individuals from all walks of life can come together to share their insights, ask questions, and engage in thoughtful discussions. We believe that through the exchange of ideas, we not only expand our own understanding but also contribute to the greater collective wisdom.
        </p>
        <p className="mt-4 text-gray-50">
          While we may not have all the answers, our aim is to provide a space where the pursuit of understanding is both supported and celebrated. By fostering an environment of openness and curiosity, we hope to inspire a community where the search for knowledge becomes a shared journey, driven by the realization that in the grand tapestry of learning, none of us holds all the threads.
        </p>
        <p className="mt-4 text-gray-50">
          Join us as we navigate the vast sea of knowledge, always mindful that the true essence of learning lies in recognizing the limits of our knowledge and embracing the endless possibilities that lie beyond. Welcome to Gyaanhub where the quest for understanding is a collective endeavor, and every question is a step toward discovery.
        </p>
      </div>
      <LoadingScreen />
    </div>
  );
};

export default Page;
