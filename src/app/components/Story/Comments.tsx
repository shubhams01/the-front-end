import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  XMarkIcon,
  ChevronDoubleRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import { getAuthToken } from "@/app/hooks/useLocalStorageAuth";

interface CommentsSectionProps {
  userId: string;
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const arrowVariants = {
  initial: { rotate: -90 },
  animate: { rotate: 0 },
  exit: { rotate: -90 },
  transition: { type: "tween", duration: 0.5 },
};

const optionsMenuVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { type: "tween", duration: 0.5 },
};

const commentVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { type: "spring", stiffness: 500, damping: 30 },
};

const CommentsSection: React.FC<CommentsSectionProps> = ({
  userId,
  postId,
  isOpen,
  onClose,
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editedCommentId, setEditedCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [menuVisible, setMenuVisible] = useState<number | null>(null);

  const addCommentInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement | null>(null);

  const token = getAuthToken();

  useEffect(() => {
    if (isOpen && addCommentInputRef.current) {
      addCommentInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/comments/article/${postId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId, token]);

  useEffect(() => {
    if (editedCommentId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editedCommentId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setMenuVisible(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() !== "") {
      try {
        const response = await fetch("http://localhost:1337/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: userId,
            articleId: postId,
            content: newComment,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        const newCommentObject = await response.json();
        setNewComment("");
        console.log("addComment ", newCommentObject);
        setComments([newCommentObject, ...comments]);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleEditMenu = (id: number, content: string) => {
    setEditedCommentId(id);
    setEditCommentText(content);
    setMenuVisible(null);
  };

  const handleEditComment = async (id: number, content: string) => {
    try {
      const response = await fetch(`http://localhost:1337/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }

      const updatedComment = await response.json();
      setEditedCommentId(null);
      setEditCommentText("");
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleSaveEdit = () => {
    if (editedCommentId !== null && editCommentText.trim() !== "") {
      handleEditComment(editedCommentId, editCommentText);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:1337/api/comments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prevComments) => prevComments.filter((c) => c.id !== id));
      setMenuVisible(null); // Close options menu
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReportComment = (id: number) => {
    // Implement report functionality here
    console.log(`Report comment with id: ${id}`);
    setMenuVisible(null); // Close options menu
  };

  const handleOptionsClick = (id: number) => {
    setMenuVisible(menuVisible === id ? null : id);
  };

  // Utility functions
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const getColorFromUserId = (userId) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    const index = parseInt(userId, 10) % colors.length;
    return colors[index];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "50%" }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", duration: 0.5 }}
          className="fixed inset-0 bg-white p-4 rounded-t-lg z-50 w-full max-w-3xl mx-auto"
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">Comments</h2>
              <button
                onClick={onClose}
                className="text-slate-700 text-lg font-bold"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            {/* Add Comment Section */}
            <div className="relative mb-4 border-b border-gray-300">
              <input
                ref={addCommentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment"
                className="w-full p-2 text-black resize-none focus:outline-none"
              />
              <div className="absolute top-2 right-2 flex items-center">
                <motion.button
                  onClick={handleAddComment}
                  className={`ml-2 p-1 rounded-lg ${
                    newComment.trim() === ""
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                  disabled={newComment.trim() === ""}
                  variants={arrowVariants}
                  initial="initial"
                  animate={isOpen ? "animate" : "exit"}
                  transition="transition"
                >
                  <ChevronDoubleRightIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            {/* Comments List */}
            <div className="flex flex-col overflow-y-auto flex-grow max-h-48 lg:max-h-60 mb-4">
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="border-b border-gray-200 py-2 relative"
                    variants={commentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="flex items-start space-x-2">
                      <span
                        className={`rounded-full w-6 h-6 flex items-center justify-center text-white ${getColorFromUserId(
                          comment.user.id
                        )}`}
                      >
                        {capitalizeFirstLetter(comment.user.username.charAt(0))}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-black">
                          {comment.user.username}
                        </span>

                        <div>
                          {editedCommentId === comment.id ? (
                            <div>
                              <input
                                ref={editInputRef}
                                value={editCommentText}
                                onChange={(e) =>
                                  setEditCommentText(e.target.value)
                                }
                                className="w-full p-2 border-b border-gray-300 text-black resize-none focus:outline-none"
                              />
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={handleSaveEdit}
                                  className="bg-blue-500 text-white p-1 text-xs rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditedCommentId(null)}
                                  className="bg-gray-300 text-gray-700 p-1 text-xs rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-600">{comment.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {comment.user.id === userId && (
                      <div
                        className="absolute top-2 right-0"
                        onClick={() => handleOptionsClick(comment.id)}
                      >
                        <button className="text-gray-700">
                          <EllipsisVerticalIcon className="w-6 h-6" />
                        </button>
                        {menuVisible === comment.id && (
                          <motion.div
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={optionsMenuVariants}
                            className="absolute right-5 -top-5 bg-white shadow-md rounded mt-2"
                          >
                            <button
                              onClick={() =>
                                handleEditMenu(comment.id, comment.content)
                              }
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No comments yet. Be the first one to add!
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentsSection;
