"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";

import { EffectCoverflow, Autoplay } from "swiper/modules";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";
import cloudLayer from "@/app/components/shared/assets/whtecloud.png";
import greyClouds from "@/app/components/sections/Udankaar/assets/greyclouds.png";
import udankaarLogo from "@/app/components/sections/Udankaar/assets/udankaar-logo-optimized.png";
import harvestFestival from "@/app/components/shared/assets/harvest-festival.jpg";

type UdankaarEntry = {
  _id: string;
  title?: string;
  photo?: string;
  youtubeLink?: string;
  seo?: {
    title?: string;
  };
};

type Video = {
  _id: string;
  title: string;
  image: string;
  url: string;
};

function mapEntryToVideo(entry: UdankaarEntry): Video | null {
  const title = entry.title?.trim() || entry.seo?.title?.trim() || "Untitled Udankaar";
  const image = entry.photo?.trim() || "";
  const url = entry.youtubeLink?.trim() || "";

  if (!image || !url) {
    return null;
  }

  return {
    _id: entry._id,
    title,
    image,
    url,
  };
}

export default function UdaankarSection(): JSX.Element {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/udankaar", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to fetch Udankaar entries");
        }

        const data = await res.json();

        if (!isMounted) {
          return;
        }

        const nextVideos = Array.isArray(data)
          ? data
              .map((entry) => mapEntryToVideo(entry as UdankaarEntry))
              .filter((entry): entry is Video => entry !== null)
          : [];

        setVideos(nextVideos);
      } catch (err) {
        console.error("Failed to load Udankaar entries", err);
      }
    };

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="podcast" className="relative min-h-screen overflow-hidden py-24">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cloudLayer.src})` }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
      </div>

      {/* Moving Clouds */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url(${greyClouds.src})`,
          backgroundSize: "200% 100%",
          backgroundRepeat: "repeat-x",
          animation: "moveClouds 60s linear infinite",
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes moveClouds {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `,
        }}
      />

      {/* TOP SECTION */}
      <div className="relative z-10 min-h-screen flex items-center py-24">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-20 min-h-[70vh]">
            {/* LOGO */}
            <ScrollDepthLayer depth={0.45} shiftX={-12} rotateY={2}>
              <img
                src={udankaarLogo.src}
                alt="Udankaar Logo"
                className="w-80 h-80 object-contain hover:scale-105 transition"
              />
            </ScrollDepthLayer>

            {/* TEXT */}
            <ScrollDepthLayer depth={0.4} shiftX={10} rotateY={1.6}>
              <h1
                className="text-6xl md:text-8xl font-bold"
                style={{
                  background: `url(${harvestFestival.src})`,
                  backgroundSize: "cover",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                UDAANKAR
              </h1>

              <p className="text-gray-700 mt-4 max-w-lg">
                A captivating series dedicated to Himalayan culture, life, and art.
              </p>

              <motion.button
                className="mt-6 px-8 py-3 bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-full"
                onClick={() => router.push("/components/sections/Udankaar/Udankaar-page")}
              >
                Watch More
              </motion.button>
            </ScrollDepthLayer>
          </div>
        </div>
      </div>

      {/* Swiper */}
      <div className="relative z-20 -mt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollDepthLayer depth={0.25}>
            {videos.length > 0 ? (
              <Swiper
                effect="coverflow"
                centeredSlides
                slidesPerView={2.5}
                loop
                autoplay={{ delay: 2500 }}
                modules={[EffectCoverflow, Autoplay]}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              >
                {videos.map((video, index) => {
                  const isFocused =
                    activeIndex === index % videos.length ||
                    hoveredIndex === index;

                  return (
                    <SwiperSlide key={video._id}>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="block rounded-3xl overflow-hidden"
                      >
                        <img
                          src={video.image}
                          alt={video.title}
                          className="w-full h-130 object-cover transition"
                          style={{
                            filter: isFocused
                              ? "blur(0px) brightness(1.1)"
                              : "blur(3px) brightness(0.7)",
                          }}
                        />

                        <div className="absolute bottom-6 left-6">
                          <h3 className="text-white text-xl font-bold">
                            {video.title}
                          </h3>
                        </div>
                      </a>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <div className="rounded-3xl bg-white/80 px-6 py-10 text-center text-gray-700 shadow-lg">
                Udankaar entries from the admin panel will appear here.
              </div>
            )}
          </ScrollDepthLayer>
        </div>
      </div>
    </section>
  );
}
