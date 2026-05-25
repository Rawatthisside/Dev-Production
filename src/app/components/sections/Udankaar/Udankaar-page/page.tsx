"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const logo = "/udankaar/assets/udankaar-logo-optimized.png";

type UdankaarEntry = {
  _id: string;
  title?: string;
  photo?: string;
  youtubeLink?: string;
  seo?: {
    title?: string;
    keywords?: string[];
  };
};

type Video = {
  _id: string;
  title: string;
  category: string;
  image: string;
  url: string;
};

function mapEntryToVideo(entry: UdankaarEntry): Video | null {
  const title = entry.title?.trim() || entry.seo?.title?.trim() || "Untitled Udankaar";
  const image = entry.photo?.trim() || "";
  const url = entry.youtubeLink?.trim() || "";
  const category = entry.seo?.keywords?.[0]?.trim() || "Udankaar";

  if (!image || !url) {
    return null;
  }

  return {
    _id: entry._id,
    title,
    category,
    image,
    url,
  };
}

export default function DevasthaliPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
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
        console.error("Failed to fetch Udankaar entries", err);
      }
    };

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ["All", ...new Set(videos.map((v) => v.category))];

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8]">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white py-10 flex flex-col items-center shadow-lg"
      >
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
              return;
            }

            router.push("/");
          }}
          className="self-start ml-6 md:ml-10 mb-4 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          ← Back
        </button>
        <motion.img
          src={logo}
          alt="Udankaar Logo"
          className="w-40 md:w-52 mb-6"
          whileHover={{ scale: 1.05 }}
        />

        <motion.h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 bg-clip-text text-transparent">
          UDAANKAAR
        </motion.h1>
      </motion.div>

      {/* FILTER */}
      <div className="p-6 md:p-10">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredVideos.length === 0 ? (
            <div className="col-span-full rounded-xl bg-white px-6 py-10 text-center text-gray-700 shadow-lg">
              Udankaar entries from the admin panel will appear here.
            </div>
          ) : null}

          {filteredVideos.map((video, index) => (
            <motion.a
              key={video._id}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            >
              {/* IMAGE */}
              <div className="relative aspect-video">
                <motion.img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                />

                {/* PLAY */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    &#9654;
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <p className="text-sm line-clamp-3 mb-3">{video.title}</p>

                <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600">
                  {video.category}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
