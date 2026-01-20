import type { FC } from 'react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface DuoToneRectangleProps {
    imagePath: string
    onColorExtracted?: (color: string) => void
    onReady?: (ready: boolean) => void
}

const DuoToneRectangle: FC<DuoToneRectangleProps> = ({ imagePath, onColorExtracted, onReady }) => {
    const [isReady, setIsReady] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        setIsReady(false)
        onReady?.(false)

        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            // Create a small canvas for faster color extraction
            const canvas = canvasRef.current
            if (!canvas) return

            // Resize canvas to smaller size for faster processing
            const maxSize = 100
            const scale = Math.min(maxSize / img.width, maxSize / img.height)
            canvas.width = img.width * scale
            canvas.height = img.height * scale

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                const data = imageData.data

                // Sample pixels and find dominant color
                const colorMap: { [key: string]: number } = {}
                const step = 1 // Faster sampling since canvas is smaller

                for (let i = 0; i < data.length; i += step * 4) {
                    const r = data[i]
                    const g = data[i + 1]
                    const b = data[i + 2]
                    const a = data[i + 3]

                    // Skip transparent or near-transparent pixels
                    if (a < 128) continue

                    // Convert to hex for easier grouping
                    const hex = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
                    colorMap[hex] = (colorMap[hex] || 0) + 1
                }

                // Find most common color
                let maxCount = 0
                let mostCommonColor = '#333333'
                Object.entries(colorMap).forEach(([color, count]) => {
                    if (count > maxCount) {
                        maxCount = count
                        mostCommonColor = color
                    }
                })

                onColorExtracted?.(mostCommonColor)
                setIsReady(true)
                onReady?.(true)
            } catch (e) {
                // Silently fail if canvas operations don't work
                console.warn('Could not extract dominant color from image')
                setIsReady(true)
                onReady?.(true)
            }
        }
        img.src = imagePath
    }, [imagePath, onColorExtracted, onReady])

    return (
        <>
            {isReady && (
                <>
                    <Image
                        src={imagePath}
                        alt="project"
                        fill
                        className="object-contain"
                        style={{
                            filter: 'grayscale(100%)',
                        }}
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundColor: 'var(--accent)',
                            mixBlendMode: 'multiply',
                            opacity: 0.5,
                        }}
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23000' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                            mixBlendMode: 'overlay',
                            opacity: 0.4,
                        }}
                    />
                </>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
    )
}

export default DuoToneRectangle
