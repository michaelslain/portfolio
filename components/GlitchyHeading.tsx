"use client";

import { FC, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlitchyHeadingProps {
  children: React.ReactNode;
}

interface GlitchClone {
  id: number;
  x: number;
  y: number;
  opacity: number;
  hue: number;
}

// Constants
const MAX_DURABILITY = 800;
const DAMAGE_MULTIPLIER = 0.3;
const MAX_DAMAGE = 8;
const MIN_DAMAGE_THRESHOLD = 0.5;
const RECOVERY_DELAY = 300;
const RECOVERY_RATE = 5;
const RECOVERY_INTERVAL = 50;
const MAX_GLITCH_CLONES = 8;

const GlitchyHeading: FC<GlitchyHeadingProps> = ({ children }) => {
  const [glitchClones, setGlitchClones] = useState<GlitchClone[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [durability, setDurability] = useState(MAX_DURABILITY);

  const headingRef = useRef<HTMLDivElement>(null);
  const cloneIdRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const durabilityRecoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const durabilityRecoveryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomChar = (originalChar: string) => {
    const chars = ["Δ", "θ", "φ", "1", "0", "α", "β", "γ", "ω", "π"];
    return Math.random() > 0.3
      ? originalChar
      : chars[Math.floor(Math.random() * chars.length)];
  };

  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    return () => {
      if (durabilityRecoveryTimeoutRef.current) {
        clearTimeout(durabilityRecoveryTimeoutRef.current);
        durabilityRecoveryTimeoutRef.current = null;
      }
      if (durabilityRecoveryIntervalRef.current) {
        clearInterval(durabilityRecoveryIntervalRef.current);
        durabilityRecoveryIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      const dx = currentPos.x - lastMousePosRef.current.x;
      const dy = currentPos.y - lastMousePosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const damage = Math.min(speed * DAMAGE_MULTIPLIER, MAX_DAMAGE);

      if (damage > MIN_DAMAGE_THRESHOLD) {
        setDurability((prev) => {
          const newDurability = Math.max(0, prev - damage);

          if (Math.random() > 0.3) {
            const intensity = 1 - newDurability / MAX_DURABILITY;
            const newClone: GlitchClone = {
              id: cloneIdRef.current++,
              x: (Math.random() - 0.5) * 50 * intensity,
              y: (Math.random() - 0.5) * 50 * intensity,
              opacity: (0.3 + Math.random() * 0.4) * intensity,
              hue: Math.random() * 360,
            };

            setGlitchClones((prev) => [
              ...prev.slice(-MAX_GLITCH_CLONES + 1),
              newClone,
            ]);
          }

          return newDurability;
        });
      }

      lastMousePosRef.current = currentPos;

      // Clear existing recovery timers
      if (durabilityRecoveryTimeoutRef.current) {
        clearTimeout(durabilityRecoveryTimeoutRef.current);
        durabilityRecoveryTimeoutRef.current = null;
      }
      if (durabilityRecoveryIntervalRef.current) {
        clearInterval(durabilityRecoveryIntervalRef.current);
        durabilityRecoveryIntervalRef.current = null;
      }

      // Start new recovery timeout
      durabilityRecoveryTimeoutRef.current = setTimeout(() => {
        durabilityRecoveryIntervalRef.current = setInterval(() => {
          setDurability((prev) => {
            if (prev >= MAX_DURABILITY) {
              if (durabilityRecoveryIntervalRef.current) {
                clearInterval(durabilityRecoveryIntervalRef.current);
                durabilityRecoveryIntervalRef.current = null;
              }
              return MAX_DURABILITY;
            }
            return Math.min(MAX_DURABILITY, prev + RECOVERY_RATE);
          });
        }, RECOVERY_INTERVAL);
      }, RECOVERY_DELAY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [durability]);

  useEffect(() => {
    if (glitchClones.length > 0) {
      const timer = setTimeout(() => {
        setGlitchClones((prev) => prev.slice(1));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [glitchClones]);

  // Clear glitch clones when durability is high (healing effect)
  useEffect(() => {
    const intensity = 1 - durability / MAX_DURABILITY;
    // If durability is high (low intensity), clear glitches faster
    if (intensity < 0.3 && glitchClones.length > 0) {
      setGlitchClones([]);
    }
  }, [durability, glitchClones.length]);

  return (
    <>
      <motion.div
        ref={headingRef}
        className="relative overflow-visible"
        style={{
          paddingBottom: "10px",
          zIndex: 10,
        }}
        initial={{
          clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
        }}
        animate={{
          clipPath: isInitialLoad
            ? "polygon(0 0, 0 0, 0 0, 0 0)"
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
        transition={{
          clipPath: { duration: 0.5, ease: "easeOut", delay: 0.0 },
        }}
      >
        {children}

        <AnimatePresence>
          {glitchClones.map((clone) => (
            <motion.div
              key={clone.id}
              className="absolute inset-0 pointer-events-none select-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: clone.opacity,
                x: clone.x,
                y: clone.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                filter: `hue-rotate(${clone.hue}deg)`,
                mixBlendMode: "screen",
              }}
            >
              {children}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default GlitchyHeading;
