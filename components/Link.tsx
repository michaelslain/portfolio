"use client";

import { FC, useState } from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const Link: FC<LinkProps> = ({ children, className = "", ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      className={`relative text-sm inline-block cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Sans text - always present but invisible when hovered */}
      <span
        className={`font-body uppercase underline ${isHovered ? "invisible" : "visible"}`}
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

export default Link;
