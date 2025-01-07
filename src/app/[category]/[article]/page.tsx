"use client";

import React, { useState, useEffect } from "react";
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
} from "@heroicons/react/24/solid";
import CardActivity from "@/app/components/Story/CardActivity";
import LoginRegisterModal from "@/app/components/Modal/LoginRegisterModal";

interface Section {
  nestedSections: Array<{
    imageUrl: string;
    description: string;
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

const DetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { id } = params;

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

  const nextSection = searchParams.get("explore");

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
          response = await fetch("https://api.gyaanhub.io/api/explore");
        } else if (nextSection === "trending" || nextSection === "latest") {
          if (nextSection === "trending") {
            response = await fetch(
              "https://api.gyaanhub.io/api/articles/trending"
            );
          } else {
            response = await fetch("https://api.gyaanhub.io/api/articles/latest");
          }
        } else {
          response = await fetch(`https://api.gyaanhub.io/api/explore`);
        }
        if (!response.ok) {
          throw new Error("Failed to fetch next section");
        }
        const responseData = await response.json();
        setNextSections(responseData);
        console.log("Next Sections:", nextSections);
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
        NestedSections: any[];
      }) => {
        const sectionObject = {
          imageUrl: "https://api.gyaanhub.io" + section?.SectionImage?.formats?.large?.url,
          description: section.SectionDescription,
          nestedSections: section.NestedSections
            ? section.NestedSections.map(
                (nested: {
                  NestedSectionImage: { formats: { large: { url: any } } };
                  NestedSectionDescription: any;
                }) => ({
                  imageUrl: "https://api.gyaanhub.io" + nested?.NestedSectionImage?.formats?.large?.url,
                  description: nested.NestedSectionDescription,
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

      const categorySlug = nextSection.category.Title;
      // @ts-ignore
      const sectionSlug = nextSection.Slug;
      // @ts-ignore
      const sectionId = nextSection.id;

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
          `https://api.gyaanhub.io/api/article/${articleId}`,
          // {
          //   headers: {
          //     Authorization: `Bearer f4da5bebc8dd837c1df99461784738662f5d9ee1505673fb922b0f547870eb17ba70cddfdb07033e591c38f02019ec1bf4468f8c036ab1a3936e26ecf55f896af48f83aac5dd25403f479576733b0aee60fdeff94806dfb4401d0ebc480cf7594d56aa82ad1e1e2690201bec49a2a0d3430125130bea3dc587cfff137de5d454`,
          //   },
          // }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Articles");
        }
        const data = await response.json();
        console.log("articleDetails ", data);

        const sections = data?.sections.map(
          (section: {
            SectionImage: { formats: { large: { url: any } } };
            SectionDescription: any;
            NestedSections: any[];
          }) => {
            const sectionObject = {
              imageUrl: "https://api.gyaanhub.io" + section?.SectionImage?.formats?.large.url,
              description: section?.SectionDescription,
              nestedSections: section?.NestedSections
                ? section.NestedSections.map(
                    (nested: {
                      NestedSectionImage: { formats: { large: { url: any } } };
                      NestedSectionDescription: any;
                    }) => ({
                      imageUrl: "https://api.gyaanhub.io" + nested?.NestedSectionImage?.formats?.large?.url,
                      description: nested?.NestedSectionDescription,
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
        router.push('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center scroll-smooth h-screen overflow-y-scroll overflow-x-hidden"
      onWheel={handleScroll}
    >
      <motion.div className="h-screen w-screen snap-start">
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
                <motion.img
                  className="w-full h-full rounded-2xl"
                  // @ts-ignore
                  src={details?.sections[currentPage]?.imageUrl}
                  // @ts-ignore
                  alt={details?.sections[currentPage]?.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  transition={{ ease: "easeOut", duration: 2 }}
                  draggable={false}
                />
                <motion.div
                  className={`absolute bottom-8 w-full p-4 ${
                    currentPage == 0 ? "text-left" : "text-center"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                  // @ts-ignore

                  key={details?.sections[currentPage]?.description}
                >
                  <span
                    className={`${
                      currentPage == 0
                        ? "text-4xl text-shadow shadow-slate-500"
                        : "text-lg md:text-lg lg:text-2xl"
                    }  font-bold text-white`}
                  >
                    {
                      // @ts-ignore
                      details?.sections[currentPage]?.description
                    }
                  </span>
                </motion.div>
                {details?.sections[currentPage]?.nestedSections && (
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
                    className="absolute inset-1 flex justify-center items-top mt-10"
                    drag="x"
                    dragDirectionLock
                    dragConstraints={{ left: 0, right: 0 }}
                    dragTransition={{ bounceStiffness: 200, bounceDamping: 15 }}
                    onDragEnd={(event, info) =>
                      handleDragEnd(event, info, currentPage)
                    }
                  >
                    <motion.div className="mt-4 w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl relative">
                      <motion.img
                        className="w-full h-full rounded-2xl opacity-50"
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
                        whileInView={{ scaleX: [0.9, 1] }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.75 }}
                        draggable={false}
                      />
                      <motion.div
                        className="w-full flex items-center justify-center text-center max-h-100 mt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.75, ease: "easeInOut" }}
                      >
                        <motion.span className="text-sm md:text-md lg:text-lg font-extrabold text-slate-100">
                          {
                            details?.sections[currentPage].nestedSections[
                              currentNestedPage
                            ]?.description
                          }
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
                {details && (
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
                    {details.sections.map(
                      (_: any, index: React.Key | null | undefined) => (
                        <motion.div
                          key={index}
                          className={`bg-white rounded-full my-2 ${
                            index === currentPage ? "w-3 h-3" : "w-1 h-1"
                          }`}
                          transition={{ duration: 0.5, ease: "smooth" }}
                        ></motion.div>
                      )
                    )}
                    <motion.div
                      className="absolute -bottom-1/3 -right-2.5 lg:-right-4 transform -translate-x-1/2 cursor-pointer z-10"
                      onClick={handleArrowDownClick}
                    >
                      <ChevronDownIcon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </motion.div>
                  </motion.div>
                )}
                {details?.sections[currentPage]?.nestedSections.length > 0 && (
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
          <img className="h-20 md:h-24 lg:h-28" src="/logo-white.svg" alt="Logo" />
        </motion.span>
      </motion.div>
      <LoginRegisterModal />
    </motion.div>
  );
};

export default DetailsPage;
