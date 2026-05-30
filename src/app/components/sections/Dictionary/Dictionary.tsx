"use client";

import { motion } from "framer-motion";
import { Search, Volume2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

import dbg1 from "./assets/dbg1.png";
import wotdImg from "./assets/khud.png";

const Dictionary = () => {
  const [query, setQuery] = useState("");

  const popularSearches = ["khud", "मैं बढ़िया छुं", "पाणी", "Bhaiji", "Kakh"];

  return (
    <section
      id="dictionary"
      className="relative overflow-hidden bg-white min-h-[100vh] flex flex-col justify-center"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">

        {/* Top faded image */}
        <div className="absolute top-0 left-0 w-full h-[40%] opacity-30">
          <Image
            src={dbg1}
            alt=""
            fill
            className="object-cover object-top mix-blend-multiply grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FACC15]" />
        </div>

        {/* SVG wave — preserveAspectRatio none keeps it full-bleed on all viewports */}
        <svg
          viewBox="0 0 1440 600"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,150 Q400,280 1000,100 T1440,0 L1440,600 L0,600 Z"
            fill="#FACC15"
          />
          <path
            d="M0,500 Q720,650 1440,500 L1440,600 L0,600 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24">

        {/* HEADER */}
        <ScrollDepthLayer depth={0.2} className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <h2
              className="font-heading font-medium text-[#1E40AF]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", lineHeight: 1.1 }}
            >
              गढ़वाली
            </h2>
            <h2
              className="font-heading font-extrabold text-[#1E3A8A]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", lineHeight: 1.1 }}
            >
              Dictionary
            </h2>
          </motion.div>
        </ScrollDepthLayer>

        {/* SEARCH */}
        <ScrollDepthLayer depth={0.3} className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Input row */}
            <div className="flex items-center p-2 gap-1">
              <div className="px-3 text-gray-400 shrink-0">
                <Search size={24} strokeWidth={1.5} />
              </div>

              <input
                type="text"
                placeholder="Search a word or phrase"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none py-3 text-base sm:text-lg text-gray-700 placeholder:text-gray-400"
              />

              {/* Button: inline on sm+, full-width below */}
              <button className="hidden sm:block bg-[#FACC15] text-[#1E3A8A] font-bold px-6 py-3 rounded-xl shrink-0 hover:bg-yellow-400 transition-colors">
                Search
              </button>
            </div>

            {/* Mobile-only full-width button */}
            <div className="sm:hidden px-2 pb-2">
              <button className="w-full bg-[#FACC15] text-[#1E3A8A] font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors">
                Search
              </button>
            </div>
          </motion.div>
        </ScrollDepthLayer>

        {/* POPULAR TAGS */}
        <ScrollDepthLayer depth={0.35} className="mt-6 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 sm:gap-3 px-1">
            {popularSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(term)}
                className="bg-[#A16207] text-white text-sm sm:text-base px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </ScrollDepthLayer>

        {/* WORD OF THE DAY */}
        <ScrollDepthLayer depth={0.4} className="mt-12 md:mt-16 w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-[2rem] p-6 md:p-8 shadow-lg flex flex-col md:flex-row gap-6 md:gap-8"
          >

            {/* TEXT SIDE */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Word of the Day
                </h3>
                <p className="text-sm text-gray-400 mt-1">March 14, 2026</p>

                <div className="flex items-center gap-3 mt-5">
                  <h4
                    className="font-bold text-[#1E40AF]"
                    style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", lineHeight: 1 }}
                  >
                    खुद्
                  </h4>
                  {/* Pronunciation icon */}
                  <button
                    aria-label="Pronounce word"
                    className="text-[#1E40AF] hover:text-yellow-600 transition-colors mt-1"
                  >
                    <Volume2 size={22} />
                  </button>
                </div>
              </div>

              <button className="mt-8 self-start bg-[#FACC15] text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors">
                Get the Word of the Day
              </button>
            </div>

            {/* IMAGE SIDE */}
            <div className="w-full md:flex-1 relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/3", maxHeight: "280px" }}
            >
              <Image
                src={wotdImg}
                alt="Word of the Day illustration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

          </motion.div>
        </ScrollDepthLayer>

      </div>
    </section>
  );
};

export default Dictionary;