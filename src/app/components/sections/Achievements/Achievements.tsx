"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

// Local assets
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

const infinitePartners = [...partners, ...partners];

const Achievements = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-28 md:py-32 bg-white overflow-hidden">
      
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <ScrollDepthLayer
          depth={0.2}
          lift={10}
          spacing="pb-12 md:pb-16"
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05 }}
            className="text-red-600 text-4xl md:text-6xl font-heading font-bold tracking-tight"
          >
            Achievements
          </motion.h2>

          <div className="w-32 h-1.5 bg-red-600 mx-auto mt-6 rounded-full opacity-30" />
        </ScrollDepthLayer>
      </div>

      {/* Slider */}
      <div
        className="relative flex items-center py-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient fades */}
        <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-white via-white/80 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-white via-white/80 to-transparent z-10" />

        <motion.div
          className="flex gap-8 md:gap-16 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: isHovered ? 50 : 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {infinitePartners.map((partner, index) => (
            <div
              key={index}
              className="shrink-0 flex items-center justify-center w-32 md:w-48 hover:scale-110 transition-transform"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={200}
                height={120}
                className="max-h-24 md:max-h-32 w-auto object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;