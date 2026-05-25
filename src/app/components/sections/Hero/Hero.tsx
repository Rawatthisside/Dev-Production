"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

// Backgrounds (public)
const bg1 = "/media/mountaintop-hero.jpg";
const bg2 = "/media/culture-hero.jpg";
const video = "/media/vid1.mp4";

const backgrounds = [bg1, bg2];

// Clouds
import cloud1 from "@/app/components/shared/assets/Layer 2 copy 2.png";
import cloud2 from "@/app/components/shared/assets/Layer 2 copy 5.png";
import cloud3 from "@/app/components/shared/assets/Layer 2 copy 10.png";


// Side Images
import culture from "./assets/culture-thumb.jpg";
import drums from "./assets/culture-thumb.jpg";
import people from "./assets/mountaintop-thumb.jpg";

// Letter Image
import letterbox from "./assets/letterbox.png";

const Hero = () => {
  const [showLetter, setShowLetter] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const text = "DEVASTHALI".split("");
  const sideIcons = [culture, drums, people];

  const setHeroSlide = (index: number) => {
    setCurrentBgIndex(index);
    if (index !== 2) setIsMuted(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentBgIndex + 1) % sideIcons.length;
      setHeroSlide(nextIndex);
    }, 8000);

    return () => clearInterval(timer);
  }, [currentBgIndex, sideIcons.length]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col bg-black">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence initial={false}>
          {currentBgIndex === 2 ? (
            <motion.div
              key="video-bg"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                filter: showLetter
                  ? "blur(10px) brightness(0.5)"
                  : "blur(0px) brightness(1)",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                ref={videoRef}
                autoPlay
                loop
                playsInline
                preload="none"
                muted={isMuted}
                className="w-full h-full object-cover opacity-80"
              >
                <source src={video} type="video/mp4" />
              </video>

              <AnimatePresence>
                {isMuted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                  >
                    <button
                      onClick={() => setIsMuted(false)}
                      className="pointer-events-auto group flex flex-col items-center gap-4"
                    >
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center bg-[#ff3600]">
                        🔊
                      </div>
                      <span className="text-white font-black text-lg md:text-xl uppercase tracking-widest">
                        Tap for Sound
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key={currentBgIndex}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: showLetter ? 1.1 : 1.05,
                filter: showLetter
                  ? "blur(10px) brightness(0.5)"
                  : "blur(0px) brightness(1)",
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.5, ease: "easeInOut" },
                scale: { duration: 8, ease: "linear" },
                filter: { duration: 0.8 },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={backgrounds[currentBgIndex]}
                alt=""
                fill
                className="object-cover"
                priority={currentBgIndex === 0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CLOUDS */}
      <AnimatePresence>
        {currentBgIndex === 0 && (
          <motion.div className="absolute inset-0 z-10 pointer-events-none">
            {[cloud1, cloud2, cloud3].map((cloud, i) => (
              <motion.img
                key={i}
                src={cloud.src}
                className="absolute bottom-0 w-full opacity-60"
                animate={{ x: ["-50%", "120%"] }}
                transition={{ duration: 45 + i * 5, repeat: Infinity }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO TEXT */}
      <div className="absolute inset-0 z-20 flex flex-col justify-start pt-[22vh] pointer-events-none">
        <AnimatePresence>
          {currentBgIndex !== 2 && (
            <motion.div className="text-center px-4 pointer-events-auto">
              <ScrollDepthLayer depth={0.35}>
                <motion.h1
                  onClick={() => setShowLetter(true)}
                  className="text-6xl md:text-8xl lg:text-[9.5rem] font-bold flex justify-center cursor-pointer"
                >
                  {text.map((char, i) => (
                    <motion.span key={i}>{char}</motion.span>
                  ))}
                </motion.h1>
              </ScrollDepthLayer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LETTER */}
      <AnimatePresence>
        {showLetter && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div className="relative w-[90%] max-w-3xl">
              <Image
                src={letterbox}
                alt="Letter"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
              <button
                onClick={() => setShowLetter(false)}
                className="absolute top-4 right-4 bg-white px-3 py-1 rounded"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDE ICONS */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-8">
        {sideIcons.map((img, i) => (
          <div key={i} onClick={() => setHeroSlide(i)}>
            <Image
              src={img}
              alt=""
              width={96}
              height={96}
              className="rounded-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;