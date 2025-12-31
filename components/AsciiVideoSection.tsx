"use client";

import { FC, useRef, useEffect, useState } from "react";
import Section from "@/components/Section";

const AsciiVideoSection: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 100, height: 50 });
  const [isVisible, setIsVisible] = useState(true); // Always visible for now
  const lastFrameTime = useRef(0);
  const TARGET_FPS = 15;
  const charSize = 20;

  const ASCII_CHARS = " .:-=+0*#%@";

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    element.setAttribute('data-scroll', '');

    const handleScroll = (args: any) => {
      const inView = args.currentElements?.[element.id];
      if (inView) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

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
      const charWidth = charSize * 0.6;
      const cols = Math.floor(containerWidth / charWidth);
      const rows = Math.floor((cols * 9) / 16);

      setDimensions({ width: cols, height: rows });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

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

      const frameDuration = 1000 / TARGET_FPS;
      if (timestamp - lastFrameTime.current < frameDuration) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }
      lastFrameTime.current = timestamp;

      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = dimensions.width / dimensions.height;

      let sx = 0,
        sy = 0,
        sWidth = video.videoWidth,
        sHeight = video.videoHeight;

      if (videoAspect > canvasAspect) {
        sWidth = video.videoHeight * canvasAspect;
        sx = (video.videoWidth - sWidth) / 2;
      } else {
        sHeight = video.videoWidth / canvasAspect;
        sy = 0;
      }

      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        dimensions.width,
        dimensions.height,
      );

      const imageData = ctx.getImageData(
        0,
        0,
        dimensions.width,
        dimensions.height,
      );
      const pixels = imageData.data;

      const lines: string[] = [];

      for (let y = 0; y < dimensions.height; y++) {
        const chars: string[] = [];
        for (let x = 0; x < dimensions.width; x++) {
          const offset = (y * dimensions.width + x) * 4;
          const r = pixels[offset];
          const g = pixels[offset + 1];
          const b = pixels[offset + 2];

          const brightness = (r + g + b) / 3;

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
    <Section
      customHeight="auto"
      className="absolute top-1/2 left-0 w-screen pointer-events-none"
    >
      <div
        ref={containerRef}
        id="ascii-video-container"
        className="relative w-full drop-shadow-md h-fit"
      >
        <video
          ref={videoRef}
          src="/Fire.mp4"
          loop
          muted
          playsInline
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
        <pre
          ref={preRef}
          className="font-mono text-accent leading-none overflow-hidden whitespace-pre w-full text-center m-0"
          style={{
            fontSize: `${charSize}px`,
            lineHeight: `${charSize}px`,
          }}
        />
      </div>
    </Section>
  );
};

export default AsciiVideoSection;
