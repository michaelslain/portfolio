import type { FC, ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  customHeight?: string;
}

const Section: FC<SectionProps> = ({
  children,
  className = "",
  fullHeight = true,
  customHeight,
}) => {
  const heightClass = customHeight
    ? ""
    : fullHeight
      ? "h-screen"
      : "";
  const heightStyle = customHeight ? { height: customHeight } : {};

  return (
    <div
      className={`w-screen relative ${heightClass} ${className}`}
      style={heightStyle}
      data-scroll-section
    >
      {children}
    </div>
  );
};

export default Section;
