"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

// Local asset
import ghostVillage from "./assets/ghost-village.png";

const GhostVillages = () => {
  return (
    <section
      id="ghost-villages"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-mountain"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={ghostVillage}
          alt="Ghost village"
          fill
          className="object-cover object-center"
          priority
        />
        {/* dark scrim — stronger on mobile so text stays readable */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/20" />
      </div>

      {/* CENTER-RIGHT CONTAINER */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 xs:px-6 sm:px-10 md:px-12 lg:px-16 py-16 sm:py-20 flex justify-center sm:justify-end">

        <ScrollDepthLayer
          depth={0.3}
          shiftX={20}
          className="w-full flex justify-center sm:justify-end"
        >

          {/* CONTENT BLOCK */}
          <div className="w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[460px] md:max-w-[520px] sm:mr-6 md:mr-12 lg:mr-20 flex flex-col gap-7 sm:gap-10">

            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-left"
            >
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <span className="text-white block">1,500+</span>
                <span className="text-golden block">Ghost Villages</span>
                <span className="text-white/90 block">in Uttarakhand</span>
              </h1>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-5 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-golden text-black font-bold text-sm sm:text-base rounded-full shadow-lg"
              >
                Read Their Stories
              </motion.button>
            </motion.div>

            {/* VIDEO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full aspect-video rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black"
            >
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/IxmUqwaD90A?modestbranding=1&rel=0"
                title="Ghost Villages of Uttarakhand"
                loading="lazy"
                allowFullScreen
              />

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-20" />
            </motion.div>

          </div>
        </ScrollDepthLayer>
      </div>
    </section>
  );
};

export default GhostVillages;
