'use client'

import type { FC } from 'react'
import { useMemo, useState, useEffect } from 'react'
import Heading from '@/components/Heading'
import BackgroundGrid from '@/components/BackgroundGrid'
import GridSquare from '@/components/GridSquare'

interface ColorSquare {
    col: number
    row: number
    size: number
    height: number
    color: string
}

const WorkSection: FC = () => {
    const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 })
    const spacing = 100

    const colors = [
        '#b00020', // accent red
        '#ededed', // foreground white
        '#666666', // gray
        '#333333', // dark gray
    ]

    useEffect(() => {
        const updateDimensions = () => {
            const cols = Math.ceil(window.innerWidth / spacing)
            const rows = Math.ceil(window.innerHeight / spacing)
            setDimensions({ cols, rows })
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    const squares = useMemo(() => {
        if (dimensions.cols === 0 || dimensions.rows === 0) return []

        const { cols, rows } = dimensions
        const squares: ColorSquare[] = []

        // Create a Pinterest-style scattered layout
        const numSquares = 20
        const usedPositions = new Set<string>()

        const widths = [1, 2, 3, 4]
        const heights = [1, 2, 3, 4]

        for (let i = 0; i < numSquares; i++) {
            let placed = false
            let attempts = 0

            while (!placed && attempts < 50) {
                attempts++

                // Random position
                const col = Math.floor(Math.random() * cols)
                const row = Math.floor(Math.random() * rows)

                // Random size (can be rectangular)
                const width = widths[Math.floor(Math.random() * widths.length)]
                const height = heights[Math.floor(Math.random() * heights.length)]

                // Check if it fits
                if (col + width <= cols && row + height <= rows) {
                    // Check for overlaps
                    let overlaps = false
                    for (let r = row; r < row + height; r++) {
                        for (let c = col; c < col + width; c++) {
                            if (usedPositions.has(`${c},${r}`)) {
                                overlaps = true
                                break
                            }
                        }
                        if (overlaps) break
                    }

                    if (!overlaps) {
                        // Mark as used
                        for (let r = row; r < row + height; r++) {
                            for (let c = col; c < col + width; c++) {
                                usedPositions.add(`${c},${r}`)
                            }
                        }

                        const color = colors[Math.floor(Math.random() * colors.length)]
                        squares.push({
                            col,
                            row,
                            size: width,
                            height: height,
                            color
                        })
                        placed = true
                    }
                }
            }
        }

        return squares
    }, [dimensions])

    return (
        <section data-scroll-section className="min-h-screen w-full relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0">
                <BackgroundGrid spacing={spacing} style="-|" oddColumns={false} />
            </div>

            {/* Colored squares overlaid on grid */}
            <div className="absolute inset-0 pointer-events-none">
                {squares.map((square, index) => (
                    <GridSquare
                        key={index}
                        col={square.col}
                        row={square.row}
                        size={square.size}
                        height={square.height}
                        color={square.color}
                        spacing={spacing}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="container mx-auto px-8 py-24 relative z-10">
                <Heading level="h1" className="mb-16">
                    work
                </Heading>
            </div>
        </section>
    )
}

export default WorkSection
