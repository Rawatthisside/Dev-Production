import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import ScrollRevealController from "@/app/components/shared/ScrollRevealController";
import LazySection from "@/app/components/shared/LazySection";

import HeroSection from "@/app/components/sections/Hero/Hero";
import UdankaarSection from "@/app/components/sections/Udankaar/Udankaar";
import ExploreSection from "@/app/components/sections/Explore/Explore";
import GhostVillagesSection from "@/app/components/sections/GhostVillage/GhostVillage";
import DictionarySection from "@/app/components/sections/Dictionary/Dictionary";
import AchievementsSection from "@/app/components/sections/Achievements/Achievements";
import RammanSection from "@/app/components/sections/Rammaan/Rammaan";
import CoreTeamSection from "@/app/components/sections/CoreTeam/CoreTeam";
import EventsBookingSection from "@/app/components/sections/EventsBooking/EventsBooking";
import CTASection from "@/app/components/sections/CTA/CTA";

export default function Home() {
  return (
    
    <div className="min-h-screen overflow-x-hidden" data-scroll-reveal-root>
      <ScrollRevealController />

      <Navbar />
      <HeroSection />

      <LazySection component={UdankaarSection} />
      <LazySection component={ExploreSection} />
      <LazySection component={GhostVillagesSection} />
      <LazySection component={DictionarySection} />
      <LazySection component={AchievementsSection} />
      <LazySection component={RammanSection} />
      <LazySection component={CoreTeamSection} />
      <LazySection component={EventsBookingSection} />
      <LazySection component={CTASection} />

      <Footer />
    </div>
  );
}
