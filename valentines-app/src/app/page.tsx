"use client";

// Run the app: https://pcharles.github.io/Valentines/

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoPairGame from "../components/PhotoPairGame";
import ValentinesProposal from "@/components/ValentinesProposal";
import TextFooter from "@/components/TextFooter";
import OrientationGuard from "@/components/OrientationGuard";

const ANIM_DURATION = 2;
const INTRO_HOLD = 2.5;

export default function Home() {
  const [introStep, setIntroStep] = useState(0);
  const [showValentinesProposal, setShowValentinesProposal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (introStep < 2) {
      const t = setTimeout(() => setIntroStep((s) => s + 1), INTRO_HOLD * 1000);
      return () => clearTimeout(t);
    }
  }, [introStep]);

  const handleShowProposal = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowValentinesProposal(true);
    }, ANIM_DURATION * 1000);
  };

  return (
    <OrientationGuard>
      <main className="flex items-center justify-center min-h-screen bg-black overflow-hidden relative">
        {!showValentinesProposal ? (
          <>
            {/* Intro: text screens then game */}
            {introStep < 2 ? (
              <AnimatePresence mode="wait">
                {introStep === 0 && (
                  <motion.p
                    key="intro0"
                    className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold text-center px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    Little foreplay first
                  </motion.p>
                )}
                {introStep === 1 && (
                  <motion.p
                    key="intro1"
                    className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold text-center px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    Pair the photos
                  </motion.p>
                )}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isTransitioning ? 0 : 1 }}
                transition={{ duration: introStep === 2 ? 0.8 : ANIM_DURATION }}
                className="flex flex-col items-center"
              >
                <PhotoPairGame handleShowProposal={handleShowProposal} />
                <div className="mt-4 md:mt-0">
                  <TextFooter />
                </div>
                {/* Invisible skip: bottom-right, black on black — remove or lock later */}
                <button
                  type="button"
                  aria-label="Skip to proposal"
                  className="fixed bottom-4 right-4 w-14 h-14 bg-black border-0 cursor-pointer z-10"
                  onClick={handleShowProposal}
                />
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: ANIM_DURATION }}
          >
            <ValentinesProposal />
          </motion.div>
        )}
      </main>
    </OrientationGuard>
  );
}
