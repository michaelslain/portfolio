'use client'

import { FC, useState, useRef, useEffect } from 'react'
import Heading from '@/components/Heading'

interface ArcSliderProps {
    onModeChange?: (isDetailed: boolean) => void
}

const ArcSlider: FC<ArcSliderProps> = ({ onModeChange }) => {
    const [position, setPosition] = useState(0) // 0 to 1, where 0 is left (concise)
    const [isDragging, setIsDragging] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const svgRef = useRef<SVGSVGElement>(null)
    const animationRef = useRef<number | null>(null)

    // Arc parameters - wider and steeper
    const centerX = 300
    const centerY = 200
    const radius = 200
    const startAngle = Math.PI * 0.85 // More towards bottom left
    const endAngle = Math.PI * 0.15 // More towards bottom right

    // Calculate the angle based on position
    const currentAngle = startAngle - position * (startAngle - endAngle)

    // Calculate slider knob position
    const knobX = centerX + radius * Math.cos(currentAngle)
    const knobY = centerY - radius * Math.sin(currentAngle)

    // Calculate text position (above the knob)
    const textX = knobX
    const textY = knobY - 25

    // Create the arc path with fixed precision to avoid hydration mismatches
    const startX = (centerX + radius * Math.cos(startAngle)).toFixed(2)
    const startY = (centerY - radius * Math.sin(startAngle)).toFixed(2)
    const endX = (centerX + radius * Math.cos(endAngle)).toFixed(2)
    const endY = (centerY - radius * Math.sin(endAngle)).toFixed(2)

    const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`

    const calculatePositionFromCoords = (clientX: number, clientY: number) => {
        if (!svgRef.current) return

        const svg = svgRef.current
        const rect = svg.getBoundingClientRect()
        const x = ((clientX - rect.left) / rect.width) * 600
        const y = ((clientY - rect.top) / rect.height) * 250

        // Calculate angle from center to click point
        const dx = x - centerX
        const dy = centerY - y // Inverted Y
        let angle = Math.atan2(dy, dx)

        // Normalize angle to 0-2π range
        if (angle < 0) angle += 2 * Math.PI

        // Clamp angle to arc range
        if (angle > startAngle && angle < Math.PI) {
            angle = startAngle
        } else if (angle < endAngle && angle > 0) {
            angle = endAngle
        }

        // Convert angle to position (0-1)
        const newPosition = (startAngle - angle) / (startAngle - endAngle)
        setPosition(Math.max(0, Math.min(1, newPosition)))
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        // Cancel any ongoing animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }
        setIsAnimating(false)
        setIsDragging(true)
        calculatePositionFromCoords(e.clientX, e.clientY)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return
        calculatePositionFromCoords(e.clientX, e.clientY)
    }

    const animateToTarget = (target: number) => {
        setIsAnimating(true)
        const startPosition = position
        const distance = target - startPosition
        const startTime = performance.now()
        const duration = 600 // ms

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing function that simulates gravity (ease-in-quad for acceleration)
            const easeInQuad = progress * progress

            const newPosition = startPosition + distance * easeInQuad
            setPosition(newPosition)

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                setPosition(target)
                setIsAnimating(false)
                animationRef.current = null
                // Call the callback when animation completes
                if (onModeChange) {
                    onModeChange(target === 1)
                }
            }
        }

        animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseUp = () => {
        setIsDragging(false)

        // Determine target and start gravity animation
        const target = position < 0.5 ? 0 : 1
        animateToTarget(target)
    }

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, position])

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    // Determine label text
    const getLabelText = () => {
        if (position === 0) {
            return 'CONCISE'
        } else if (position === 1) {
            return 'detailed'
        } else {
            // Show which side it will snap to
            return position < 0.5 ? 'CONCISE' : 'detailed'
        }
    }

    // Determine font family based on position
    const getFontFamily = () => {
        const labelText = getLabelText()
        // Change to heading font when it says "detailed"
        return labelText === 'detailed'
            ? 'var(--font-instrument-serif)'
            : 'var(--font-inter)'
    }

    // Determine if text should be italic
    const isItalic = () => {
        return getLabelText() === 'detailed'
    }

    return (
        <div className="flex flex-col items-center gap-8 relative z-50">
            {/* Eyes with Heading component */}
            <div className="flex gap-32 mb-[-20px]">
                <Heading level="h1" className="text-accent font-mono drop-shadow-md">
                    0
                </Heading>
                <Heading level="h1" className="text-accent font-mono drop-shadow-md">
                    0
                </Heading>
            </div>

            {/* Arc Slider Visualization */}
            <div
                className="relative select-none drop-shadow-md"
                style={{ overflow: 'visible' }}
            >
                <svg
                    ref={svgRef}
                    width="600"
                    height="250"
                    viewBox="0 0 600 250"
                    onMouseDown={handleMouseDown}
                    className="cursor-pointer"
                    style={{ overflow: 'visible' }}
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
                                ? 'drop-shadow(0 0 8px var(--accent))'
                                : 'none',
                            transition:
                                isDragging || isAnimating
                                    ? 'none'
                                    : 'all 0.2s ease',
                        }}
                    />

                    {/* Label that follows the dot */}
                    <text
                        x={textX}
                        y={textY}
                        fill="var(--accent)"
                        fontSize={isItalic() ? '16.8' : '14'}
                        fontFamily={getFontFamily()}
                        fontStyle={isItalic() ? 'italic' : 'normal'}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                        style={{
                            transition:
                                'font-family 0.3s ease, font-style 0.3s ease, font-size 0.3s ease, font-weight 0.3s ease',
                            // Drop shadow more intense: more offset, blur, and opacity
                            filter: 'drop-shadow(0 3px 7px rgba(0,0,0,0.45))',
                        }}
                    >
                        {getLabelText()}
                    </text>
                </svg>
            </div>
        </div>
    )
}

export default ArcSlider
