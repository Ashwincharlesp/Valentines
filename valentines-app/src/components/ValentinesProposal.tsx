"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
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

// Keep No button within viewport: buffer (in %) from each edge
const NO_BUTTON_BUFFER_PCT = 25;

export default function ValentinesProposal() {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState<{
    top: string;
    left: string;
  } | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [shrinkClickCount, setShrinkClickCount] = useState(0);

  const getRandomPosition = () => {
    const range = 100 - 2 * NO_BUTTON_BUFFER_PCT; // e.g. 76 for 12% buffer
    const randomTop = NO_BUTTON_BUFFER_PCT + Math.random() * range;
    const randomLeft = NO_BUTTON_BUFFER_PCT + Math.random() * range;
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
  const noScale = shrinkPhase ? Math.max(0.15, 1 - phaseIndex * 0.12) : 1;
  const yesScale = shrinkPhase ? 1 + phaseIndex * 0.18 : 1;
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
      const t = setTimeout(() => setStep(3), 3500);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (step === 3) {
      // Arrow gif display time (ms) — change 7000 to your desired duration
      const t = setTimeout(() => setStep(4), 4700);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
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
            {noGone ? (
              <>
                <p className={`text-2xl md:text-3xl font-semibold text-white mb-4 text-center ${playfairDisplay.className}`}>
                  Like I gave you an Option!
                </p>
                <Image
                  src={getImageSrc("/game-photos/Badgirl.gif")}
                  alt=""
                  width={200}
                  height={200}
                  unoptimized
                  className="mb-8"
                />
              </>
            ) : moveCount < 10 ? (
              <Image
                src={getImageSrc("/game-photos/GoodGirl.gif")}
                alt=""
                width={200}
                height={200}
                unoptimized
              />
            ) : (
              <Image
                src={getImageSrc(`/game-photos/please${Math.min(phaseIndex + 1, 9)}.gif`)}
                alt=""
                width={200}
                height={200}
                unoptimized
              />
            )}
            <div className="flex items-center justify-center gap-10 mt-10 flex-wrap min-w-0">
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

      </AnimatePresence>

      {/* Step 3: Arrow gif — key forces reload/replay when step 3 is shown; timer moves to step 4 after 7s */}
      {step === 3 && (
        <motion.div
          key="step-3-overlay"
          className="fixed inset-0 pointer-events-none flex items-center justify-center bg-black"
          style={{ zIndex: 100 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key="arrow-step3"
            src={`${getImageSrc("/game-photos/Arrow.gif")}`}
            alt=""
            className="absolute left-1/2 top-1/2 max-h-[85vh] max-w-[92vw] w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-2xl"
            style={{ width: "min(92vw, 85vh)", height: "min(92vw, 85vh)" }}
          />
        </motion.div>
      )}

      {/* Step 4: BTS.gif — fixed to viewport so it always shows */}
      {step === 4 && (
        <motion.div
          key="step-4-final"
          className="fixed inset-0 flex items-center justify-center bg-black"
          style={{ zIndex: 101 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "min(95vw, 95vh)",
              height: "min(95vw, 95vh)",
              maxWidth: "95vw",
              maxHeight: "95vh",
            }}
          >
            <div className="relative h-full w-full">
              <Image
                key="bts-final"
                src={getImageSrc("/game-photos/BTS.gif")}
                alt="BTS"
                fill
                unoptimized
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 100vw) 95vw, 95vh"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
