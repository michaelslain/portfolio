"use client";

import { FC, useState } from "react";
import Text from "@/components/Text";
import ArcSlider from "@/components/ArcSlider";
import Heading from "@/components/Heading";
import Section from "@/components/Section";

const AboutSection: FC = () => {
  const [isDetailed, setIsDetailed] = useState(false);

  return (
    <Section className="flex flex-col items-center justify-center z-20">
      <Heading level="h1" className="mb-20 relative z-20">
        who am I?
      </Heading>
      <div className="flex flex-col items-center gap-10">
        <ArcSlider onModeChange={setIsDetailed} />
        <Text
          className={`${isDetailed ? "w-2xl" : "w-sm"} text-center relative z-0`}
        >
          {isDetailed
            ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            : "I am Michael Slain, freelance fullstack web developer & designer based in berkeley, california bay area."}
        </Text>
      </div>
    </Section>
  );
};

export default AboutSection;
