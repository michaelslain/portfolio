"use client";

import {
  useEffect,
  useRef,
  FC,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { usePathname } from "next/navigation";

interface ScrollContextType {
  scroll: any | null;
}

const ScrollContext = createContext<ScrollContextType>({ scroll: null });

export const useLocomotiveScroll = () => useContext(ScrollContext);

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll: FC<SmoothScrollProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const scrollInstance = useRef<any>(null);

  useEffect(() => {
    let scroll: any;

    const initScroll = async () => {
      if (!scrollRef.current) return;

      // Wait for DOM to be fully ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 1,
        class: "is-inview",
      });

      scrollInstance.current = scroll;

      // Expose scroll instance globally for other components
      (window as any).__locomotiveScroll = scroll;

      // Multiple updates to ensure DOM is fully rendered
      setTimeout(() => {
        if (scroll) scroll.update();
      }, 100);

      setTimeout(() => {
        if (scroll) scroll.update();
      }, 500);

      setTimeout(() => {
        if (scroll) scroll.update();
      }, 1000);
    };

    initScroll();

    // Update on window resize
    const handleResize = () => {
      if (scroll) {
        // Call update multiple times to catch layout changes
        scroll.update();
        setTimeout(() => scroll.update(), 100);
        setTimeout(() => scroll.update(), 300);
      }
    };

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (scroll) {
        scroll.destroy();
        (window as any).__locomotiveScroll = null;
      }
    };
  }, [pathname]);

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      style={{
        overflow: "visible",
        perspective: "1px",
      }}
    >
      {children}
    </div>
  );
};

export default SmoothScroll;
