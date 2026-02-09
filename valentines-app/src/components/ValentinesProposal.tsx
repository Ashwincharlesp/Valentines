"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "@fireworks-js/react";
import Image from "next/image";

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
});

const NO_BUTTON_TEXTS = [
  "No",
  "Are you sure?",
  "Are you very sure?",
  "Don't you like me?",
  "Please?",
  "Pretty please?",
  "Say yes 😢",
  "I'll be so sad...",
];

export default function ValentinesProposal() {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState<{
    top: string;
    left: string;
  } | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [shrinkClickCount, setShrinkClickCount] = useState(0);

  const getRandomPosition = () => {
    const randomTop = Math.random() * 80;
    const randomLeft = Math.random() * 80;
    return { top: `${randomTop}%`, left: `${randomLeft}%` };
  };

  const handleNoMove = () => {
    if (moveCount < 10) {
      setPosition(getRandomPosition());
      setMoveCount((m) => m + 1);
    }
  };

  const handleNoClick = () => {
    if (moveCount < 10) {
      setPosition(getRandomPosition());
      setMoveCount((m) => m + 1);
    } else {
      setShrinkClickCount((c) => c + 1);
    }
  };

  useEffect(() => {
    if (moveCount === 10) {
      setPosition(null);
    }
  }, [moveCount]);

  const shrinkPhase = moveCount >= 10;
  const noGone = shrinkClickCount >= 8;
  const phaseIndex = Math.min(shrinkClickCount, 7);
  const noScale = shrinkPhase ? Math.max(0.2, 1 - phaseIndex * 0.1) : 1;
  const yesScale = shrinkPhase ? 1 + phaseIndex * 0.1 : 1;
  const noButtonText = shrinkPhase ? NO_BUTTON_TEXTS[phaseIndex] : "No, I won't 😢";

  useEffect(() => {
    if (step < 2) {
      const timer = setTimeout(() => {
        setStep((prevStep) => prevStep + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleYesClick = () => {
    setShowFireworks(true);
    setStep(3);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.h2
            key="step-0"
            className={`text-4xl font-semibold mb-4 ${playfairDisplay.className}`}
            transition={{ duration: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Congratulations! You have completed the game.
          </motion.h2>
        )}
        {step === 1 && (
          <motion.h2
            key="step-1"
            className={`text-4xl font-semibold mb-4 ${playfairDisplay.className}`}
            transition={{ duration: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            I have a surprise for you!
          </motion.h2>
        )}
        {step === 2 && (
          <motion.div
            key="step-2"
            transition={{ duration: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <h2
              className={`text-5xl font-semibold mb-8 ${playfairDisplay.className}`}
            >
              Will you be my Valentine?
            </h2>
            <Image
              src="/sad_hamster.png"
              alt="Sad Hamster"
              width={200}
              height={200}
            />
            <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
              <motion.button
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ transform: `scale(${yesScale})` }}
                transition={{ type: "tween", duration: 0.25 }}
                onClick={handleYesClick}
              >
                Yes, I will! 🥰
              </motion.button>
              {!noGone && (
                <motion.button
                  layout
                  className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg shrink-0"
                  style={{
                    ...(!shrinkPhase && position
                      ? { position: "absolute" as const, top: position.top, left: position.left }
                      : {}),
                    transform: `scale(${noScale})`,
                  }}
                  transition={{
                    type: "tween",
                    duration: shrinkPhase ? 0.5 : 0.25,
                    layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                  }}
                  onMouseEnter={handleNoMove}
                  onClick={handleNoClick}
                >
                  {noButtonText}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step-3"
            className={`text-4xl font-semibold mb-4 flex flex-col justify-center items-center ${playfairDisplay.className}`}
            transition={{ duration: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Thank you for accepting, I love you! 💕
            <p className="text-sm mt-4">For more information, write me!!! 💌</p>
            <Image
              src="/game-photos/HereHere.gif"
              alt="Hamster Feliz"
              width={200}
              height={200}
              unoptimized
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showFireworks && (
        <div className="absolute w-full h-full">
          <Fireworks
            options={{
              autoresize: true,
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
