import type { FC } from "react";
import AboutSection from "@/components/sections/AboutSection";
import AsciiVideoSection from "@/components/sections/AsciiVideoSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import FooterSection from "@/components/sections/FooterSection";
import HeroSection from "@/components/sections/HeroSection";
import ProcessSection from "@/components/sections/ProcessSection";
import SkillsSection from "@/components/sections/SkillsSection";
import WorkSection from "@/components/sections/WorkSection";

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

      <WorkSection />

      <ProcessSection />

      <FooterSection />
    </div>
  );
};

export default Home;
