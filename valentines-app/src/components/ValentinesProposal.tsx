"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "@fireworks-js/react";
import Image from "next/image";

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
});

const DEFLECT_RADIUS = 100;
const ARROW_SIZE = 28;

// 36 images
const images = [
  "/game-photos/1.avif",
  "/game-photos/2.avif",
  "/game-photos/3.avif",
  "/game-photos/4.avif",
  "/game-photos/5.avif",
  "/game-photos/6.avif",
  "/game-photos/7.avif",
  "/game-photos/8.avif",
  "/game-photos/9.avif",
  "/game-photos/10.avif",
  "/game-photos/11.avif",
  "/game-photos/12.avif",
  "/game-photos/13.avif",
  "/game-photos/14.avif",
  "/game-photos/15.avif",
  "/game-photos/16.avif",
  "/game-photos/17.avif",
  "/game-photos/18.avif",
  "/game-photos/19.avif",
  "/game-photos/20.avif",
  "/game-photos/21.avif",
  "/game-photos/22.avif",
  "/game-photos/23.avif",
  "/game-photos/24.avif",
  "/game-photos/25.avif",
  "/game-photos/26.avif",
  "/game-photos/27.avif",
  "/game-photos/28.avif",
  "/game-photos/29.avif",
  "/game-photos/30.avif",
  "/game-photos/31.avif",
  "/game-photos/32.avif",
  "/game-photos/33.avif",
  "/game-photos/34.avif",
  "/game-photos/35.avif",
  "/game-photos/36.avif",
];

function getCorners() {
  if (typeof window === "undefined") return [];
  const padding = 50;
  return [
    { x: padding, y: padding },
    { x: window.innerWidth - padding, y: padding },
    { x: padding, y: window.innerHeight - padding },
    { x: window.innerWidth - padding, y: window.innerHeight - padding },
  ];
}

export default function ValentinesProposal() {
  const [step, setStep] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isDeflecting, setIsDeflecting] = useState(false);
  const [deflectTarget, setDeflectTarget] = useState<{ x: number; y: number } | null>(null);
  const [arrowVisible, setArrowVisible] = useState(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (step < 2) {
      const timer = setTimeout(() => {
        setStep((prevStep) => prevStep + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (step !== 2) return;
      const x = e.clientX;
      const y = e.clientY;
      lastMouseRef.current = { x, y };

      if (isDeflecting) return;

      const btn = noButtonRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(x - centerX, y - centerY);
        if (dist < DEFLECT_RADIUS) {
          const corners = getCorners();
          const corner = corners[Math.floor(Math.random() * corners.length)];
          setDeflectTarget(corner);
          setIsDeflecting(true);
          return;
        }
      }

      setArrowVisible(true);
      setMousePos({ x: x - ARROW_SIZE / 2, y: y - ARROW_SIZE / 2 });
    },
    [step, isDeflecting]
  );

  useEffect(() => {
    if (step !== 2) {
      setArrowVisible(false);
      setMousePos(null);
      return;
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [step, handleMouseMove]);

  const handleDeflectComplete = useCallback(() => {
    setIsDeflecting(false);
    setDeflectTarget(null);
    setMousePos({
      x: lastMouseRef.current.x - ARROW_SIZE / 2,
      y: lastMouseRef.current.y - ARROW_SIZE / 2,
    });
  }, []);

  const handleYesClick = () => {
    setShowFireworks(true);
    setStep(3);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-full ${step === 2 ? "cursor-none" : ""}`}
    >
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
            className="flex flex-col items-center relative"
          >
            {/* Image Grid Background */}
            <div className="absolute inset-0 grid grid-cols-6 opacity-10">
              {images.slice(0, 36).map((src, index) => (
                <div key={index} className="relative h-full">
                  <Image
                    src={src}
                    alt={`Memory ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

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
            <div className="flex space-x-4 mt-10 items-center relative">
              <button
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={handleYesClick}
              >
                Yes, I will! 🥰
              </button>
              {/* Deflection zone ring around No button */}
              <div className="relative inline-block">
                <span
                  className="absolute -inset-3 rounded-2xl animate-pulse opacity-40 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(251,113,133,0.4) 0%, transparent 70%)",
                    boxShadow: "0 0 20px rgba(251,113,133,0.3)",
                  }}
                  aria-hidden
                />
                <button
                  ref={noButtonRef}
                  className="relative px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-95 transition-all duration-300 shadow-lg pointer-events-auto"
                  onClick={(e) => e.preventDefault()}
                >
                  No, I won&apos;t 😢
                </button>
              </div>
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
              src="/hamster_jumping.gif"
              alt="Hamster Feliz"
              width={200}
              height={200}
              unoptimized
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deflectable arrow cursor (step 2 only) */}
      {step === 2 && arrowVisible && (
        <motion.div
          className="fixed w-7 h-7 pointer-events-none z-[9999]"
          style={{ left: 0, top: 0 }}
          initial={false}
          animate={
            deflectTarget
              ? {
                  x: deflectTarget.x - ARROW_SIZE / 2,
                  y: deflectTarget.y - ARROW_SIZE / 2,
                  rotate: 360,
                  scale: 1.2,
                }
              : {
                  x: mousePos?.x ?? -50,
                  y: mousePos?.y ?? -50,
                  rotate: 0,
                  scale: 1,
                }
          }
          transition={
            deflectTarget
              ? {
                  type: "tween",
                  duration: 0.35,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }
              : { type: "tween", duration: 0.05 }
          }
          onAnimationComplete={() => {
            if (deflectTarget) handleDeflectComplete();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full drop-shadow-lg"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="rgba(251, 113, 133, 0.95)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

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
