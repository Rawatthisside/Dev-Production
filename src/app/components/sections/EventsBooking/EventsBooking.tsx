"use client";

import { motion } from "framer-motion";
import { type ChangeEvent, useState } from "react";
import Image from "next/image";
import { User, Calendar, Mail, Phone, MapPin } from "lucide-react";

// Local asset
import harvestFestival from "./assets/ev1.jpg";

// Animations (UNCHANGED)
const formContainerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.05,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const EventsBooking = () => {
  const [form, setForm] = useState({
    name: "",
    date: "",
    email: "",
    mobile: "",
    eventType: "",
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="events"
      className="relative min-h-[80vh] flex items-center overflow-hidden py-24"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src={harvestFestival}
            alt=""
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/70 via-[#001f3f]/30 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 justify-between">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1 }}
            className="flex-1 max-w-xl text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.2 }}
              className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[#ffcc00]/30 bg-[#ffcc00]/10 text-[#ffcc00] font-semibold text-sm tracking-widest uppercase backdrop-blur-md shadow-sm"
            >
              Secure Your Spot
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">
              Book for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc00] to-yellow-200">
                Events
              </span>
            </h2>

            <p className="mt-6 font-body text-gray-100 text-lg md:text-xl leading-relaxed opacity-95 max-w-lg drop-shadow-md">
              Join us in celebrating the rich cultural heritage...
            </p>
          </motion.div>

          {/* FORM */}
          <motion.form
            variants={formContainerVariants}
            initial="hidden"
            whileInView="show"
            className="flex-1 w-full max-w-md relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="space-y-5 relative z-10">

              {/* INPUTS */}
              {[
                { name: "name", placeholder: "Full Name", type: "text", icon: User },
                { name: "date", placeholder: "Select Date", type: "date", icon: Calendar },
                { name: "email", placeholder: "Email Address", type: "email", icon: Mail },
                { name: "mobile", placeholder: "Mobile Number", type: "tel", icon: Phone },
              ].map((field) => (
                <motion.label key={field.name} variants={inputVariants} className="relative block w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/50">
                    <field.icon size={18} />
                  </div>

                  <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 text-white border border-white/10 focus:border-[#ffcc00]/50 outline-none"
                  />
                </motion.label>
              ))}

              {/* SELECT */}
              <motion.label variants={inputVariants} className="relative block w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/50">
                  <MapPin size={18} />
                </div>

                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 text-white border border-white/10"
                >
                  <option value="">Select Event Type</option>
                  <option value="festival">Festival</option>
                  <option value="workshop">Workshop</option>
                  <option value="cultural">Cultural Program</option>
                  <option value="trek">Heritage Trek</option>
                </select>
              </motion.label>

              {/* BUTTON */}
              <motion.div variants={inputVariants}>
                <motion.button
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="relative w-full py-4 bg-gradient-to-r from-[#ffcc00] to-yellow-500 text-[#001f3f] font-bold rounded-xl"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full"
                    animate={isHovered ? { translateX: "200%" } : { translateX: "-100%" }}
                    transition={{ duration: 0.7 }}
                  />
                  <span className="relative z-10">Secure Booking</span>
                </motion.button>
              </motion.div>

            </div>
          </motion.form>

        </div>
      </div>
    </section>
  );
};

export default EventsBooking;