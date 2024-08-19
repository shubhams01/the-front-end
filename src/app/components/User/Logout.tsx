import React, { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import ConfirmationModal from "@/app/components/Modal/ConfirmationModal";

const Logout: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // State for confirmation modal
  const controls = useAnimation();
  const router = useRouter();
  const { logout } = useAuthStore();

  const toggleSettingsPanel = () => {
    setIsSettingsOpen(!isSettingsOpen);
    controls.start({ rotate: 360, transition: { duration: 0.5 } }).then(() => {
      controls.set({ rotate: 0 });
    });
  };

  const handleGestureEnd = (event: MouseEvent | TouchEvent, info: any) => {
    if (info.velocity.y > 100 && isSettingsOpen) {
      setIsSettingsOpen(false);
    }
  };

  const handleLogout = () => {
    setIsConfirmationOpen(true); // Open confirmation modal
  };

  const confirmLogout = () => {
    console.log("User logged out");
    logout();
    router.push("/");
  };

  const cancelLogout = () => {
    setIsConfirmationOpen(false); // Close confirmation modal
  };

  return (
    <>
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-white p-4 rounded-t-lg shadow-lg"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleGestureEnd}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-800 text-sm font-medium mb-4">Settings</p>
              <button
                onClick={handleLogout}
                className="absolute bottom-4 right-4 bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      <motion.button
        onClick={handleLogout}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-2 right-2 border-2 border-red-500 text-white text-sm font-bold py-2 px-2 rounded-full flex items-center"
      >
        <motion.div
          animate={{ x: isConfirmationOpen ? [0, -5, 5, 0] : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        </motion.div>
        Logout
      </motion.button>
    </>
  );
};

export default Logout;
