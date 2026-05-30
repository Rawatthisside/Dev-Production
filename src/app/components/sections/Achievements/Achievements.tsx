"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

import lo1 from "./assets/lo1.png";
import lo2 from "./assets/lo2.png";
import lo3 from "./assets/lo3.png";
import lo4 from "./assets/lo4.png";
import lo5 from "./assets/lo5.jpg";

type Partner = {
  name: string;
  logo: any;
};

const partners: Partner[] = [
  { name: "Sangeet Natak Akademi", logo: lo1 },
  { name: "NBRC", logo: lo2 },
  { name: "Ministry of Culture", logo: lo3 },
  { name: "IIT Roorkee", logo: lo4 },
  { name: "Graphic Era", logo: lo5 },
];

// Triple-duplicate so the seam is never visible during the loop
const infinitePartners = [...partners, ...partners, ...partners];

const Achievements = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-28 lg:py-32">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <ScrollDepthLayer depth={0.2} lift={10} className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.05 }}
            className="text-red-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight"
          >
            Achievements
          </motion.h2>
          <div className="w-24 sm:w-32 h-1.5 bg-red-600 mx-auto mt-4 sm:mt-6 rounded-full opacity-30" />
        </ScrollDepthLayer>
      </div>

      {/* Slider */}
      <div
        className="relative py-6 sm:py-8 md:py-10 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Left fade */}
        <div className="absolute inset-y-0 left-0 z-10 w-10 sm:w-20 md:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        {/* Right fade */}
        <div className="absolute inset-y-0 right-0 z-10 w-10 sm:w-20 md:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <motion.div
          className="flex items-center w-max"
          style={{
            // ✅ GPU-composited transform — eliminates sub-pixel black line artifacts
            willChange: "transform",
            // ✅ Round to nearest pixel, prevents hairline gaps at the seam
            backfaceVisibility: "hidden",
          }}
          animate={{ x: isPaused ? undefined : [0, "-33.333%"] }}
          transition={{
            duration: 22,
            ease: "linear",
            repeat: Infinity,
            // ✅ repeatType "loop" with no delay keeps motion perfectly seamless
            repeatType: "loop",
          }}
        >
          {infinitePartners.map((partner, index) => (
            <div
              key={index}
              // ✅ px gap instead of gap utility — prevents layout recalc jitter
              className="flex shrink-0 items-center justify-center px-6 sm:px-10 md:px-14 transition-transform duration-300 hover:scale-110"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={200}
                height={120}
                priority={index < 5}
                // ✅ explicit block + no height constraint conflict
                className="block w-auto max-h-14 sm:max-h-20 md:max-h-24 lg:max-h-28 object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;