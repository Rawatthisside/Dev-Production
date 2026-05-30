"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
  seo?: { title?: string };
};

type Video = {
  _id: string;
  title: string;
  image: string;
  url: string;
};

function mapEntryToVideo(entry: UdankaarEntry): Video | null {
  const title =
    entry.title?.trim() || entry.seo?.title?.trim() || "Untitled Udankaar";
  const image = entry.photo?.trim() || "";
  const url = entry.youtubeLink?.trim() || "";
  if (!image || !url) return null;
  return { _id: entry._id, title, image, url };
}

/* ─── responsive card geometry hook ─── */
function useCardGeometry() {
  const [geo, setGeo] = useState({
    CARD_W: 240,
    CARD_H: 340,
    ACT_W: 340,
    ACT_H: 480,
    ROT_Y: 28,
    DEPTH: 140,
    DIM: 0.68,
  });

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 400) {
        // very small phones
        setGeo({
          CARD_W: 110,
          CARD_H: 170,
          ACT_W: 200,
          ACT_H: 290,
          ROT_Y: 18,
          DEPTH: 80,
          DIM: 0.62,
        });
      } else if (w < 480) {
        // small phones
        setGeo({
          CARD_W: 130,
          CARD_H: 195,
          ACT_W: 230,
          ACT_H: 335,
          ROT_Y: 20,
          DEPTH: 90,
          DIM: 0.64,
        });
      } else if (w < 640) {
        // phones landscape / phablets
        setGeo({
          CARD_W: 155,
          CARD_H: 225,
          ACT_W: 260,
          ACT_H: 380,
          ROT_Y: 22,
          DEPTH: 100,
          DIM: 0.65,
        });
      } else if (w < 768) {
        // small tablets
        setGeo({
          CARD_W: 185,
          CARD_H: 268,
          ACT_W: 290,
          ACT_H: 420,
          ROT_Y: 25,
          DEPTH: 115,
          DIM: 0.66,
        });
      } else if (w < 1024) {
        // tablets
        setGeo({
          CARD_W: 210,
          CARD_H: 300,
          ACT_W: 310,
          ACT_H: 450,
          ROT_Y: 26,
          DEPTH: 125,
          DIM: 0.67,
        });
      } else {
        // desktop
        setGeo({
          CARD_W: 240,
          CARD_H: 340,
          ACT_W: 340,
          ACT_H: 480,
          ROT_Y: 28,
          DEPTH: 140,
          DIM: 0.68,
        });
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return geo;
}

export default function UdaankarSection(): JSX.Element {
  const [videos, setVideos] = useState<Video[]>([]);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const router = useRouter();
  const geo = useCardGeometry();

  /* fetch */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/udankaar", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!alive) return;
        const vids = Array.isArray(data)
          ? data
              .map((e) => mapEntryToVideo(e as UdankaarEntry))
              .filter((v): v is Video => v !== null)
          : [];
        setVideos(vids);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* auto-advance */
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % Math.max(videos.length, 1));
    }, 2800);
  }, [videos.length]);

  useEffect(() => {
    if (videos.length > 1) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [videos.length, startTimer]);

  const move = (dir: number) => {
    setActive((a) => (a + dir + videos.length) % videos.length);
    startTimer();
  };

  /* drag/swipe */
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 40) {
      move(dx < 0 ? 1 : -1);
      isDragging.current = true;
    }
  };

  /* per-card transform */
  const cardStyle = (i: number, total: number): React.CSSProperties => {
    const { CARD_W, CARD_H, ACT_W, ACT_H, ROT_Y, DEPTH, DIM } = geo;
    const n = total;
    let offset = (((i - active) % n) + n) % n;
    if (offset > n / 2) offset -= n;
    const absOff = Math.abs(offset);
    const isAct = absOff === 0;

    const w = isAct ? ACT_W : CARD_W;
    const h = isAct ? ACT_H : CARD_H;
    const x = offset * (CARD_W * 0.95);
    const z = isAct ? 0 : -absOff * DEPTH;
const ry = 0;
    const scale = isAct ? 1 : Math.max(0.68, 1 - absOff * 0.1);
    const bright = isAct ? 1 : Math.max(DIM, 1 - absOff * 0.18);
    const zi = 100 - absOff * 10;
    const vis = absOff > 5;

    return {
      position: "absolute",
      width: `${w}px`,
      height: `${h}px`,
      borderRadius: "16px",
      overflow: "hidden",
      cursor: isAct ? "pointer" : "default",
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`,
      filter: `brightness(${bright})`,
      zIndex: zi,
      opacity: vis ? 0 : 1,
      pointerEvents: vis ? "none" : "auto",
      transition:
        "transform 0.5s cubic-bezier(.4,0,.2,1), filter 0.5s ease, opacity 0.4s ease, width 0.5s ease, height 0.5s ease",
      boxShadow: isAct
        ? "0 8px 20px rgba(0,0,0,0.08)"
        : "0 4px 12px rgba(0,0,0,0.05)",
    };
  };

  return (
    <section
      id="podcast"
      className="relative overflow-hidden bg-white"
      style={{ minHeight: "100svh" }}
    >
      {/* backgrounds */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cloudLayer.src})` }}
      />
      <div className="absolute inset-0 bg-white/75" />
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `url(${greyClouds.src})`,
          backgroundSize: "200% 100%",
          backgroundRepeat: "repeat-x",
          animation: "driftClouds 80s linear infinite",
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes driftClouds {
          from { background-position: 0% 50%; }
          to   { background-position: 200% 50%; }
        }
      `,
        }}
      />

      {/* ── HERO ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-8 md:px-10 lg:px-14 pt-10 xs:pt-12 sm:pt-14 md:pt-16 lg:pt-20 pb-4 sm:pb-6 md:pb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 xs:gap-7 sm:gap-10 md:gap-12 lg:gap-16">
          <ScrollDepthLayer depth={0.45} shiftX={-10} rotateY={2}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex-shrink-0"
            >
              <img
                src={udankaarLogo.src}
                alt="Udankaar Logo"
                className="
                  w-32 h-32
                  xs:w-36 xs:h-36
                  sm:w-44 sm:h-44
                  md:w-52 md:h-52
                  lg:w-60 lg:h-60
                  xl:w-72 xl:h-72
                  object-contain drop-shadow-xl hover:scale-[1.03] transition-transform duration-300
                "
              />
            </motion.div>
          </ScrollDepthLayer>

          <ScrollDepthLayer depth={0.38} shiftX={8} rotateY={1.4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <h1
                className="font-black tracking-widest uppercase leading-none text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                style={{
                  background: `url(${harvestFestival.src}) center/cover`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "0.12em",
                }}
              >
                UDANKAAR
              </h1>

              <p className="mt-3 sm:mt-4 md:mt-5 text-gray-600 text-xs xs:text-sm sm:text-[0.88rem] md:text-[0.92rem] lg:text-base leading-relaxed max-w-[260px] xs:max-w-xs sm:max-w-sm md:max-w-md">
                Welcome to &lsquo;Udankaar,&rsquo; a captivating series
                dedicated to the rich tapestry of art, life, and culture in the
                Himalayas, proudly brought to you by team Devasthali.
              </p>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="mt-5 sm:mt-6 px-6 py-2 xs:px-7 xs:py-2.5 sm:px-7 sm:py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold text-xs xs:text-sm sm:text-sm md:text-base rounded-full shadow-md hover:shadow-orange-300/60 transition-shadow duration-300"
                onClick={() =>
                  router.push("/components/sections/Udankaar/Udankaar-page")
                }
              >
                Watch More
              </motion.button>
            </motion.div>
          </ScrollDepthLayer>
        </div>
      </div>

      {/* ── 3D COVERFLOW CAROUSEL ── */}
      <div className="relative z-20 w-full pb-10 xs:pb-12 sm:pb-14 md:pb-16 lg:pb-20 pt-2 sm:pt-3">
        {videos.length > 0 ? (
          <>
            {/* Track */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: `${geo.ACT_H + 60}px`,
                perspective: "1800px",
                perspectiveOrigin: "50% 50%",
              }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                {videos.map((video, i) => (
                  <div key={video._id} style={cardStyle(i, videos.length)}>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full h-full"
                      onClick={(e) => {
                        if (isDragging.current) {
                          e.preventDefault();
                          return;
                        }
                        const offset =
                          (((i - active) % videos.length) + videos.length) %
                          videos.length;
                        const norm =
                          offset > videos.length / 2
                            ? offset - videos.length
                            : offset;
                        if (norm !== 0) {
                          e.preventDefault();
                          setActive(i);
                          startTimer();
                        }
                      }}
                    >
                      <img
                        src={video.image}
                        alt={video.title}
                        draggable={false}
                        className="w-full h-full object-cover select-none"
                      />
                      {/* bottom gradient + title */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.12) 45%, transparent 70%)",
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-3 sm:px-3 sm:pb-4">
                        <p
                          className="text-white font-bold line-clamp-2 leading-tight"
                          style={{ fontSize: "clamp(0.58rem, 1.2vw, 0.88rem)" }}
                        >
                          {video.title}
                        </p>
                        <p
                          className="text-yellow-400 mt-0.5 sm:mt-1"
                          style={{
                            fontSize: "clamp(0.48rem, 0.85vw, 0.62rem)",
                          }}
                        >
                          Watch full episode on
                          <br />
                          <span className="font-semibold">
                            <span className="text-red-600">▶</span>{" "}
                            <span className="text-white">@TeamDevashthali</span>
                          </span>
                        </p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/*if we need Dot indicators then we will add*/}
            {/* <div className="flex items-center justify-center gap-1.5 xs:gap-2 mt-3 sm:mt-4">
              {videos.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    setActive(i);
                    startTimer();
                  }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "20px" : "6px",
                    height: "6px",
                    background:
                      i === active
                        ? "linear-gradient(to right, #facc15, #f97316)"
                        : "rgba(0,0,0,0.22)",
                  }}
                />
              ))}
            </div> */}
          </>
        ) : (
          <div className="mx-4 xs:mx-6 sm:mx-auto sm:max-w-xl rounded-2xl bg-white/80 px-6 xs:px-8 py-10 xs:py-12 text-center text-gray-600 shadow-md text-sm">
            Udankaar entries from the admin panel will appear here.
          </div>
        )}
      </div>
    </section>
  );
}
