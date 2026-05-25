"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Clouds
import cloudLayer1 from "@/app/components/shared/assets/Layer 2 copy 6.png";
import cloudLayer2 from "@/app/components/shared/assets/Layer 2 copy 5.png";
import cloudLayer3 from "@/app/components/shared/assets/Layer 2 copy 2.png";

// Local assets
import buransh from "./assets/buransh.png";
import mainImg from "./assets/exp1p.png";
import small1 from "./assets/exp4p.png";
import small2 from "./assets/exp5p.png";
import small3 from "./assets/exp6p.png";
import rightTopImg from "./assets/exp2p.png";
import rightBottomImg from "./assets/exp3p.png";

const Explore = () => {
  const router = useRouter();

  return (
    <section id="articles" className="relative w-full pt-12 pb-48 overflow-hidden min-h-screen">

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/media/explore-section-background.png"
          alt="Explore section background"
          fill
          className="object-cover"
        />
      </div>

      {/* CLOUDS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">

        {/* Layer 1 */}
        <motion.div
          className="absolute -top-10 left-0 flex w-[200%] opacity-100 h-[50%]"
          animate={{ x: ["0%", "-50%"], y: [0, 40, 0] }}
          transition={{
            x: { duration: 180, ease: "linear", repeat: Infinity },
            y: { duration: 15, ease: "easeInOut", repeat: Infinity }
          }}
        >
          <Image src={cloudLayer1} alt="" className="w-1/2 h-full object-cover" />
          <Image src={cloudLayer1} alt="" className="w-1/2 h-full object-cover" />
        </motion.div>

        {/* Layer 2 */}
        <motion.div
          className="absolute top-[2%] left-0 flex w-[200%] opacity-100 h-[45%]"
          animate={{ x: ["-50%", "0%"], y: [0, -50, 0] }}
          transition={{
            x: { duration: 120, ease: "linear", repeat: Infinity },
            y: { duration: 12, ease: "easeInOut", repeat: Infinity }
          }}
        >
          <Image src={cloudLayer2} alt="" className="w-1/2 h-full object-cover" />
          <Image src={cloudLayer2} alt="" className="w-1/2 h-full object-cover" />
        </motion.div>

        {/* Layer 3 */}
        <motion.div
          className="absolute top-0 left-0 flex w-[200%] opacity-100 h-[40%]"
          animate={{ x: ["0%", "-50%"], y: [-20, 30, -20] }}
          transition={{
            x: { duration: 80, ease: "linear", repeat: Infinity },
            y: { duration: 10, ease: "easeInOut", repeat: Infinity }
          }}
        >
          <Image src={cloudLayer3} alt="" className="w-1/2 h-full object-cover" />
          <Image src={cloudLayer3} alt="" className="w-1/2 h-full object-cover" />
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT */}
          <div className="lg:col-span-7 flex flex-col">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl overflow-hidden shadow-2xl mb-6 h-[300px] md:h-[400px] border-2 border-white/20 relative group"
            >
              <Image src={mainImg} alt="Nanda Devi" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.05, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-heading leading-tight drop-shadow-lg">
                लता नंदा देवी मंदिर एक प्राचीन
              </h2>
              <p className="text-white text-sm md:text-base leading-relaxed mb-6 font-body max-w-2xl drop-shadow-md">
                मदर अपन पारपरक वाकला क लए जाना जाता ह...
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 md:gap-6"
            >
              {[small1, small2, small3].map((imgSrc, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden shadow-lg h-24 md:h-32 border-2 border-white/20 hover:scale-105 transition-all duration-300 relative">
                  <Image src={imgSrc} alt="" fill className="object-cover" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 flex flex-col gap-6 pt-4 lg:pt-0">

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.05, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-full rounded-[2rem] overflow-hidden shadow-2xl h-48 md:h-56 border-2 border-white/20 group cursor-pointer relative">
                <Image src={rightTopImg} alt="" fill className="object-cover group-hover:scale-110 transition-duration-500" />
              </div>
              <h3 className="text-white text-lg md:text-xl font-semibold mt-4 text-center drop-shadow-lg">माघ मेला</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.05, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="w-full rounded-[2rem] overflow-hidden shadow-2xl h-48 md:h-56 border-2 border-white/20 group cursor-pointer relative">
                <Image src={rightBottomImg} alt="" fill className="object-cover group-hover:scale-110 transition-duration-500" />
              </div>
              <h3 className="text-white text-lg md:text-xl font-semibold mt-4 text-center drop-shadow-lg">हिल जात्रा</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 md:mt-8 ml-2 space-y-4"
            >
              <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-md leading-tight">
                Explore <span className="text-[#FFC107]">Uttarakhand</span>
              </h2>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/articles")}
                className="inline-block text-white text-sm md:text-base px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm shadow-md"
              >
                Read more
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* WAVE */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden z-10">
        <svg viewBox="0 0 1440 120" fill="white" className="w-full h-[80px] md:h-[120px]" preserveAspectRatio="none">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L0,120Z" />
        </svg>
      </div>

      {/* BURANSH */}
      <div className="absolute bottom-0 left-0 w-full overflow-visible z-20 pointer-events-none h-32 md:h-40">
        <div className="flex w-full h-full items-end justify-around absolute bottom-0">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <motion.img
                src={buransh.src}
                className="w-20 md:w-32 lg:w-40"
                style={{ transformOrigin: "top center" }}
                animate={{ rotate: [i % 2 === 0 ? 8 : -8, i % 2 === 0 ? -8 : 8] }}
                transition={{
                  duration: 3 + (i % 3) * 0.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: i * 0.2
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;
