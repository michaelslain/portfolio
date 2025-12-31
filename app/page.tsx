import type { FC } from "react";
import AboutSection from "@/components/AboutSection";
import AsciiVideoSection from "@/components/AsciiVideoSection";
import ExperienceSection from "@/components/ExperienceSection";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import SkillsSection from "@/components/SkillsSection";

const Home: FC = () => {
  return (
    <div className="cursor-help">
      <HeroSection />

      <div className="relative">
        <AboutSection />
        <AsciiVideoSection />
      </div>

      <SkillsSection />

      <ExperienceSection />

      <ProcessSection />

      <FooterSection />
    </div>
  );
};

export default Home;
