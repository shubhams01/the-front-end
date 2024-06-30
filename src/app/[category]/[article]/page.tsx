"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useDragControls,
} from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import cardDetails from "../../../app/cardDetails.json";
import nextSectionData from "../../../app/nextSectionData.json"; // Import the next section data

const DetailsPage = ({ params }: { params: { category: string } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { category } = params;

  const controls = useAnimation();
  const overlayControls = useAnimation();
  const dragControls = useDragControls();

  const { scrollYProgress } = useScroll();

  const id = pathname.split("/")[2];

  const initialDetails = cardDetails.find((card) => card.id == id);

  const [details, setDetails] = useState(initialDetails);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentNestedPage, setCurrentNestedPage] = useState(0);
  const [isFetchingNextSection, setIsFetchingNextSection] = useState(false);
  const detailsRef = useRef(details?.sections.map(() => React.createRef()));

  useEffect(() => {
    console.log("cardDetails ", pathname, id, details);
  }, [pathname, id, details]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("ScrollY ", latest);
  });

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
    });
  }, [controls]);

  const handleDragEnd = (event, info, sectionIndex) => {
    console.log("dragend ", info.offset.x, currentNestedPage);
    if (info.offset.x > 100 && currentNestedPage > 0) {
      // Swiped right
      setCurrentNestedPage(currentNestedPage - 1);
      console.log("dragRight ", info.offset.x, currentNestedPage);
    } else if (
      info.offset.x < -100 &&
      currentNestedPage <
        details.sections[sectionIndex].nestedSections.length - 1
    ) {
      // Swiped left
      setCurrentNestedPage(currentNestedPage + 1);
      console.log("dragLeft ", info.offset.x, currentNestedPage);
    }
  };

  const handleDrag = async (event, info) => {
    if (info.offset.y < -100 && currentPage < details?.sections.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (info.offset.y > 100 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (
      info.offset.y < -100 &&
      currentPage === details?.sections.length - 1
    ) {
      await fetchNextSection();
    }
    console.log(
      `${info.offset.y < 0 ? "dragUp " : "dragDown"}`,
      info.offset.y,
      currentPage,
      details?.sections.length,
      details?.sections.length - 1 < currentPage
    );
  };

  const handleScroll = async (event) => {
    const direction = event.deltaY > 0 ? "down" : "up";
    if (direction === "down" && currentPage < details.sections.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "up" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (
      direction === "down" &&
      currentPage === details.sections.length - 1
    ) {
      await fetchNextSection();
    }
  };

  const fetchNextSection = async () => {
    setIsFetchingNextSection(true);
    await overlayControls.start({ y: 0 });

    // Use the imported next section data
    const nextSection = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(nextSectionData);
      }, 1000);
    });

    setDetails((prevDetails) => ({
      ...prevDetails,
      sections: [...nextSection.sections],
    }));

    detailsRef.current = [
      ...detailsRef.current,
      ...nextSection.sections.map(() => React.createRef()),
    ];
    setCurrentPage(0);
    console.log("nextSection ", currentPage);
    await overlayControls.start({ y: "-100%" });
    setIsFetchingNextSection(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center scroll-smooth h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden"
      onWheel={handleScroll}
    >
      <motion.div className="snap-y snap-mandatory h-full w-screen snap-start">
        {details?.sections && (
          <motion.div
            className="items-center justify-center mx-auto w-full md:w-3/4 lg:w-2/4 h-screen rounded-xl snap-center relative"
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
            dragConstraints={{ top: 0, bottom: 0 }}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 25 }}
            onDragEnd={(event: any, info: any) => handleDrag(event, info)}
          >
            <motion.div className="relative h-full w-full p-2">
              <motion.img
                className="w-full h-full rounded-2xl"
                src={details?.sections[currentPage].imageUrl}
                alt={details?.sections[currentPage].title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                whileInView={{ scaleX: [0.9, 1] }}
                viewport={{ once: false }}
                transition={{ duration: 0.75 }}
                draggable={false}
              />
              <motion.div
                className="absolute bottom-8 w-full p-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                key={details?.sections[currentPage].description}
              >
                <span className="text-sm md:text-lg lg:text-2xl font-bold text-white">
                  {details?.sections[currentPage].description}
                </span>
              </motion.div>
              {details?.sections[currentPage].nestedSections && (
                <motion.div className="absolute bottom-4 w-full flex justify-center">
                  {details?.sections[currentPage].nestedSections.map(
                    (nestedSection, nestedIndex) => (
                      <motion.div
                        key={nestedIndex}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full mx-1 ${
                          nestedIndex === currentNestedPage
                            ? "bg-black"
                            : "bg-white"
                        }`}
                        transition={{ duration: 0.5, ease: "smooth" }}
                      ></motion.div>
                    )
                  )}
                  <motion.div
                    className="absolute left-1/4 -bottom-2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setCurrentNestedPage((prev) => Math.max(prev - 1, 0))}
                  >
                    <ChevronLeftIcon className="w-4 h-4 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute right-1/4 -bottom-2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setCurrentNestedPage((prev) =>
                        Math.min(
                          prev + 1,
                          details?.sections[currentPage].nestedSections.length - 1
                        )
                      )
                    }
                  >
                    <ChevronRightIcon className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              )}
              {details?.sections[currentPage].nestedSections && (
                <motion.div
                  className="absolute inset-1 flex justify-center items-top mt-10"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
                  onDragEnd={(event, info) =>
                    handleDragEnd(event, info, currentPage)
                  }
                >
                  <motion.div className="w-64 h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-2xl relative">
                    <motion.img
                      className="w-full h-full rounded-2xl"
                      src={
                        details?.sections[currentPage].nestedSections[
                          currentNestedPage
                        ].imageUrl
                      }
                      alt={
                        details?.sections[currentPage].nestedSections[
                          currentNestedPage
                        ].description
                      }
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileInView={{ scaleX: [0.9, 1] }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.75 }}
                      draggable={false}
                    />
                    <motion.div
                      className="w-full text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.75, ease: "easeInOut" }}
                    >
                      <span className="text-sm md:text-md lg:text-lg font-bold text-white">
                        {
                          details?.sections[currentPage].nestedSections[
                            currentNestedPage
                          ].description
                        }
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              {details && (
                <motion.div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.25 }}
                >
                  {details.sections.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                        index === currentPage ? "bg-black" : "bg-white"
                      } mb-1 md:mb-2`}
                      transition={{ duration: 0.5, ease: "smooth" }}
                    ></motion.div>
                  ))}
                  <motion.div
                    className="absolute -top-1/2 -right-3 lg:-right-4 transform -translate-x-1/2 cursor-pointer"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  >
                    <ChevronUpIcon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-1/2 -right-3 lg:-right-4 transform -translate-x-1/2 cursor-pointer"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, details.sections.length - 1)
                      )
                    }
                  >
                    <ChevronDownIcon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
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
          <img className="h-20 md:h-24 lg:h-28" src="/logo.png" alt="Logo" />
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default DetailsPage;
