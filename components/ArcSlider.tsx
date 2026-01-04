"use client";

import { FC, useState, useRef, useEffect, useMemo } from "react";

interface ArcSliderProps {
  onModeChange?: (isDetailed: boolean) => void;
}

const ArcSlider: FC<ArcSliderProps> = ({ onModeChange }) => {
  const [position, setPosition] = useState(0); // 0 to 1, where 0 is left (concise)
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const leftEyeRef = useRef<HTMLDivElement | null>(null);
  const rightEyeRef = useRef<HTMLDivElement | null>(null);

  // Arc parameters - wider and steeper
  const centerX = 300;
  const centerY = 200;
  const radius = 200;
  const startAngle = Math.PI * 0.85; // More towards bottom left
  const endAngle = Math.PI * 0.15; // More towards bottom right

  // Calculate the angle based on position
  const currentAngle = startAngle - position * (startAngle - endAngle);

  // Calculate slider knob position
  const knobX = centerX + radius * Math.cos(currentAngle);
  const knobY = centerY - radius * Math.sin(currentAngle);

  // Calculate text position (above the knob)
  const textX = knobX;
  const textY = knobY - 25;

  // Create the arc path with fixed precision to avoid hydration mismatches
  const startX = (centerX + radius * Math.cos(startAngle)).toFixed(2);
  const startY = (centerY - radius * Math.sin(startAngle)).toFixed(2);
  const endX = (centerX + radius * Math.cos(endAngle)).toFixed(2);
  const endY = (centerY - radius * Math.sin(endAngle)).toFixed(2);

  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  const calculatePositionFromCoords = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 600;
    const y = ((clientY - rect.top) / rect.height) * 250;

    // Calculate angle from center to click point
    const dx = x - centerX;
    const dy = centerY - y; // Inverted Y
    let angle = Math.atan2(dy, dx);

    // Normalize angle to 0-2π range
    if (angle < 0) angle += 2 * Math.PI;

    // Clamp angle to arc range
    if (angle > startAngle && angle < Math.PI) {
      angle = startAngle;
    } else if (angle < endAngle && angle > 0) {
      angle = endAngle;
    }

    // Convert angle to position (0-1)
    const newPosition = (startAngle - angle) / (startAngle - endAngle);
    setPosition(Math.max(0, Math.min(1, newPosition)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
    setIsDragging(true);
    calculatePositionFromCoords(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    calculatePositionFromCoords(e.clientX, e.clientY);
  };

  const animateToTarget = (target: number) => {
    setIsAnimating(true);
    const startPosition = position;
    const distance = target - startPosition;
    const startTime = performance.now();
    const duration = 600; // ms

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function that simulates gravity (ease-in-quad for acceleration)
      const easeInQuad = progress * progress;

      const newPosition = startPosition + distance * easeInQuad;
      setPosition(newPosition);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setPosition(target);
        setIsAnimating(false);
        animationRef.current = null;
        // Call the callback when animation completes
        if (onModeChange) {
          onModeChange(target === 1);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Determine target and start gravity animation
    const target = position < 0.5 ? 0 : 1;
    animateToTarget(target);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, position]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Track mouse position for eye following - optimized with throttling
  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdateTime = 0;
    const throttleMs = 50; // Update at most every 50ms (20fps for eye movement is enough)

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();

      if (rafId !== null || now - lastUpdateTime < throttleMs) return;

      rafId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        lastUpdateTime = performance.now();
        rafId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Calculate unified pupil position based on mouse position relative to both eyes - memoized
  const pupilPosition = useMemo(() => {
    if (!leftEyeRef.current || !rightEyeRef.current) return { x: 0, y: 0 };

    const leftRect = leftEyeRef.current.getBoundingClientRect();
    const rightRect = rightEyeRef.current.getBoundingClientRect();

    // Calculate center point between both eyes
    const centerX =
      (leftRect.left + leftRect.right + rightRect.left + rightRect.right) / 4;
    const centerY =
      (leftRect.top + leftRect.bottom + rightRect.top + rightRect.bottom) / 4;

    // Calculate angle from center to mouse
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const angle = Math.atan2(dy, dx);

    // Maximum distance pupil can move from center (elliptical boundaries)
    const maxDistanceX = 8;
    const maxDistanceY = 12; // Greater Y radius for vertical movement

    // Calculate distance, clamped to max
    const rawDistance = Math.sqrt(dx * dx + dy * dy);
    const normalizedDistance = Math.min(rawDistance / 100, 1); // Normalize to 0-1 range

    // Calculate final pupil position with elliptical boundaries (same for both eyes)
    const pupilX = Math.cos(angle) * normalizedDistance * maxDistanceX;
    const pupilY = Math.sin(angle) * normalizedDistance * maxDistanceY;

    return { x: pupilX, y: pupilY };
  }, [mousePos.x, mousePos.y]);

  const leftPupil = pupilPosition;
  const rightPupil = pupilPosition;

  // Determine label text
  const getLabelText = () => {
    if (position === 0) {
      return "CONCISE";
    } else if (position === 1) {
      return "detailed";
    } else {
      // Show which side it will snap to
      return position < 0.5 ? "CONCISE" : "detailed";
    }
  };

  // Determine font family based on position
  const getFontFamily = () => {
    const labelText = getLabelText();
    // Change to heading font when it says "detailed"
    return labelText === "detailed"
      ? "var(--font-instrument-serif)"
      : "var(--font-inter)";
  };

  // Determine if text should be italic
  const isItalic = () => {
    return getLabelText() === "detailed";
  };

  return (
    <div className="flex flex-col items-center gap-8 relative z-50">
      {/* Eyes with SVG to control the dot */}
      <div className="flex gap-16 mb-[-10px]">
        <div ref={leftEyeRef} className="relative">
          <svg
            className="drop-shadow-md text-5xl md:text-6xl lg:text-9xl"
            style={{ width: "auto", height: "1em" }}
            viewBox="0 0 100 100"
          >
            <defs>
              {/* Define mask to hide the font's built-in dot */}
              <mask id="leftEyeMask">
                <rect width="100" height="100" fill="white" />
                {/* Black circle to hide the center dot area */}
                <circle cx="50" cy="50" r="10" fill="black" />
              </mask>
            </defs>
            {/* The "0" text with mask applied */}
            <text
              x="50"
              y="50"
              fontSize="85"
              fontFamily="var(--font-source-code-pro), monospace"
              fill="var(--accent)"
              textAnchor="middle"
              dominantBaseline="central"
              mask="url(#leftEyeMask)"
            >
              0
            </text>
            {/* Moving pupil */}
            <circle
              cx="50"
              cy="50"
              r="6"
              fill="var(--accent)"
              style={{
                transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
                transition: "transform 0.15s ease-out",
              }}
            />
          </svg>
        </div>
        <div ref={rightEyeRef} className="relative">
          <svg
            className="drop-shadow-md text-5xl md:text-6xl lg:text-9xl"
            style={{ width: "auto", height: "1em" }}
            viewBox="0 0 100 100"
          >
            <defs>
              {/* Define mask to hide the font's built-in dot */}
              <mask id="rightEyeMask">
                <rect width="100" height="100" fill="white" />
                {/* Black circle to hide the center dot area */}
                <circle cx="50" cy="50" r="10" fill="black" />
              </mask>
            </defs>
            {/* The "0" text with mask applied */}
            <text
              x="50"
              y="50"
              fontSize="85"
              fontFamily="var(--font-source-code-pro), monospace"
              fill="var(--accent)"
              textAnchor="middle"
              dominantBaseline="central"
              mask="url(#rightEyeMask)"
            >
              0
            </text>
            {/* Moving pupil */}
            <circle
              cx="50"
              cy="50"
              r="6"
              fill="var(--accent)"
              style={{
                transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
                transition: "transform 0.15s ease-out",
              }}
            />
          </svg>
        </div>
      </div>

      {/* Arc Slider Visualization */}
      <div
        className="relative select-none drop-shadow-md"
        style={{ overflow: "visible" }}
      >
        <svg
          ref={svgRef}
          width="600"
          height="250"
          viewBox="0 0 600 250"
          onMouseDown={handleMouseDown}
          className="cursor-pointer"
          style={{ overflow: "visible" }}
        >
          {/* Arc path (mouth) */}
          <path
            d={arcPath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="round"
            pointerEvents="none"
          />

          {/* Slider knob */}
          <circle
            cx={knobX}
            cy={knobY}
            r="10"
            fill="var(--accent)"
            pointerEvents="none"
            style={{
              filter: isDragging
                ? "drop-shadow(0 0 8px var(--accent))"
                : "none",
              transition: isDragging || isAnimating ? "none" : "all 0.2s ease",
            }}
          />

          {/* Label that follows the dot */}
          <text
            x={textX}
            y={textY}
            fill="var(--accent)"
            fontSize={isItalic() ? "16.8" : "14"}
            fontFamily={getFontFamily()}
            fontStyle={isItalic() ? "italic" : "normal"}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            pointerEvents="none"
            style={{
              transition:
                "font-family 0.3s ease, font-style 0.3s ease, font-size 0.3s ease, font-weight 0.3s ease",
              // Drop shadow more intense: more offset, blur, and opacity
              filter: "drop-shadow(0 3px 7px rgba(0,0,0,0.45))",
            }}
          >
            {getLabelText()}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default ArcSlider;
