"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Local assets
import whiteCloud from "./assets/cloud-layers/whtecloud.png";
import cloudSoft from "./assets/cloud-layers/Layer 2 copy 2.png";
import cloudLow from "./assets/cloud-layers/Layer 2 copy 15.png";
import cloudPuff from "./assets/cloud-layers/Layer 2 copy 6.png";

type CloudTransitionProps = {
  className?: string;
  reverse?: boolean;
};

const CloudTransition = ({
  className = "",
  reverse = false,
}: CloudTransitionProps) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: layerRef,
    offset: ["start 92%", "start 8%"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.72, 1],
    [0, 0.82, 0.74, 0]
  );

  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const drift = reverse ? ["-22%", "-8%", "-22%"] : ["-8%", "-22%", "-8%"];
  const slowDrift = reverse
    ? ["-6%", "-18%", "-6%"]
    : ["-18%", "-6%", "-18%"];

  const foregroundClouds = [
    cloudPuff,
    whiteCloud,
    cloudLow,
    cloudSoft,
    whiteCloud,
    cloudPuff,
    cloudLow,
  ];

  const backgroundClouds = [
    cloudSoft,
    cloudLow,
    cloudPuff,
    cloudSoft,
    whiteCloud,
    cloudLow,
  ];

  const maskImage =
    "linear-gradient(to bottom, transparent 0%, black 20%, black 78%, transparent 100%)";

  return (
    <motion.div
      ref={layerRef}
      className={`relative z-40 h-px overflow-visible pointer-events-none ${className}`}
      style={{ opacity, y }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-0 top-1/2 h-[clamp(120px,15vw,230px)] -translate-y-1/2 overflow-hidden"
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      >
        {/* FOREGROUND */}
        <motion.div
          className="absolute left-[-18%] top-1/2 flex h-[92%] w-max"
          animate={
            reduceMotion
              ? undefined
              : { x: drift, y: ["-50%", "-54%", "-50%"] }
          }
          transition={{
            duration: 42,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {foregroundClouds.map((cloud, index) => (
            <img
              key={index}
              src={cloud.src}
              alt=""
              className="h-full w-auto flex-none -ml-14 opacity-75 mix-blend-screen first:ml-0"
            />
          ))}
        </motion.div>

        {/* BACKGROUND */}
        <motion.div
          className="absolute left-[-12%] top-[58%] flex h-[72%] w-max"
          animate={
            reduceMotion
              ? undefined
              : { x: slowDrift, y: ["-48%", "-53%", "-48%"] }
          }
          transition={{
            duration: 58,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {backgroundClouds.map((cloud, index) => (
            <img
              key={index}
              src={cloud.src}
              alt=""
              className="h-full w-auto flex-none -ml-12 scale-x-[-1] opacity-[0.36] blur-[1px] mix-blend-screen first:ml-0"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CloudTransition;