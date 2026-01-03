"use client";

import { FC, useRef, useEffect, useState } from "react";

interface AsciiVideoProps {
  src: string;
  className?: string;
  charSize?: number; // Font size in pixels
}

const AsciiVideo: FC<AsciiVideoProps> = ({
  src,
  className = "",
  charSize = 12,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 100, height: 50 });
  const [isVisible, setIsVisible] = useState(false);
  const lastFrameTime = useRef(0);
  const TARGET_FPS = 15; // Limit to 15fps for ASCII conversion

  // ASCII characters from darkest to lightest
  const ASCII_CHARS = " .:-=+0*#%@";

  // Use Locomotive Scroll's scroll event instead of IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    // Set data-scroll attribute for Locomotive Scroll
    element.setAttribute('data-scroll', '');

    const handleScroll = (args: any) => {
      // Locomotive Scroll provides progress from 0 to 1 when element is in view
      const inView = args.currentElements?.[element.id];
      if (inView) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Access Locomotive Scroll instance from window
    const locomotiveScroll = (window as any).__locomotiveScroll;

    if (locomotiveScroll) {
      locomotiveScroll.on('scroll', handleScroll);

      return () => {
        locomotiveScroll.off('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      // Character width is roughly 0.6 of the font size for monospace fonts
      const charWidth = charSize * 0.6;
      const cols = Math.floor(containerWidth / charWidth);
      // Maintain 16:9 aspect ratio
      const rows = Math.floor((cols * 9) / 16);

      setDimensions({ width: cols, height: rows });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [charSize]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const pre = preRef.current;

    if (!video || !canvas || !pre) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let animationFrameId: number | null = null;

    const processFrame = (timestamp: number) => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      // Frame rate limiting
      const frameDuration = 1000 / TARGET_FPS;
      if (timestamp - lastFrameTime.current < frameDuration) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }
      lastFrameTime.current = timestamp;

      // Calculate source dimensions to crop from bottom
      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = dimensions.width / dimensions.height;

      let sx = 0,
        sy = 0,
        sWidth = video.videoWidth,
        sHeight = video.videoHeight;

      if (videoAspect > canvasAspect) {
        // Video is wider - crop from sides
        sWidth = video.videoHeight * canvasAspect;
        sx = (video.videoWidth - sWidth) / 2;
      } else {
        // Video is taller - crop from top (keep bottom)
        sHeight = video.videoWidth / canvasAspect;
        sy = 0; // Start from top, naturally keeps bottom when drawing
      }

      // Draw video frame to canvas (cropped to fit, prioritizing bottom)
      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight, // Source rectangle
        0,
        0,
        dimensions.width,
        dimensions.height, // Destination rectangle
      );

      // Get pixel data
      const imageData = ctx.getImageData(
        0,
        0,
        dimensions.width,
        dimensions.height,
      );
      const pixels = imageData.data;

      // Use array instead of string concatenation for better performance
      const lines: string[] = [];

      // Process each pixel
      for (let y = 0; y < dimensions.height; y++) {
        const chars: string[] = [];
        for (let x = 0; x < dimensions.width; x++) {
          const offset = (y * dimensions.width + x) * 4;
          const r = pixels[offset];
          const g = pixels[offset + 1];
          const b = pixels[offset + 2];

          // Calculate brightness (grayscale conversion)
          const brightness = (r + g + b) / 3;

          // Map brightness to ASCII character
          const charIndex = Math.floor(
            (brightness / 255) * (ASCII_CHARS.length - 1),
          );
          chars.push(ASCII_CHARS[charIndex]);
        }
        lines.push(chars.join(""));
      }

      pre.textContent = lines.join("\n");

      animationFrameId = requestAnimationFrame(processFrame);
    };

    video.addEventListener("play", () => {
      if (isVisible) {
        processFrame(0);
      }
    });

    // Auto play when visible
    if (isVisible) {
      video.play().catch(() => {
        // Handle autoplay restrictions
      });
      if (animationFrameId === null) {
        processFrame(0);
      }
    } else {
      video.pause();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    return () => {
      video.pause();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [dimensions, isVisible]);

  return (
    <div
      ref={containerRef}
      id="ascii-video-container"
      className={`relative w-full ${className}`}
    >
      {/* Hidden video element */}
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        className="hidden"
      />
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      {/* ASCII output in red */}
      <pre
        ref={preRef}
        className="font-mono text-accent leading-none overflow-hidden whitespace-pre w-full"
        style={{
          fontSize: `${charSize}px`,
          lineHeight: `${charSize}px`,
        }}
      />
    </div>
  );
};

export default AsciiVideo;
