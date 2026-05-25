"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

// Local assets
import ramman from "./assets/ramman.png";
import bgim from "./assets/raman-background.jpeg";

const Ramman = () => {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden flex items-center min-h-[80vh]">
      
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgim}
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/60" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left */}
        <ScrollDepthLayer
          depth={0.45}
          shiftX={-15}
          rotateY={2}
          spacing="pb-10 md:pb-14"
          className="flex-1 w-full flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, type: "spring", bounce: 0.28 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-md lg:max-w-lg"
            >
              <Image
                src={ramman}
                alt="Ramman Festival Masked Figures"
                width={600}
                height={600}
                className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]"
              />
            </motion.div>
          </motion.div>
        </ScrollDepthLayer>

        {/* Right */}
        <ScrollDepthLayer
          depth={0.3}
          shiftX={15}
          rotateY={-1}
          className="flex-[1.2]"
        >
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-extrabold text-gray-900 tracking-tight">
              Ramman <span className="text-red-600">(festival)</span>
            </h2>

            <h3 className="mt-6 font-body text-gray-700 text-lg md:text-xl leading-relaxed">
              Ramman is a religious festival and ritual theatre of the Garhwal region in India. It is a festival of the Garhwali People celebrated in many villages of the region. Although there are many Rammans, such as the Jak Ramman, one of the most popular is the masked Ramman of the Saloor Dungra village of the Painkhanda Valley in the Chamoli district in Uttarakhand, India.
            </h3>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05, backgroundColor: "#b91c1c" }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-10 py-4 bg-red-600 text-white font-body font-bold text-lg rounded-full shadow-[0_10px_25px_rgba(220,38,38,0.4)] transition-colors"
            >
              Know More
            </motion.button>
          </motion.div>
        </ScrollDepthLayer>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg
          className="relative block w-full h-[50px] md:h-[100px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.57,192.5,108.41Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Ramman;