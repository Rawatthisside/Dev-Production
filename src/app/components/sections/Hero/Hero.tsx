"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

const bg1 = "/media/mountaintop-hero.jpg";
const bg2 = "/media/culture-hero.jpg";
const video = "/media/vid1.mp4";
const backgrounds = [bg1, bg2];

import cloud1 from "@/app/components/shared/assets/Layer 2 copy 2.png";
import cloud2 from "@/app/components/shared/assets/Layer 2 copy 5.png";
import cloud3 from "@/app/components/shared/assets/Layer 2 copy 10.png";

import culture from "./assets/culture-thumb.jpg";
import drums from "./assets/culture-thumb.jpg";
import people from "./assets/mountaintop-thumb.jpg";
import letterbox from "./assets/letterbox.png";

const sideIcons = [culture, drums, people];

const Hero = () => {
  const [showLetter, setShowLetter] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const text = "DEVASTHALI".split("");

  const handleUnmute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = false;
    vid.volume = 1;
    setIsMuted(false);
  };

  const setHeroSlide = (index: number) => {
    setCurrentBgIndex(index);
    if (index !== 2) {
      if (videoRef.current) videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((currentBgIndex + 1) % sideIcons.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentBgIndex]);

  useEffect(() => {
    document.body.style.overflow = showLetter ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLetter]);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col bg-black">

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0">

        {/* IMAGE SLIDES — animate between them */}
        {backgrounds.map((bg, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{
              opacity: currentBgIndex === i ? 1 : 0,
              scale: currentBgIndex === i ? (showLetter ? 1.1 : 1.05) : 1,
              filter: currentBgIndex === i
                ? showLetter ? "blur(10px) brightness(0.5)" : "none"
                : "none",
            }}
            transition={{
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" },
              filter: { duration: 0.8 },
            }}
          >
            <Image
              src={bg}
              alt=""
              fill
              className="object-cover"
              priority={i === 0}
            />
          </motion.div>
        ))}

        {/* VIDEO SLIDE — always mounted, never unmounts */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: currentBgIndex === 2 ? 1 : 0,
            filter: showLetter ? "blur(10px) brightness(0.5)" : "none",
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          // pointer-events off when not active so hidden video doesn't catch clicks
          style={{ pointerEvents: currentBgIndex === 2 ? "auto" : "none" }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-80"
          >
            <source src={video} type="video/mp4" />
          </video>
        </motion.div>

      </div>

      {/* ── TAP FOR SOUND — only shown on video slide ── */}
      <AnimatePresence>
        {currentBgIndex === 2 && isMuted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-8 right-6 sm:bottom-10 sm:right-8 z-50"
          >
            <button
              onClick={handleUnmute}
              className="
                flex items-center gap-1.5
                bg-black/40 backdrop-blur-md
                border border-white/20
                rounded-full px-3 py-1.5
                touch-manipulation select-none group
              "
              aria-label="Unmute video"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3600] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3600]" />
              </span>
              <span className="text-white font-semibold text-[10px] uppercase tracking-widest whitespace-nowrap">
                Tap for Sound
              </span>
              <svg
                className="w-3 h-3 text-white/80 group-hover:text-white transition-colors shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-4-4H5a1 1 0 01-1-1v-2a1 1 0 011-1h3l4-4z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M18.364 5.636a9 9 0 010 12.728" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CLOUDS ── */}
      <AnimatePresence>
        {currentBgIndex === 0 && (
          <motion.div
            key="clouds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
          >
            {[cloud1, cloud2, cloud3].map((cloud, i) => (
              <motion.img
                key={i}
                src={cloud.src}
                alt=""
                className="absolute bottom-0 w-full opacity-50"
                style={{ willChange: "transform" }}
                animate={{ x: ["-10%", "110%"] }}
                transition={{
                  duration: 50 + i * 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 4,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO TEXT ── */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center sm:justify-start sm:pt-[22vh]">
        <AnimatePresence>
          {currentBgIndex !== 2 && (
            <motion.div
              key="hero-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center px-2 sm:px-4"
            >
              <ScrollDepthLayer depth={0.35}>
                <motion.h1
                  onClick={() => setShowLetter(true)}
                  className="
                    font-bold flex justify-center cursor-pointer select-none
                    text-[clamp(2.5rem,12vw,9.5rem)]
                    tracking-tight sm:tracking-normal
                    text-white drop-shadow-lg
                  "
                  aria-label="Devasthali — click to read our letter"
                >
                  {text.map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h1>
                <p className="text-white/60 text-xs sm:hidden mt-2 tracking-widest uppercase">
                  Tap to read our story
                </p>
              </ScrollDepthLayer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── LETTER MODAL ── */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLetter(false)}
          >
            <motion.div
              className="relative w-full max-w-3xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={letterbox}
                alt="A letter from Devasthali"
                width={1200}
                height={800}
                className="w-full h-auto rounded-xl"
              />
              <button
                onClick={() => setShowLetter(false)}
                className="
                  absolute -top-4 -right-4
                  w-11 h-11 rounded-full
                  bg-white text-black text-lg font-bold
                  flex items-center justify-center
                  shadow-lg touch-manipulation
                "
                aria-label="Close letter"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIDE ICONS ── */}
      <div className="absolute right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 sm:gap-5 md:gap-8">
        {sideIcons.map((img, i) => {
          const isActive = currentBgIndex === i;
          return (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className="relative group touch-manipulation"
              aria-label={`Switch to slide ${i + 1}`}
            >
              <span className={`
                absolute inset-0 rounded-full border-2 transition-all duration-300
                ${isActive ? "border-[#ff3600] scale-110" : "border-transparent"}
              `} />
              <Image
                src={img}
                alt=""
                width={96}
                height={96}
                className={`
                  rounded-full object-cover transition-all duration-300
                  w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20
                  ${isActive ? "opacity-100 scale-105" : "opacity-60 group-hover:opacity-90"}
                `}
              />
            </button>
          );
        })}
      </div>

    </section>
  );
};

export default Hero;