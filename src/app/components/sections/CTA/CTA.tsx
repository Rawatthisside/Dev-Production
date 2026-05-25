"use client";

import { motion } from "framer-motion";
import ScrollDepthLayer from "@/app/components/shared/ScrollDepthLayer";

const CTA = () => {
  return (
    <section className="bg-gradient-golden py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <ScrollDepthLayer depth={0.25} lift={22} rotateX={1.2}>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl font-heading font-bold text-golden-foreground"
          >
            Ready to explore the culture?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{
              duration: 1.05,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-card text-foreground font-body font-semibold rounded-full shadow-lg"
            >
              Leave for Now
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById("events")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-mountain text-card font-body font-semibold rounded-full shadow-lg"
            >
              Book for Events
            </motion.button>

          </motion.div>

        </ScrollDepthLayer>
      </div>
    </section>
  );
};

export default CTA;