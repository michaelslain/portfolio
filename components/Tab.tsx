"use client";

import { FC, useState, ReactNode, MouseEvent } from "react";

interface TabProps {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const Tab: FC<TabProps> = ({ href, children, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={onClick}
      className="relative text-sm inline-block cursor-pointer"
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
    </a>
  );
};

export default Tab;
