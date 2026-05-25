"use client";

import { motion } from "framer-motion";
import {
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

type SocialIconProps = {
  size?: number;
  className?: string;
};

const InstagramIcon = ({ size = 16, className = "" }: SocialIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 16, className = "" }: SocialIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 16, className = "" }: SocialIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7.5v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const YoutubeIcon = ({ size = 16, className = "" }: SocialIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  const scrollTo = (id: string) => {
    const targetId =
      id === "Podcast"
        ? "podcast"
        : id.toLowerCase().replace(/\s/g, "-");

    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-dark text-dark-foreground relative overflow-hidden border-t border-dark-foreground/10">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-golden/5 blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <h3 className="font-heading text-2xl font-bold text-card tracking-wide">
              DEVASTHALI
            </h3>
            <p className="mt-4 font-body text-sm text-dark-foreground/70 leading-relaxed">
              A cultural storytelling platform dedicated to preserving the rich heritage and traditions of Uttarakhand.
            </p>

            <div className="flex items-center gap-4 mt-6">
              {[
                { Icon: InstagramIcon, href: "https://instagram.com/devasthali__official?igshid=MzRlODBiNWFlZA==" },
                { Icon: FacebookIcon, href: "https://facebook.com/profile.php?id=100068783916287&mibextid=2JQ9oc" },
                { Icon: TwitterIcon, href: "https://twitter.com/TeamDevasthali" },
                { Icon: YoutubeIcon, href: "https://www.youtube.com/@TeamDevasthali" },
              ].map(({ Icon, href }, idx) => (
                <motion.a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full bg-dark-foreground/5 flex items-center justify-center text-dark-foreground/70 hover:bg-golden hover:text-dark transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg font-semibold text-card mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-golden rounded-full"></span>
            </h4>

            <ul className="space-y-3 font-body text-sm text-dark-foreground/70">
              {["Home", "Articles", "Podcast", "About Us", "Events"].map((l) => (
                <li key={l}>
                  <button
                    onClick={() => scrollTo(l)}
                    className="flex items-center gap-2 hover:text-golden hover:translate-x-1 transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-golden/50"></span>
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg font-semibold text-card mb-5 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-golden rounded-full"></span>
            </h4>

            <ul className="space-y-4 font-body text-sm text-dark-foreground/70">
              <li className="flex items-start gap-3 hover:text-golden transition-colors">
                <Mail size={18} className="mt-0.5 text-golden" />
                <span className="break-words">
                  devasthaligoingbacktoourroots@gmail.com
                </span>
              </li>

              <li className="flex items-start gap-3 hover:text-golden transition-colors">
                <Phone size={18} className="mt-0.5 text-golden" />
                <span>+91 81719 64201</span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-golden" />
                <span>Dehradun, Uttarakhand, India</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg font-semibold text-card mb-5 relative inline-block">
              Stay Updated
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-golden rounded-full"></span>
            </h4>

            <p className="font-body text-sm text-dark-foreground/70 mb-4">
              Subscribe to our newsletter for the latest stories and events.
            </p>

            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-dark-foreground/5 border border-dark-foreground/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden/50 transition-all"
                required
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-golden text-dark font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-golden/90 transition-colors"
              >
                Subscribe <Send size={16} />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-dark-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-sm text-dark-foreground/50">
            © {new Date().getFullYear()} Devasthali. All Rights Reserved.
          </p>

          <motion.button
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="w-12 h-12 rounded-full bg-dark-foreground/5 border border-dark-foreground/10 hover:bg-golden flex items-center justify-center"
          >
            <ArrowUp size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
