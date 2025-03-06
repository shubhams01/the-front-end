"use client";

import React, { useState, useEffect, useRef, Key } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  useMotionValueEvent,
  useDragControls,
  AnimatePresence,
} from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import CardActivity from "@/app/components/Story/CardActivity";
import LoginRegisterModal from "@/app/components/Modal/LoginRegisterModal";
import { useModal } from "@/app/context/ModalContext";
import { Blurhash } from "react-blurhash";
import { useAuthStore } from "@/app/store/authStore";

interface Section {
  description: Key | null | undefined;
  blurhash: string;
  nestedSections: Array<{
    imageUrl: string;
    description: string;
    blurhash: string;
  }>;
}

interface Details {
  sections: Section[];
}

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  imageUrl: string;
}

const CardDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  //   const { id } = params;

  const controls = useAnimation();
  const overlayControls = useAnimation();
  const dragControls = useDragControls();

  const { scrollYProgress } = useScroll();

  const [details, setDetails] = useState<Details>();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentNestedPage, setCurrentNestedPage] = useState(0);
  const [isFetchingNextSection, setIsFetchingNextSection] = useState(false);
  const [nextSections, setNextSections] = useState([]);
  const [nextSectionIndex, setNextSectionIndex] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [closeShare, setCloseShare] = useState(false);

  const segments = pathname.split("-");
  const _id = segments[segments.length - 1];
  const [articleId, setArticleId] = useState(_id);

  const nextSection = searchParams.get("section");
  const { isLoginOpen, setIsLoginOpen, toggleLoginModal } = useModal();
  const { isLoggedIn } = useAuthStore();

  const [sectionImageLoaded, setSectionImageLoaded] = useState(false);
  const [nestedSectionImageLoaded, setNestedSectionImageLoaded] =
    useState(false);

  const bulbClickRef = useRef<(() => void) | null>(null);

  const [showLike, setShowLike] = useState(false);

  const handleDoubleClick = (bulbClickFn) => {
    bulbClickRef.current = bulbClickFn;
  };

  const handleLike = () => {
    setShowLike(true);
    setTimeout(() => setShowLike(false), 1000);
  };

  useEffect(() => {
    console.log("cardDetails ", pathname, articleId, nextSection);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("ScrollY ", latest);
  });

  const handleDragEnd = (event: any, info: any, sectionIndex: number) => {
    console.log("dragend ", info.offset.x, currentNestedPage);
    if (info.offset.x > 100 && currentNestedPage > 0) {
      // Swiped right
      setCurrentNestedPage(currentNestedPage - 1);
      console.log("dragRight ", info.offset.x, currentNestedPage);
    } else if (
      info.offset.x < -100 &&
      currentNestedPage <
        // @ts-ignore
        details.sections[sectionIndex].nestedSections.length - 1
    ) {
      // Swiped left
      setCurrentNestedPage(currentNestedPage + 1);
      console.log("dragLeft ", info.offset.x, currentNestedPage);
    }
  };

  const handleDrag = async (event: any, info: { offset: { y: number } }) => {
    if (isCommentsOpen) return; // Prevent scrolling/swiping if comments are open
    setCloseShare(true);
    // @ts-ignore
    if (info.offset.y < -100 && currentPage < details?.sections.length - 1) {
      setCurrentPage(currentPage + 1);
      setCurrentNestedPage(0);
    } else if (info.offset.y > 100 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setCurrentNestedPage(0);
    } else if (
      info.offset.y < -100 &&
      // @ts-ignore
      currentPage === details?.sections.length - 1
    ) {
      await fetchNextSection();
    }
    console.log(
      `${info.offset.y < 0 ? "dragUp " : "dragDown"}`,
      info.offset.y,
      currentPage,
      details?.sections.length,
      // @ts-ignore
      details?.sections.length - 1 < currentPage
    );
  };

  const handleScroll = async (event: { deltaY: number }) => {
    if (isCommentsOpen) return; // Prevent scrolling/swiping if comments are open
    setCloseShare(true);
    const direction = event.deltaY > 0 ? "down" : "up";
    // @ts-ignore
    if (direction === "down" && currentPage < details.sections.length - 1) {
      setCurrentNestedPage(0);
      setCurrentPage(currentPage + 1);
    } else if (direction === "up" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setCurrentNestedPage(0);
    } else if (
      direction === "down" &&
      // @ts-ignore
      currentPage === details.sections.length - 1
    ) {
      await fetchNextSection();
    }
  };

  useEffect(() => {
    const fetchNextSectionData = async () => {
      try {
        let response;
        if (nextSection === "explore") {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/explore`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
              },
            }
          );
        } else if (nextSection === "trending" || nextSection === "latest") {
          if (nextSection === "trending") {
            response = await fetch(
              `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles/trending`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
                },
              }
            );
          } else {
            response = await fetch(
              `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles/latest`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
                },
              }
            );
          }
        } else {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/explore`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
              },
            }
          );
        }
        if (!response.ok) {
          throw new Error("Failed to fetch next section");
        }
        const responseData = await response.json();
        const filteredData = responseData.filter(
          (section: { id: any }) => section.id !== Number(articleId)
        );
        setNextSections(filteredData);
        console.log("Next Sections:", filteredData, articleId);
      } catch (error) {
        console.error("Error fetching next section:", error);
      }
    };
    fetchNextSectionData();
  }, []);

  const fetchNextSection = async () => {
    // setIsFetchingNextSection(true);
    await overlayControls.start({ y: 0 });

    setCurrentPage(0);
    // @ts-ignore
    const sections = nextSections[nextSectionIndex]?.sections?.map(
      (section: {
        SectionImage: { formats: { large: { url: any } } };
        SectionDescription: any;
        SectionImageBlurhash: any;
        NestedSections: any[];
      }) => {
        const sectionObject = {
          imageUrl:
            "https://api.gyaanhub.io" +
            section?.SectionImage?.formats?.large?.url,
          description: section.SectionDescription,
          blurhash: section?.SectionImageBlurhash,
          nestedSections: section.NestedSections
            ? section.NestedSections.map(
                (nested: {
                  NestedSectionImage: { formats: { large: { url: any } } };
                  NestedSectionDescription: any;
                  NestedSectionImageBlurhash: any;
                }) => ({
                  imageUrl:
                    "https://api.gyaanhub.io" +
                    nested?.NestedSectionImage?.formats?.large?.url,
                  description: nested.NestedSectionDescription,
                  blurhash: nested.NestedSectionImageBlurhash,
                })
              )
            : [],
        };
        return sectionObject;
      }
    );

    setDetails((prevDetails) => {
      const updatedDetails = {
        // @ts-ignore
        id: nextSections[nextSectionIndex]?.id,
        // @ts-ignore
        title: nextSections[nextSectionIndex]?.Title,
        // @ts-ignore
        slug: nextSections[nextSectionIndex]?.Slug,
        // @ts-ignore
        sections: sections,
        // @ts-ignore
        likes: nextSections[nextSectionIndex]?.likesCount,
        // @ts-ignore
        comments: nextSections[nextSectionIndex]?.commentsCount,
      };
      console.log(
        "Updated Details inside state update function:",
        updatedDetails
      );
      return updatedDetails;
    });

    if (nextSectionIndex < nextSections.length - 1) {
      setNextSectionIndex(nextSectionIndex + 1);
      console.log(
        "nextSectionIndex ",
        nextSectionIndex,
        nextSections[nextSectionIndex],
        pathname
      );
    }

    // Updating URL
    const nextSection = nextSections[nextSectionIndex];
    if (nextSection) {
      // @ts-ignore

      const categorySlug = nextSection.category?.Slug;
      // @ts-ignore
      const sectionSlug = nextSection?.Slug;
      // @ts-ignore
      const sectionId = nextSection?.id;

      const newUrl = `/${categorySlug}/${sectionSlug}-${sectionId}`;
      window.history.pushState({ urlPath: `/${categorySlug}` }, "", newUrl);
      console.log("updatedUrl ", nextSection);
    } else {
      console.error("Some properties are undefined:", nextSection);
    }

    await overlayControls.start({ y: "-100%" });
    // setIsFetchingNextSection(false);
  };

  useEffect(() => {
    setDetails(details);
    console.log("Updated Details: ", details);
  }, [details]);

  const handleArrowUpClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setCurrentNestedPage(0);
    }
  };

  const handleArrowDownClick = () => {
    // @ts-ignore
    if (currentPage < details.sections.length - 1) {
      setCurrentPage(currentPage + 1);
      setCurrentNestedPage(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/article/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Articles");
        }
        const data = await response.json();
        console.log("articleDetails ", data);

        const sections = data?.sections.map(
          (section: {
            SectionImageBlurhash: any;
            SectionImage: { formats: { large: { url: any } } };
            SectionDescription: any;
            NestedSections: any[];
          }) => {
            const sectionObject = {
              imageUrl:
                "https://api.gyaanhub.io" +
                section?.SectionImage?.formats?.large.url,
              description: section?.SectionDescription,
              blurhash: section?.SectionImageBlurhash,
              nestedSections: section?.NestedSections
                ? section.NestedSections.map(
                    (nested: {
                      NestedSectionImage: { formats: { large: { url: any } } };
                      NestedSectionDescription: any;
                      NestedSectionImageBlurhash: any;
                    }) => ({
                      imageUrl:
                        "https://api.gyaanhub.io" +
                        nested?.NestedSectionImage?.formats?.large?.url,
                      description: nested?.NestedSectionDescription,
                      blurhash: nested.NestedSectionImageBlurhash,
                    })
                  )
                : [],
            };
            return sectionObject;
          }
        );

        const article = {
          id: data?.id,
          title: data?.Title,
          sections: sections,
          likes: data?.likesCount,
          comments: data?.commentsCount,
        };

        setDetails(article);
        console.log("article ", article);
      } catch (error) {
        console.error("Error fetching Articles:", error);
      }
    };

    fetchData();
  }, [articleId]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        router.push("/");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center scroll-smooth h-dvh overflow-y-hidden overflow-x-hidden"
      onWheel={handleScroll}
      onDoubleClick={() => {
        if (bulbClickRef.current) {
          handleLike();
          bulbClickRef.current();
        }
      }}
    >
      {isLoggedIn && showLike && (
        <motion.div
          className="absolute flex items-center justify-center z-10"
          initial={{ scale: 0, opacity: 0, rotate: 0, color: "#ffffff" }}
          animate={{ scale: 1.5, opacity: 0.5, rotate: -35, color: "#FFD700" }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <LightBulbIcon className="w-24 h-24" />
        </motion.div>
      )}
      <motion.div className="h-dvh w-screen snap-start overflow-y-hidden overflow-x-hidden">
        {details?.sections && (
          <AnimatePresence mode="wait">
            <motion.div
              className="items-center justify-center mx-auto w-full md:w-1/3 lg:w-1/3 h-dvh rounded-xl snap-center relative"
              animate={controls}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 1.5 }}
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragTransition={{ bounceStiffness: 200, bounceDamping: 25 }}
              onDragEnd={(event: any, info: any) => handleDrag(event, info)}
            >
              <motion.div className="relative h-full w-full p-2">
                {!sectionImageLoaded && (
                  <Blurhash
                    hash={
                      details?.sections[currentPage]?.blurhash ||
                      "LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                    }
                    width={"100%"}
                    height={"100%"}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                    className="absolute inset-0 w-full h-full rounded-2xl"
                  />
                )}
                <motion.img
                  className={`w-full h-full rounded-2xl transition-opacity duration-500 ${
                    sectionImageLoaded ? "opacity-100" : "opacity-0"
                  } ${currentPage == 0 ? "blur-none" : "blur-sm"}`}
                  // @ts-ignore
                  src={details?.sections[currentPage]?.imageUrl}
                  // @ts-ignore
                  alt={details?.sections[currentPage]?.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  transition={{ ease: "easeOut", duration: 2 }}
                  draggable={false}
                  onLoad={() => setSectionImageLoaded(true)}
                />
                {/* <motion.div
                  className={`absolute w-full p-4 ${
                    currentPage == 0
                      ? "bottom-0 text-left pr-10"
                      : "top-10 text-center px-14 mt-2"
                  }`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: -15 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  // @ts-ignore

                  key={details?.sections[currentPage]?.description}
                >
                  <span
                    className={`${
                      currentPage == 0
                        ? "text-4xl"
                        : "text-md md:text-lg lg:text-xl"
                    }  font-black text-white`}
                  >
                    {
                      // @ts-ignore
                      details?.sections[currentPage]?.description
                    }
                  </span>
                </motion.div> */}

                <motion.div
                  className={`absolute w-full p-4 ${
                    currentPage == 0
                      ? "bottom-0 text-left pr-10"
                      : "top-10 text-center px-14 mt-2"
                  }`}
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  key={details?.sections[currentPage]?.description}
                >
                  <motion.span
                    initial={{ y: 0, rotateX: 0, rotateY: 0 }}
                    animate={{
                      y: [-2, 2, -2],
                      rotateX: [-5, 5, -5], // Subtle 3D tilt effect
                      rotateY: [-5, 5, -5], // Makes text appear dynamic
                      textShadow: [
                        "2px 2px 5px rgba(255, 255, 255, 0.2)",
                        "4px 4px 10px rgba(255, 255, 255, 0.3)",
                        "2px 2px 5px rgba(255, 255, 255, 0.2)",
                      ], // Glowing shadow effect
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className={`${
                      currentPage == 0
                        ? "text-4xl"
                        : "text-md md:text-lg lg:text-xl"
                    } font-black text-white tracking-wide`}
                  >
                    {
                      // @ts-ignore
                      details?.sections[currentPage]?.description
                    }
                  </motion.span>
                </motion.div>

                {details?.sections[currentPage]?.nestedSections &&
                  details?.sections[currentPage]?.nestedSections.length > 1 && (
                    <motion.div className="absolute bottom-4 items-center w-full flex justify-center">
                      {details?.sections[currentPage]?.nestedSections.map(
                        (
                          nestedSection: any,
                          nestedIndex: React.Key | null | undefined
                        ) => (
                          <motion.div
                            key={nestedIndex}
                            className={`bg-white rounded-full mx-2 ${
                              nestedIndex === currentNestedPage
                                ? "w-3 h-3"
                                : "w-1 h-1"
                            }`}
                            transition={{ duration: 0.5, ease: "smooth" }}
                          ></motion.div>
                        )
                      )}
                    </motion.div>
                  )}
                {details?.sections[currentPage]?.nestedSections.length > 0 && (
                  <motion.div
                    className="absolute inset-1 flex flex-col items-center justify-center mt-20"
                    drag="x"
                    dragDirectionLock
                    dragConstraints={{ left: 0, right: 0 }}
                    dragTransition={{ bounceStiffness: 200, bounceDamping: 15 }}
                    onDragEnd={(event, info) =>
                      handleDragEnd(event, info, currentPage)
                    }
                    viewport={{ once: false }}
                  >
                    {/* Image Container */}
                    <motion.div className="w-80 h-56 md:w-72 md:h-72 lg:w-96 lg:h-80 rounded-2xl relative flex justify-center items-center shadow-lg">
                      {!nestedSectionImageLoaded && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-t-2xl">
                          <Blurhash
                            hash={
                              details?.sections[currentPage].nestedSections[
                                currentNestedPage
                              ]?.blurhash || "LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                            }
                            width="100%"
                            height="100%"
                            resolutionX={32}
                            resolutionY={32}
                            punch={1}
                            className="w-full h-full"
                            style={{ borderRadius: "1rem" }}
                          />
                        </div>
                      )}

                      <motion.img
                        className={`absolute inset-0 w-full h-full object-cover rounded-t-2xl transition-opacity duration-500 ${
                          nestedSectionImageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        src={
                          details?.sections[currentPage].nestedSections[
                            currentNestedPage
                          ]?.imageUrl
                        }
                        alt={
                          details?.sections[currentPage].nestedSections[
                            currentNestedPage
                          ]?.description
                        }
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        // whileInView={{ scaleX: [0.9, 1] }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.75 }}
                        draggable={false}
                        onLoad={() => setNestedSectionImageLoaded(true)}
                      />
                    </motion.div>

                    {/* Description Below Image */}
                    <motion.div
                      className="w-80 lg:w-96 bg-black/70 rounded-b-2xl shadow-md pl-3"
                      // initial={{ opacity: 0, y: 10 }}
                      // animate={{ opacity: 1, y: 0 }}
                      
                      transition={{ duration: 0.75, ease: "easeInOut" }}
                    >
                      <motion.span className="text-sm lg:text-md font-medium text-white leading-relaxed hyphens-auto">
                        {details?.sections[currentPage].nestedSections[
                          currentNestedPage
                        ]?.description
                          ?.split(/(\*[^*]+\*)/)
                          .map((word, index) => {
                            if (word.startsWith("*") && word.endsWith("*")) {
                              return (
                                <span
                                  key={index}
                                  className="text-violet-700 font-bold"
                                >
                                  {word.slice(1, -1)}
                                </span>
                              );
                            }
                            return word; 
                          })}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                )}
                {details && currentPage > 0 && (
                  <motion.div
                    className="absolute flex flex-col items-center top-1/2 right-3 transform -translate-y-1/2"
                    key={currentPage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.25 }}
                  >
                    <motion.div
                      className="absolute -top-1/3 -right-2.5 lg:-right-4 transform -translate-x-1/2 cursor-pointer z-10"
                      onClick={handleArrowUpClick}
                    >
                      <ChevronUpIcon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </motion.div>
                    {details.sections
                      .slice(1)
                      .map((_: any, index: React.Key | null | undefined) => (
                        <motion.div
                          key={index}
                          className={`bg-white rounded-full my-2 ${
                            index === currentPage - 1 ? "w-3 h-3" : "w-1 h-1"
                          }`}
                          transition={{ duration: 0.5, ease: "smooth" }}
                        ></motion.div>
                      ))}
                    <motion.div
                      className="absolute -bottom-1/3 -right-2.5 lg:-right-4 transform -translate-x-1/2 cursor-pointer z-10"
                      onClick={handleArrowDownClick}
                    >
                      <ChevronDownIcon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </motion.div>
                  </motion.div>
                )}
                {details?.sections[currentPage]?.nestedSections.length > 1 && (
                  <>
                    <div
                      className="absolute left-1/4 bottom-2 transform -translate-y-1/2 cursor-pointer z-10"
                      onClick={() =>
                        setCurrentNestedPage((prev) => Math.max(prev - 1, 0))
                      }
                    >
                      <ChevronLeftIcon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div
                      className="absolute right-1/4 bottom-2 transform -translate-y-1/2 cursor-pointer z-10"
                      onClick={() =>
                        setCurrentNestedPage((prev) =>
                          Math.min(
                            prev + 1,
                            details?.sections[currentPage]?.nestedSections
                              .length - 1
                          )
                        )
                      }
                    >
                      <ChevronRightIcon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </>
                )}
              </motion.div>
              <CardActivity
                // @ts-ignore
                postId={details?.id}
                // @ts-ignore
                initialLikes={details?.likes}
                // @ts-ignore
                initialComments={details?.comments}
                setIsCommentsOpenDragScroll={setIsCommentsOpen}
                closeShareOpenOnDragOrScroll={closeShare}
                // @ts-ignore
                handleDoubleClick={handleDoubleClick}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-slate-900 z-50 flex items-center justify-center"
        initial={{ y: "100%" }}
        animate={overlayControls}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        >
          <img
            className="h-20 md:h-24 lg:h-28"
            src="/logo-white.svg"
            alt="Logo"
          />
        </motion.span>
      </motion.div>
      <LoginRegisterModal />
    </motion.div>
  );
};

export default CardDetails;
