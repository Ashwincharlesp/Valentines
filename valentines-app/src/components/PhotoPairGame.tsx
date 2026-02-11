"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

// 18 images — your Pic 1–18 files (mixed .jpg / .jpeg / .png)
const images = [
  "/game-photos/Pic 1.jpg",
  "/game-photos/Pic 2.png",
  "/game-photos/Pic 3.jpeg",
  "/game-photos/Pic 4.jpeg",
  "/game-photos/Pic 5.jpeg",
  "/game-photos/Pic 6.jpeg",
  "/game-photos/Pic 7.jpeg",
  "/game-photos/Pic 8.png",
  "/game-photos/Pic 9.png",
  "/game-photos/Pic 10.png",
  "/game-photos/Pic 11.png",
  "/game-photos/Pic 12.png",
  "/game-photos/Pic 13.png",
  "/game-photos/Pic 14.png",
  "/game-photos/Pic 15.png",
  "/game-photos/Pic 16.png",
  "/game-photos/Pic 17.png",
  "/game-photos/Pic 18.png",
];

// Create 18 pairs of images (36 images in total)
const imagePairs = images.flatMap((image) => [image, image]);

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

type ValentinesProposalProps = {
  handleShowProposal: () => void;
};

const getImageSrc = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;

export default function PhotoPairGame({
  handleShowProposal,
}: ValentinesProposalProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);
  const [shuffledImages] = useState(() => shuffleArray([...imagePairs]));

  const handleClick = async (index: number) => {
    if (selected.length === 2 || matched.includes(index) || selected.includes(index)) return;

    if (selected.length === 1) {
      const firstIndex = selected[0];
      setSelected((prev) => [...prev, index]);

      if (shuffledImages[firstIndex] === shuffledImages[index]) {
        setMatched((prev) => [...prev, firstIndex, index]);
        setSelected([]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIncorrect([firstIndex, index]);
        setTimeout(() => setIncorrect([]), 1000);
        setTimeout(() => setSelected([]), 1000);
      }
    } else {
      setSelected([index]);
    }
  };

  // Check if game is won
  useEffect(() => {
    if (matched.length === imagePairs.length) {
      handleShowProposal();
    }
  }, [matched, handleShowProposal]);

  return (
    <div className="flex items-center justify-center gap-4 lg:gap-8 max-w-[95vw] mx-auto">
      {/* Mirrored HereHere GIF left of the heart — 2x size */}
      <div className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 relative scale-x-[-1]">
        <Image
          src={getImageSrc("/game-photos/HereHere.gif")}
          alt=""
          width={256}
          height={256}
          unoptimized
          className="w-full h-full object-contain"
        />
      </div>

      <div className="grid grid-cols-9 gap-1 lg:gap-2 place-items-center">
      {/* Image preload */}
      <div className="hidden">
        {shuffledImages.map((image, i) => (
          <Image
            key={i}
            src={getImageSrc(image)}
            alt={`Image ${i + 1}`}
            fill
            className="object-cover"
            priority
          />
        ))}
      </div>

      {heartLayout.flat().map((index, i) =>
        index !== null ? (
          <motion.div
            key={i}
            className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => handleClick(index)}
            style={{ perspective: "1000px" }} // Add perspective for 3D effect
          >
            {/* Back of the card */}
            {!selected.includes(index) && !matched.includes(index) && (
              <motion.div
                className="w-full h-full bg-gray-300 rounded-sm lg:rounded-md absolute z-10"
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY:
                    selected.includes(index) || matched.includes(index)
                      ? 180
                      : 0,
                }}
                transition={{ duration: 0.5 }}
                style={{ backfaceVisibility: "hidden" }}
              />
            )}

            {/* Front of the card (image) */}
            {(selected.includes(index) || matched.includes(index)) && (
              <motion.div
                className="absolute inset-0"
                initial={{ rotateY: -180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src={getImageSrc(shuffledImages[index])}
                  alt={`Card ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 11vh, 5rem"
                  className="rounded-sm lg:rounded-md object-cover"
                />
              </motion.div>
            )}

            {/* Incorrect animation */}
            {incorrect.includes(index) && (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-full bg-red-500 rounded-sm lg:rounded-md"></div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div key={i} className="w-[11vh] h-[11vh] lg:w-20 lg:h-20" />
        ),
      )}
      </div>

      {/* HereHere GIF right of the heart — 2x size */}
      <div className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 relative">
        <Image
          src={getImageSrc("/game-photos/HereHere.gif")}
          alt=""
          width={256}
          height={256}
          unoptimized
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
