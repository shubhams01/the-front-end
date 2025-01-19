import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import LikedSavedPosts from "@/app/components/User/LikedSavedPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import Logout from "./Logout";
import { getAuthToken } from "@/app/hooks/useLocalStorageAuth";

interface ProfileProps {
  user: {
    id: string;
    profilePhoto: string;
    name: string;
    interests: string[];
    username: string;
    email: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [panelContent, setPanelContent] = useState<string[]>([]);
  const [panelTitle, setPanelTitle] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(
    user?.profilePhoto
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInterestPanelOpen, setIsInterestPanelOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || []
  );
  const [interests, setInterests] = useState<string[]>([]);
  const controls = useAnimation();
  const token = getAuthToken();


  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/interests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch interests");
        }
        const data = await response.json();
        setInterests(data.predefinedInterests);
        setSelectedInterests(data.userInterests);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchInterests();
  }, []);

  useEffect(() => {
    setCurrentImage(user?.profilePhoto);
    controls.start({ rotateY: 360, transition: { duration: 1, delay: 1 } });
  }, [controls, user?.profilePhoto]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    controls.start({ rotateY: isFlipped ? 0 : 180 });
  };

  const openPanel = (title: string) => {
    setPanelTitle(title);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // @ts-ignore
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setCurrentImage(URL.createObjectURL(file));
      setIsEditMode(true);
    }
  };

  const handleImageUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("profilePhoto", selectedImage);
      formData.append("userId", user.id);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/profile-photo`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCurrentImage(currentImage);
        setPreviewImage(null);
        setSelectedImage(null);
        setIsEditMode(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const openInterestPanel = () => {
    setIsInterestPanelOpen(true);
  };

  const closeInterestPanel = () => {
    setIsInterestPanelOpen(false);
  };

  const handleSelectInterest = (interest: string) => {
    setSelectedInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((i) => i !== interest)
        : [...prevInterests, interest]
    );
  };

  const handleSaveInterests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/interests`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      if (!response.ok) {
        throw new Error("Failed to save interests");
      }

      closeInterestPanel();
    } catch (error) {
      console.error("Error saving interests:", error);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-gradient-to-br from-black via-slate-400 to-black relative overflow-hidden">
      <span className="text-3xl font-bold text-white text-center mt-6">
        Profile
      </span>
      <div className="flex flex-col items-center mt-10 lg:mt-16">
        <motion.div
          className="flex flex-col items-center relative"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={controls}
            transition={{ duration: 0.5 }}
            className="relative w-80 h-80"
          >
            <motion.img
              // @ts-ignore
              src={currentImage}
              alt={user?.name}
              className="w-full h-full rounded-2xl object-cover cursor-pointer"
              style={{ rotateY: isFlipped ? 180 : 0 }}
              onClick={handleFlip}
              draggable={false}
            />
            {!isFlipped && (
              <motion.div
                className="absolute top-2 right-2 text-white text-sm rounded-full p-1 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                <FontAwesomeIcon icon={faPencilAlt} />
              </motion.div>
            )}
          </motion.div>
          {isEditMode && (
            <div className="mt-2 flex flex-col items-center">
              <button
                onClick={handleImageUpload}
                className="mt-2 border border-blue-500 text-white py-1 px-4 rounded-full"
              >
                Upload
              </button>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full flex flex-col items-center justify-start p-2 rounded-t-3xl"
          >
            {user && (
              <div className="w-full flex flex-col items-center">
                <p className="text-4xl font-bold text-white text-center">
                  {user?.name}
                </p>
                <p className="text-xl font-bold text-white text-center">
                  @{user?.username}
                </p>
                <div className="flex flex-wrap justify-center mt-2">
                  {!isFlipped ? (
                    <>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="border-2 border-orange-300 text-white font-bold py-2 px-2 rounded-full mr-2"
                        onClick={() => openPanel("Liked")}
                      >
                        Liked Posts
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="border-2 border-orange-300 text-white font-bold py-2 px-2 rounded-full"
                        onClick={() => openPanel("Saved")}
                      >
                        Saved Posts
                      </motion.button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="grid grid-cols-3 gap-2">
                        {selectedInterests.map((interest, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.3 + index * 0.1,
                            }}
                            className="border-2 border-emerald-300 text-white rounded-full px-3 py-1 text-sm font-semibold text-center"
                          >
                            {interest}
                          </motion.span>
                        ))}
                      </div>

                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        whileTap={{ scale: 0.8 }}
                        className="border-2 border-yellow-400 text-white font-bold rounded-full ml-2 mt-2 w-8 h-8 flex items-center justify-center"
                        onClick={openInterestPanel}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
        {isPanelOpen && (
          <LikedSavedPosts
            title={panelTitle}
            postsType={panelTitle}
            closePanel={closePanel}
          />
        )}
        <AnimatePresence>
          {isInterestPanelOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5 }}
              className="fixed bottom-0 w-96 bg-white rounded-t-3xl p-6 shadow-lg z-50"
            >
              <h2 className="text-xl font-bold mb-4 text-slate-700">
                Select your Interests
              </h2>
              <div className="flex flex-wrap justify-center">
                {interests.map((interest, index) => (
                  <motion.button
                    key={index}
                    className={`border-2 ${
                      selectedInterests.includes(interest)
                        ? "border-blue-500"
                        : "border-gray-300"
                    } text-black rounded-full px-3 py-1 m-1 text-sm font-semibold`}
                    onClick={() => handleSelectInterest(interest)}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSaveInterests}
                  className="mt-2 border border-blue-500 text-blue-500 py-1 px-4 rounded-full"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Logout />
      </div>
    </div>
  );
};

export default Profile;
