"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useIsMobile } from "@/app/hooks/use-mobile";

type NavItem = {
  id: string;
  label: string;
  bgColor: string;
  activeText: string;
};

const navItems: NavItem[] = [
  { id: "Home", label: "Home", bgColor: "#ff3600", activeText: "#ffffff" },
  { id: "Podcast", label: "Podcast", bgColor: "#0087d9", activeText: "#ffffff" },
  { id: "Articles", label: "Articles", bgColor: "#ffcc00", activeText: "#000000" },

  { id: "Ghost Villages", label: "Ghost Villages", bgColor: "#9F7AEA", activeText: "#ffffff" },
  { id: "Dictionary", label: "Dictionary", bgColor: "#FACC15", activeText: "#000000" },

  { id: "About Us", label: "About Us", bgColor: "#0a5f94", activeText: "#ffffff" },
  { id: "Events", label: "Events", bgColor: "#ff3600", activeText: "#ffffff" },
];

const Navbar = () => {
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveTab(id);

    const targetId =
      id === "Podcast"
        ? "podcast"
        : id.toLowerCase().replace(/\s/g, "-");

    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth" });

    if (isMobile) setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex items-center justify-center px-4 md:px-8 pointer-events-none">
      
      {/* LOGO */}
      <motion.div
        onClick={() => scrollTo("Home")}
        className="absolute left-4 md:left-8 pointer-events-auto cursor-pointer flex items-center justify-center"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center h-14 md:h-16 p-1 bg-white/85 backdrop-blur-md rounded-full shadow-md border border-white/30">
          <Image
            src="/logo.png" 
            alt="Devasthali"
            width={120}
            height={60}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1, scale: scrolled ? 0.95 : 1 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white pointer-events-auto rounded-full p-2 w-fit max-w-full shadow-lg"
      >
        {/* MOBILE MENU BUTTON */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="absolute right-2 top-2 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            ☰
          </button>
        )}

        {/* MENU ITEMS */}
        <ul
          className={`flex ${
            isMobile
              ? "flex-col gap-2 w-full"
              : "items-center gap-1 md:gap-2"
          } px-2 ${isMobile && !mobileMenuOpen ? "hidden" : ""}`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <li key={item.id} className="relative shrink-0">
                <motion.button
                  onClick={() => scrollTo(item.id)}
                  className="relative z-10 px-3 md:px-4 py-2 rounded-full text-sm md:text-base font-semibold"
                  style={{
                    color: isActive ? item.activeText : "#333",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                </motion.button>

                {/* ACTIVE BACKGROUND */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: item.bgColor }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
};

export default Navbar;