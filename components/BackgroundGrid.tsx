"use client";

import { FC, useEffect, useState } from "react";

interface BackgroundGridProps {
  spacing?: number;
  style: "//" | "-|";
  oddColumns?: boolean; // If true, uses odd number of columns and aligns edges
}

const BackgroundGrid: FC<BackgroundGridProps> = ({
  spacing = 100,
  style,
  oddColumns = false,
}) => {
  const [dimensions, setDimensions] = useState({
    cols: 0,
    rows: 0,
    actualSpacing: spacing,
  });
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      const height = document.documentElement.scrollHeight;
      let cols: number;
      let actualSpacing = spacing;

      if (oddColumns) {
        // Calculate number of vertical lines that fit the width
        // For odd number of columns (spaces), we need even number of lines
        let estimatedCols = Math.floor(window.innerWidth / spacing);
        // Make sure we have an even number of lines (for odd spaces between)
        if (estimatedCols % 2 !== 0) {
          estimatedCols = estimatedCols + 1;
        }
        // Ensure at least 4 lines (3 columns/spaces)
        cols = Math.max(4, estimatedCols);
        // Double-check it's even (lines)
        if (cols % 2 !== 0) {
          cols = cols + 1;
        }
        // Recalculate spacing to fit edge-to-edge
        actualSpacing = window.innerWidth / (cols - 1);
        console.log(
          "Grid lines:",
          cols,
          "Columns (spaces):",
          cols - 1,
          "Spacing:",
          actualSpacing,
        );
      } else {
        cols = Math.ceil(window.innerWidth / spacing) + 1;
      }

      const rows = Math.ceil(height / actualSpacing) + 1;
      setDimensions({ cols, rows, actualSpacing });
      setPageHeight(height);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [spacing, oddColumns]);

  const verticalChar = style === "//" ? "//" : "|";
  const horizontalChar = style === "//" ? "//" : "-";
  const intersectionChar = style === "//" ? "//" : "+";

  const actualSpacing = dimensions.actualSpacing;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-100"
      style={{ height: pageHeight }}
    >
      {/* Place characters at grid intersections */}
      {Array.from({ length: dimensions.rows }).map((_, rowIndex) =>
        Array.from({ length: dimensions.cols }).map((_, colIndex) => (
          <span
            key={`${rowIndex}-${colIndex}`}
            className="font-mono text-accent text-xs absolute"
            style={{
              left: `${colIndex * actualSpacing}px`,
              top: `${rowIndex * actualSpacing}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {intersectionChar}
          </span>
        )),
      )}

      {/* Fill in vertical lines between intersections */}
      {Array.from({ length: dimensions.cols }).map((_, colIndex) =>
        Array.from({ length: dimensions.rows - 1 }).map((_, rowIndex) =>
          Array.from({ length: 3 }).map((_, i) => (
            <span
              key={`v-${colIndex}-${rowIndex}-${i}`}
              className="font-mono text-accent text-xs absolute"
              style={{
                left: `${colIndex * actualSpacing}px`,
                top: `${rowIndex * actualSpacing + (i + 1) * (actualSpacing / 4)}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {verticalChar}
            </span>
          )),
        ),
      )}

      {/* Fill in horizontal lines between intersections */}
      {Array.from({ length: dimensions.rows }).map((_, rowIndex) =>
        Array.from({ length: dimensions.cols - 1 }).map((_, colIndex) =>
          Array.from({ length: 3 }).map((_, i) => (
            <span
              key={`h-${rowIndex}-${colIndex}-${i}`}
              className="font-mono text-accent text-xs absolute"
              style={{
                left: `${colIndex * actualSpacing + (i + 1) * (actualSpacing / 4)}px`,
                top: `${rowIndex * actualSpacing}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {horizontalChar}
            </span>
          )),
        ),
      )}
    </div>
  );
};

export default BackgroundGrid;
