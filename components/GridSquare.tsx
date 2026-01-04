import type { FC } from 'react'

interface GridSquareProps {
    size: number // Width in grid cells
    height?: number // Height in grid cells (defaults to size for squares)
    color: string
    col: number
    row: number
    spacing: number // Grid spacing in pixels
}

const GridSquare: FC<GridSquareProps> = ({ size, height, color, col, row, spacing }) => {
    const actualHeight = height ?? size

    return (
        <div
            className="absolute"
            style={{
                left: `${col * spacing}px`,
                top: `${row * spacing}px`,
                width: `${size * spacing}px`,
                height: `${actualHeight * spacing}px`,
                backgroundColor: color,
            }}
        />
    )
}

export default GridSquare
