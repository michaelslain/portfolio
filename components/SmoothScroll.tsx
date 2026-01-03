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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollContextType {
  scroll: any | null;
}

const ScrollContext = createContext<ScrollContextType>({ scroll: null });

export const useLocomotiveScroll = () => useContext(ScrollContext);

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll: FC<SmoothScrollProps> = ({ children }) => {
  const pathname = usePathname();
  const scrollInstance = useRef<any>(null);

  useEffect(() => {
    let scroll: any;

    const initScroll = async () => {
      // Wait for DOM to be fully ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      // V5 uses simplified initialization with scrollCallback option
      scroll = new LocomotiveScroll({
        lenisOptions: {
          duration: 1.2,
          smoothWheel: true,
        },
        scrollCallback: ScrollTrigger.update,
      });

      scrollInstance.current = scroll;

      // Expose scroll instance globally for other components
      (window as any).__locomotiveScroll = scroll;

      // Refresh ScrollTrigger after initialization
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);
    };

    initScroll();

    // Update on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (scroll) {
        scroll.destroy();
        (window as any).__locomotiveScroll = null;
      }
    };
  }, [pathname]);

  return <ScrollContext.Provider value={{ scroll: scrollInstance.current }}>{children}</ScrollContext.Provider>;
};

export default SmoothScroll;
