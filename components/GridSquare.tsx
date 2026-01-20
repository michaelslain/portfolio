import type { FC } from 'react'
import React, { useState } from 'react'
import DuoToneRectangle from './DuoToneRectangle'

interface GridSquareProps {
    size: number
    height?: number
    color: string
    col: number
    row: number
    spacing: number
    imagePath?: string
}

const GridSquare: FC<GridSquareProps> = ({ size, height, color, col, row, spacing, imagePath }) => {
    const [extractedColor, setExtractedColor] = useState<string | null>(null)
    const [isReady, setIsReady] = useState(false)
    const actualHeight = height ?? size
    const width = size * spacing
    const heightPx = actualHeight * spacing

    return (
        <div
            className="absolute overflow-hidden"
            style={{
                left: `${col * spacing}px`,
                top: `${row * spacing}px`,
                width: `${width}px`,
                height: `${heightPx}px`,
                backgroundColor: extractedColor || color,
                opacity: isReady ? 1 : 0,
                transition: 'opacity 0.2s ease-in-out',
            }}
        >
            {imagePath && (
                <DuoToneRectangle
                    imagePath={imagePath}
                    onColorExtracted={setExtractedColor}
                    onReady={setIsReady}
                />
            )}
        </div>
    )
}

export default GridSquare
