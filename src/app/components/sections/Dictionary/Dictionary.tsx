"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

// Local assets
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
        <div className="absolute top-0 left-0 w-full h-[40%] opacity-30 relative">
          <Image
            src={dbg1}
            alt=""
            fill
            className="object-cover object-top mix-blend-multiply grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FACC15]" />
        </div>

        {/* SVG wave */}
        <svg
          viewBox="0 0 1440 600"
          className="w-full h-full absolute top-0"
          preserveAspectRatio="none"
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

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 py-20">
        
        {/* HEADER */}
        <ScrollDepthLayer depth={0.2} className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <h2 className="text-5xl md:text-7xl font-heading font-medium text-[#1E40AF]">
              गढ़वाली
            </h2>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-[#1E3A8A]">
              Dictionary
            </h2>
          </motion.div>
        </ScrollDepthLayer>

        {/* SEARCH */}
        <ScrollDepthLayer depth={0.3} className="w-full max-w-4xl mx-auto">
          <motion.div className="bg-white rounded-2xl flex items-center p-2 shadow-2xl">
            <div className="px-4 text-gray-400">
              <Search size={28} strokeWidth={1.5} />
            </div>

            <input
              type="text"
              placeholder="Search a word or phase"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none py-4 text-lg text-gray-700"
            />

            <button className="bg-[#FACC15] text-[#1E3A8A] font-bold px-8 py-3 rounded-xl">
              Search
            </button>
          </motion.div>
        </ScrollDepthLayer>

        {/* TAGS */}
        <ScrollDepthLayer depth={0.35} className="mt-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4 px-2">
            {popularSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(term)}
                className="bg-[#A16207] text-white px-5 py-2 rounded-lg"
              >
                {term}
              </button>
            ))}
          </div>
        </ScrollDepthLayer>

        {/* WORD OF THE DAY */}
        <ScrollDepthLayer depth={0.4} className="mt-16 w-full max-w-4xl mx-auto">
          <motion.div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-lg flex flex-col md:flex-row gap-8">
            
            {/* TEXT */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold">Word of the Day</h3>
              <p className="text-sm text-gray-400">March 14, 2026</p>

              <h4 className="text-5xl font-bold text-[#1E40AF] mt-6">
                खुद्
              </h4>

              <button className="mt-8 bg-[#FACC15] text-blue-900 px-6 py-3 rounded-xl">
                Get the Word of the Day
              </button>
            </div>

            {/* IMAGE */}
            <div className="flex-1 relative w-full max-w-md aspect-[4/3]">
              <Image
                src={wotdImg}
                alt="Word of the Day"
                fill
                className="object-cover rounded-2xl"
              />
            </div>

          </motion.div>
        </ScrollDepthLayer>

      </div>
    </section>
  );
};

export default Dictionary;