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
  "No, I won't 😢",
  "Are you sure?",
  "Are you very sure?",
  "Don't you like me?",
  "Please?",
  "Pretty please?",
  "Say yes 😢",
  "I'll be so sad...",
];

const getImageSrc = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;

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
  const noScale = shrinkPhase ? Math.max(0.25, 1 - phaseIndex * 0.1) : 1;
  const yesScale = shrinkPhase ? 1 + phaseIndex * 0.08 : 1;
  const noButtonText = shrinkPhase ? NO_BUTTON_TEXTS[phaseIndex] : "No, I won't 😢";

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleYesClick = () => {
    setStep(2);
  };

  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => {
        setShowFireworks(true);
        setStep(3);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AnimatePresence mode="wait">
        {/* Step 0: yay gif + Good Panda! + A+ */}
        {step === 0 && (
          <motion.div
            key="step-0"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={getImageSrc("/game-photos/yay.gif")}
              alt=""
              width={280}
              height={280}
              unoptimized
              className="object-contain"
            />
            <div className="relative mt-4 inline-block">
              <span
                className={`text-4xl font-bold text-white ${playfairDisplay.className}`}
              >
                Good Panda !
              </span>
              <Image
                src={getImageSrc("/game-photos/A+.png")}
                alt="A+"
                width={48}
                height={48}
                className="absolute -top-2 -right-10 w-10 h-10 object-contain"
              />
            </div>
          </motion.div>
        )}

        {/* Step 1: Will you be my Valentine */}
        {step === 1 && (
          <motion.div
            key="step-1"
            transition={{ duration: 0.6 }}
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
              alt=""
              width={200}
              height={200}
            />
            <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
              <motion.button
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl shrink-0 origin-center"
                style={{ transform: `scale(${yesScale})` }}
                transition={{ type: "tween", duration: 0.25 }}
                onClick={handleYesClick}
              >
                Yes, I will! 🥰
              </motion.button>
              {!noGone && (
                <motion.button
                  layout
                  className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg shrink-0 origin-center"
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

        {/* Step 2: Big Arrow gif in center (after Yes click) */}
        {step === 2 && (
          <motion.div
            key="step-2"
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={getImageSrc("/game-photos/Arrow.gif")}
              alt=""
              width={400}
              height={400}
              unoptimized
              className="object-contain max-w-[85vw] max-h-[70vh]"
            />
          </motion.div>
        )}

        {/* Step 3: Thank you + fireworks */}
        {step === 3 && (
          <motion.div
            key="step-3"
            className={`text-4xl font-semibold mb-4 flex flex-col justify-center items-center ${playfairDisplay.className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            Thank you for accepting, I love you! 💕
            <p className="text-sm mt-4">For more information, write me!!! 💌</p>
            <Image
              src={getImageSrc("/game-photos/HereHere.gif")}
              alt=""
              width={200}
              height={200}
              unoptimized
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showFireworks && (
        <div className="absolute w-full h-full pointer-events-none">
          <Fireworks
            options={{ autoresize: true }}
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
