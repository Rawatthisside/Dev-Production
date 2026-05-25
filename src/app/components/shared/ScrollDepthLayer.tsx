"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollDepthLayerProps {
  children: ReactNode;
  className?: string;
  layerClassName?: string;
  spacing?: string;
  depth?: number;
  lift?: number;
  shiftX?: number;
  rotateX?: number;
  rotateY?: number;
}

const ScrollDepthLayer = ({
  children,
  className,
  layerClassName,
  spacing = "",
  depth = 0.5,
  lift = 40,
  shiftX = 0,
  rotateX = 2,
  rotateY = 1.5,
}: ScrollDepthLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const motionDepth = shouldReduceMotion ? 0 : depth;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [lift * motionDepth, 0, -lift * motionDepth]
  );

  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [shiftX * motionDepth, 0, -shiftX * motionDepth]
  );

  const tiltX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [rotateX * motionDepth, 0, -rotateX * motionDepth]
  );

  const tiltY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-rotateY * motionDepth, 0, rotateY * motionDepth]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 - 0.012 * motionDepth, 1, 1 - 0.012 * motionDepth]
  );

  return (
    <div ref={ref} className={cn("scroll-depth-scene", spacing, className)}>
      <motion.div
        className={cn("scroll-depth-layer", layerClassName)}
        style={{ x, y, rotateX: tiltX, rotateY: tiltY, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollDepthLayer;