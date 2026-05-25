"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";


const teamMembers = [
  {
    id: 1,
    name: "Shivank Thapliyal",
    role: "Founder",
    image: "/core-team/atulya-optimized.jpg",
    description:
      "Visionary founder leading the mission with passion, dedication, and a drive for excellence.",
  },
  {
    id: 2,
    name: "Pragya Thapliyal",
    role: "Managing Director",
    image: "/core-team/pragya-optimized.jpg",
    description:
      "Strategic co-founder driving innovation and operational success across all of our developmental platforms.",
  },
  {
    id: 3,
    name: "Atulya Bhatt",
    role: "Creative Head",
    image: "/core-team/shivank-optimized.jpg",
    description:
      "Expert developer crafting robust, scalable solutions and leading technical architecture with precision.",
  },
  {
    id: 4,
    name: "Harsh Negi",
    role: "Cultural Head",
    image: "/core-team/harsh-optimized.jpg",
    description:
      "Creative mind behind the beautiful interfaces and seamless user experiences of our platforms.",
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const textVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

const CoreTeamSection = () => {
  const [activeId, setActiveId] = useState(teamMembers[0].id);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = teamMembers.findIndex(
          (m) => m.id === currentId
        );
        return teamMembers[(currentIndex + 1) % teamMembers.length].id;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section
      id="about-us"
      className="min-h-0 h-[90vh] max-h-screen py-16 md:py-24 px-4 md:px-8 flex flex-col justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url(/core-team/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 gap-8 justify-between relative z-10">

        {/* Gallery */}
        <ScrollDepthLayer
          depth={0.28}
          lift={26}
          rotateX={1.2}
          spacing="pb-10 md:pb-14"
          className="h-[60vh] w-full mt-4 shrink-0"
          layerClassName="flex flex-col md:flex-row gap-3 md:gap-5 h-full w-full"
        >
          {teamMembers.map((member) => {
            const isActive = activeId === member.id;

            return (
              <motion.div
                key={member.id}
                layout
                onClick={() => setActiveId(member.id)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative cursor-pointer overflow-hidden rounded-[2.5rem] shadow-2xl bg-[#00568b] group ${
                  isActive
                    ? "md:flex-[5] flex-[4] z-10"
                    : "md:flex-[1] flex-[1] hover:z-20"
                }`}
              >
                {/* Image */}
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-110 opacity-50 grayscale"
                  }`}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-transparent transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Text */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white"
                    >
                      <motion.h3
                        variants={textVariant}
                        className="text-3xl md:text-5xl font-bold mb-2"
                      >
                        {member.name}
                      </motion.h3>

                      <motion.p
                        variants={textVariant}
                        className="text-[#ffcc00] font-bold mb-4"
                      >
                        {member.role}
                      </motion.p>

                      <motion.p variants={textVariant} className="hidden md:block">
                        {member.description}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </ScrollDepthLayer>

        {/* Footer */}
        <ScrollDepthLayer
          depth={0.2}
          lift={18}
          rotateX={1}
          className="pb-4"
          layerClassName="flex flex-col md:flex-row justify-between text-white gap-6"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              CORE TEAM
            </h2>
            <p className="text-white/80">Caumas</p>
          </div>

          <p className="max-w-lg text-sm text-white/90">
            The passionate minds behind the mission. Dedicated to innovation,
            pushing boundaries, and building real-world solutions.
          </p>
        </ScrollDepthLayer>
      </div>
    </section>
  );
};

export default CoreTeamSection;