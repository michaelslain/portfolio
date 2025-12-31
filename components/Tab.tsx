"use client";

import { FC, useState, ReactNode } from "react";
import Link from "next/link";

interface TabProps {
  href: string;
  children: ReactNode;
}

const Tab: FC<TabProps> = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className="relative text-sm inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sans text - always present but invisible when hovered */}
      <span
        className={`font-body uppercase ${isHovered ? "invisible" : "visible"}`}
      >
        {children}
      </span>

      {/* Serif text - positioned absolutely and centered */}
      <span
        className={`font-heading italic lowercase text-[1.2rem] text-accent absolute inset-0 flex items-center justify-center underline ${isHovered ? "visible" : "invisible"}`}
      >
        {children}
      </span>
    </Link>
  );
};

export default Tab;
