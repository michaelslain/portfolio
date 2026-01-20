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
    imagePath?: string
}

const WorkSection: FC = () => {
    const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 })
    const spacing = 100

    const allProjects = [
        '/projects/obsidian.png',
        '/projects/poker.png',
        '/projects/kino-bside.png',
        '/projects/design-1.png',
        '/projects/design-2.png',
        '/projects/design-3.png',
        '/projects/design-4.png',
        '/projects/design-5.png',
        '/projects/bside-print-1.png',
        '/projects/bside-print-2.png',
        '/projects/beebs.png',
        '/projects/doron.png',
        '/projects/sketch-4.png',
        '/projects/sketch-5.png',
        '/projects/sketch-7.png',
    ]

    // Categorize images by aspect ratio
    const imageRatios: { [key: string]: 'square' | 'landscape' | 'portrait' } = {
        '/projects/obsidian.png': 'square',
        '/projects/poker.png': 'landscape',
        '/projects/kino-bside.png': 'landscape',
        '/projects/design-1.png': 'square',
        '/projects/design-2.png': 'square',
        '/projects/design-3.png': 'square',
        '/projects/design-4.png': 'square',
        '/projects/design-5.png': 'square',
        '/projects/bside-print-1.png': 'portrait',
        '/projects/bside-print-2.png': 'portrait',
        '/projects/beebs.png': 'square',
        '/projects/doron.png': 'square',
        '/projects/sketch-4.png': 'portrait',
        '/projects/sketch-5.png': 'portrait',
        '/projects/sketch-7.png': 'portrait',
    }

    // Get preferred dimensions for each ratio type
    const getPreferredDimensions = (imageRatio: 'square' | 'landscape' | 'portrait') => {
        switch (imageRatio) {
            case 'square':
                return [
                    { w: 1, h: 1 },
                    { w: 2, h: 2 },
                ]
            case 'landscape':
                return [
                    { w: 2, h: 1 },
                    { w: 3, h: 1 },
                    { w: 4, h: 2 },
                    { w: 3, h: 2 },
                ]
            case 'portrait':
                return [
                    { w: 1, h: 2 },
                    { w: 1, h: 3 },
                    { w: 2, h: 3 },
                ]
        }
    }

    const colors = [
        'var(--accent)', // accent red
        '#ededed', // foreground white
        '#666666', // gray
        '#333333', // dark gray
    ]

    useEffect(() => {
        const updateDimensions = () => {
            const cols = Math.ceil(window.innerWidth / spacing)
            const rows = Math.max(1, Math.ceil(window.innerHeight / spacing) - 1)
            setDimensions({ cols, rows })
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    const squares = useMemo(() => {
        if (dimensions.cols === 0 || dimensions.rows === 0) return []

        // Exclude last column to avoid awkward partial columns
        const { cols: fullCols, rows } = dimensions
        const cols = Math.max(1, fullCols - 1)
        const squares: ColorSquare[] = []

        // Shuffle projects array once
        const shuffledProjects = [...allProjects].sort(() => Math.random() - 0.5)
        let projectIndex = 0

        // Create a Pinterest-style scattered layout
        const numSquares = shuffledProjects.length
        const usedPositions = new Set<string>()

        const widths = [1, 2, 3, 4]
        const heights = [1, 2, 3, 4]

        for (let i = 0; i < numSquares; i++) {
            let placed = false
            let attempts = 0

            // Get current image and its preferred dimensions
            const currentImage = shuffledProjects[projectIndex % shuffledProjects.length]
            const imageRatio = imageRatios[currentImage] || 'square'
            const preferredDims = getPreferredDimensions(imageRatio)

            while (!placed && attempts < 100) {
                attempts++

                // Random position
                const col = Math.floor(Math.random() * cols)
                const row = Math.floor(Math.random() * rows)

                // Select dimensions - prefer aspect-matched sizes early, fallback to random
                let width: number
                let height: number

                if (attempts < 30 && preferredDims) {
                    // Try preferred dimensions first
                    const preferred = preferredDims[Math.floor(Math.random() * preferredDims.length)]
                    width = preferred.w
                    height = preferred.h
                } else {
                    // Fallback to random dimensions
                    width = widths[Math.floor(Math.random() * widths.length)]
                    height = heights[Math.floor(Math.random() * heights.length)]
                }

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
                        const imagePath = currentImage
                        projectIndex++

                        squares.push({
                            col,
                            row,
                            size: width,
                            height: height,
                            color,
                            imagePath
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
                        imagePath={square.imagePath}
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
