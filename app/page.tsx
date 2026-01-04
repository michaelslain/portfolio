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
      <div id="hero">
        <HeroSection />
      </div>

      <div className="relative">
        <div id="about">
          <AboutSection />
        </div>
        <AsciiVideoSection />
      </div>

      <div id="skills">
        <SkillsSection />
      </div>

      <div id="experience">
        <ExperienceSection />
      </div>

      <div id="work">
        <WorkSection />
      </div>

      <div id="process">
        <ProcessSection />
      </div>

      <div id="contact">
        <FooterSection />
      </div>
    </div>
  );
};

export default Home;
