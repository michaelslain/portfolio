"use client";

import { FC, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/Text";

interface HeadingTrail {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface TriangleData {
  id: number;
  displayText: string;
}

const TEXTS = [
  "visual design",
  "branding",
  "creative coding",
  "web development",
  "prototyping",
  "brainstorming",
  "graphic design",
  "creation",
  "experience creator",
  "multidisciplinary practice",
  "mathematics",
  "art",
  "visionary",
  "computer science",
  "web design",
  "ui/ux",
];
const EMOJIS = [
  "🎨",
  "✨",
  "🌟",
  "💫",
  "🔥",
  "⚡",
  "🎭",
  "🎪",
  "🎯",
  "🎲",
  "🌈",
  "🦄",
];
const EMOJI_CHANCE = 0.15; // 15% chance
const CREATE_INTERVAL = 300; // 0.3 seconds
const MIN_TRIANGLE_AREA = 1000; // Minimum area to draw triangle (avoid thin triangles)
const MIN_POINT_DISTANCE = 50; // Minimum distance between consecutive points (in pixels)

const CursorEffect: FC = () => {
  const [headings, setHeadings] = useState<HeadingTrail[]>([]);
  const [triangleData, setTriangleData] = useState<Map<number, TriangleData>>(
    new Map(),
  );
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const headingIdRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const createIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      setIsMouseMoving(true);

      // Clear existing timeout
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }

      // Set mouse as not moving after 200ms of no movement
      mouseMoveTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 200);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMouseMoving) {
      // Start creating headings
      createIntervalRef.current = setInterval(() => {
        const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
        const newHeading: HeadingTrail = {
          id: headingIdRef.current++,
          text: randomText,
          x: lastMousePosRef.current.x,
          y: lastMousePosRef.current.y,
        };

        setHeadings((prev) => {
          // Check if new point is too close to the last point
          if (prev.length > 0) {
            const lastPoint = prev[prev.length - 1];
            const distance = Math.sqrt(
              Math.pow(newHeading.x - lastPoint.x, 2) +
                Math.pow(newHeading.y - lastPoint.y, 2),
            );

            // Skip adding this point if it's too close
            if (distance < MIN_POINT_DISTANCE) {
              return prev;
            }
          }

          const updated = [...prev, newHeading];

          // Limit to 4 points maximum - remove oldest if we exceed
          const limited = updated.length > 4 ? updated.slice(-4) : updated;

          // Clean up old triangle data when points are removed
          if (updated.length > 4) {
            const removedPoint = updated[0];
            setTriangleData((prevData) => {
              const newData = new Map(prevData);
              newData.delete(removedPoint.id);
              return newData;
            });
          }

          // Check if we should create triangle data for this new heading
          // With 4 points max: triangles at indices 2 and 3
          const index = limited.length - 1;
          if (index >= 2) {
            const point1 = limited[index - 2];
            const point2 = limited[index - 1];
            const point3 = newHeading;

            // Calculate triangle area
            const area = Math.abs(
              (point1.x * (point2.y - point3.y) +
                point2.x * (point3.y - point1.y) +
                point3.x * (point1.y - point2.y)) /
                2,
            );

            // Only create triangle data if area is large enough
            if (area >= MIN_TRIANGLE_AREA) {
              const showEmoji = Math.random() < EMOJI_CHANCE;
              const displayText = showEmoji
                ? `A = ${EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}`
                : `A = ${area.toFixed(0)}`;

              setTriangleData((prevData) => {
                const newData = new Map(prevData);
                newData.set(newHeading.id, {
                  id: newHeading.id,
                  displayText,
                });
                return newData;
              });
            }
          }

          return limited;
        });
      }, CREATE_INTERVAL);
    } else {
      // Stop creating headings
      if (createIntervalRef.current) {
        clearInterval(createIntervalRef.current);
        createIntervalRef.current = null;
      }
    }

    return () => {
      if (createIntervalRef.current) {
        clearInterval(createIntervalRef.current);
      }
    };
  }, [isMouseMoving]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Draw triangles - any 3 consecutive points form a triangle */}
        {headings.map((heading, index) => {
          // Draw triangle starting from the 3rd point (index 2) onwards
          if (index < 2) return null;

          // Check if we have triangle data for this heading
          const triData = triangleData.get(heading.id);
          if (!triData) return null; // Don't draw if area was too small

          const point1 = headings[index - 2];
          const point2 = headings[index - 1];
          const point3 = heading;

          // Calculate centroid for text placement
          const centroidX = (point1.x + point2.x + point3.x) / 3;
          const centroidY = (point1.y + point2.y + point3.y) / 3;

          return (
            <g key={`triangle-${heading.id}`}>
              {/* Faint dashed line from point1 to point3 */}
              <line
                x1={point1.x}
                y1={point1.y}
                x2={point3.x}
                y2={point3.y}
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              {/* Area text */}
              <motion.text
                x={centroidX}
                y={centroidY}
                fill="var(--accent)"
                fontSize="12"
                fontFamily="monospace"
                textAnchor="middle"
                dominantBaseline="middle"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {triData.displayText}
              </motion.text>
            </g>
          );
        })}

        {/* Draw lines between consecutive headings */}
        {headings.map((heading, index) => {
          if (index === 0) {
            // First heading - just show the starting dot
            return (
              <motion.rect
                key={`dot-${heading.id}`}
                x={heading.x - 3}
                y={heading.y - 3}
                width="6"
                height="6"
                fill="var(--accent)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            );
          }
          const prevHeading = headings[index - 1];
          return (
            <g key={`line-group-${heading.id}`}>
              <motion.line
                x1={prevHeading.x}
                y1={prevHeading.y}
                x2={heading.x}
                y2={heading.y}
                stroke="var(--accent)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* Red square dot at the end of the line */}
              <motion.rect
                x={heading.x - 3}
                y={heading.y - 3}
                width="6"
                height="6"
                fill="var(--accent)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Render headings */}
      <AnimatePresence>
        {headings.map((heading, index) => {
          const isNewest = index === headings.length - 1;
          return (
            <motion.div
              key={heading.id}
              className="absolute"
              style={{
                left: heading.x,
                top: heading.y,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Text
                className="text-accent"
                style={{
                  fontStyle: isNewest ? "italic" : "normal",
                }}
              >
                {heading.text}
              </Text>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CursorEffect;
