"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1000);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const targetId = id === "Podcast" ? "podcast" : id.toLowerCase().replace(/\s/g, "-");
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const activeItem = navItems.find((item) => item.id === activeTab);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* ── DESKTOP (≥1000px) ── centered pill nav, logo absolute left */}
      {!isMobile && (
        <div className="flex items-start justify-center px-8 pt-6">
          {/* Logo */}
          <motion.div
            onClick={() => scrollTo("Home")}
            className="absolute left-8 cursor-pointer"
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

          {/* Pill nav */}
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1, scale: scrolled ? 0.95 : 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-full p-2 shadow-lg"
          >
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} className="relative shrink-0">
                    <motion.button
                      onClick={() => scrollTo(item.id)}
                      className="relative z-10 px-4 py-2 rounded-full text-sm font-semibold"
                      style={{ color: isActive ? item.activeText : "#333" }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                    </motion.button>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill-desktop"
                        className="absolute inset-0 rounded-full -z-0"
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
      )}

      {/* ── MOBILE (<1000px) ── logo left, hamburger right */}
      {isMobile && (
        <div
          ref={menuRef}
          className="flex items-center justify-between px-4 pt-4"
        >
          {/* Logo */}
          <motion.div
            onClick={() => scrollTo("Home")}
            className="cursor-pointer"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center h-12 px-2 bg-white/85 backdrop-blur-md rounded-full shadow-md border border-white/30">
              <Image
                src="/logo.png"
                alt="Devasthali"
                width={100}
                height={48}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Hamburger button */}
          <motion.button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="h-12 w-12 rounded-full bg-white shadow-md border border-white/30 flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </motion.button>

          {/* Dropdown — rendered outside the flex row so it doesn't push layout */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[72px] right-4 bg-white rounded-2xl shadow-xl p-2 min-w-[180px] border border-white/30"
              >
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollTo(item.id)}
                          className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                          style={{
                            backgroundColor: isActive ? item.bgColor : "transparent",
                            color: isActive ? item.activeText : "#333",
                          }}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Navbar;