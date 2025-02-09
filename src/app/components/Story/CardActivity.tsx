import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LightBulbIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BookmarkIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { useModal } from "@/app/context/ModalContext";
import { useAuthStore } from "@/app/store/authStore";
import { getAuthToken } from "@/app/hooks/useLocalStorageAuth";
import CommentsSection from "./Comments";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { formatNumber } from "@/app/utils/numberFormatter";

const api = {
  like: async (userId, articleId, token) => {
    return fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user: userId, article: articleId }),
    }).then((res) => res.json());
  },
  bookmark: async (userId, articleId, token) => {
    return fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/saves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user: userId, article: articleId }),
    }).then((res) => res.json());
  },
  fetchArticleActivities: async (articleId, token) => {
    return fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles/${articleId}/activities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  },
};

const CardActivity = ({
  postId,
  initialLikes,
  initialComments,
  setIsCommentsOpenDragScroll,
  closeShareOpenOnDragOrScroll,
  handleDoubleClick
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const { isLoginOpen, isRegisterOpen, toggleLoginModal, toggleRegisterModal } =
    useModal();
  const token = getAuthToken();
  const userId = useAuthStore.getState().getUserId();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('alreadyLiked', isLiked);
    if (handleDoubleClick) {
      handleDoubleClick(handleBulbClick);
    }
  }, [handleDoubleClick]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchArticleActivities = async () => {
        try {
          const activities = await api.fetchArticleActivities(postId, token);
          setIsLiked(activities.isLiked);
          setIsBookmarked(activities.isSaved);
          setLikes(activities.likesCount);
          setCommentsCount(activities.commentsCount);
        } catch (error) {
          console.error("Error fetching article activities:", error);
        }
      };

      fetchArticleActivities();
    }
  }, [isLoggedIn, postId, token]);

  const handleBulbClick = async () => {
    if (isLoginOpen) {
      toggleLoginModal();
    }
    if (isRegisterOpen) {
      toggleRegisterModal();
    }
    if (isShareOpen) {
      setIsShareOpen(!isShareOpen);
    }
    if (!isLoggedIn) {
      toggleLoginModal();
      return;
    }
    try {
      await api.like(userId, postId, token);
      setLikes((prev) => prev + (isLiked ? -1 : 1));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentClick = () => {
    if (isLoginOpen) {
      toggleLoginModal();
    }
    if (isRegisterOpen) {
      toggleRegisterModal();
    }
    if (isShareOpen) {
      setIsShareOpen(!isShareOpen);
    }
    if (!isLoggedIn) {
      toggleLoginModal();
      return;
    }
    setIsCommentsOpen(true);
    setIsCommentsOpenDragScroll(true);
  };

  const handleBookmarkClick = async () => {
    if (isLoginOpen) {
      toggleLoginModal();
    }
    if (isRegisterOpen) {
      toggleRegisterModal();
    }
    if (isShareOpen) {
      setIsShareOpen(!isShareOpen);
    }
    if (!isLoggedIn) {
      toggleLoginModal();
      return;
    }
    try {
      await api.bookmark(userId, postId, token);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const handleShareClick = () => {
    if (isLoginOpen) {
      toggleLoginModal();
    }
    if (isRegisterOpen) {
      toggleRegisterModal();
    }
    setIsShareOpen(!isShareOpen);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShareOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isShareOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const shareUrl = window.location.href;

  return (
    <>
      <motion.div
        className="absolute bottom-2 right-2 flex flex-col items-center z-20"
        initial={false}
        animate={{ y: isExpanded ? -5 : 0 }}
        transition={{ type: "tween", duration: 0.5 }}
      >
        <motion.button
          onClick={handleBulbClick}
          className="relative z-20 flex flex-col items-center"
          animate={{
            scale: [1, 1.2, 1],
            color: isLiked
              ? ["#ffffff", "#ffd700", "#ffd700"]
              : ["#ffd700", "#ffffff", "#ffffff"],
            transition: { duration: 0.5 },
            rotate: "-45deg",
          }}
        >
          <LightBulbIcon className="h-7 w-7 lg:h-8 lg:w-8" />
        </motion.button>
        {likes > 0 && (
          <span
            className={`${
              isLiked ? "text-yellow-400" : "text-white"
            } text-xs lg:text-xl`}
          >
            {formatNumber(likes)}
          </span>
        )}
        {isExpanded && (
          <motion.div
            className="absolute bottom-full right-0 flex flex-col items-center rounded-lg p-1 space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex flex-col items-center">
              <button
                className="flex items-center justify-center"
                onClick={handleCommentClick}
              >
                <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 lg:h-8 lg:w-8" />
              </button>
              {commentsCount > 0 && (
                <span className="text-white text-xs lg:text-xl">
                  {formatNumber(commentsCount)}
                </span>
              )}
            </div>
            <button
              className="flex items-center justify-center"
              onClick={handleBookmarkClick}
            >
              <BookmarkIcon
                className={`h-6 w-6 lg:h-8 lg:w-8 ${
                  isBookmarked ? "text-lime-500" : "text-white"
                }`}
              />
            </button>
            <button
              className="flex items-center justify-center"
              onClick={handleShareClick}
            >
              <ShareIcon className="h-6 w-6 lg:h-8 lg:w-8" />
            </button>
            {isShareOpen && (
              <motion.div
                className="absolute bottom-full right-0 flex flex-col items-center mb-2 space-y-2 p-2 bg-white rounded-lg shadow-lg z-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <FacebookShareButton url={shareUrl}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <WhatsappShareButton url={shareUrl}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <motion.button
                  onClick={handleCopyLink}
                  className="mt-2 py-1 px-2 bg-blue-500 text-xs text-white rounded-lg"
                  initial={{ scale: 1 }}
                  animate={isCopied ? { scale: 0.9 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isCopied ? "Copied!" : "Copy Link"}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
      {isCommentsOpen && (
        <CommentsSection
          // @ts-ignore
          userId={userId}
          postId={postId}
          isOpen={isCommentsOpen}
          onClose={() =>
            // @ts-ignore
            setIsCommentsOpen(false) || setIsCommentsOpenDragScroll(false)
          }
        />
      )}
    </>
  );
};

export default CardActivity;
