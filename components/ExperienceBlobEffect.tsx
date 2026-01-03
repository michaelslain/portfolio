'use client'

import { FC, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BlobTrail {
    id: number
    x: number
    y: number
}

const ExperienceBlobEffect: FC = () => {
    const [blobs, setBlobs] = useState<BlobTrail[]>([])
    const [isActive, setIsActive] = useState(false)
    const blobIdRef = useRef(0)
    const lastMousePosRef = useRef({ x: 0, y: 0 })
    const createIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            lastMousePosRef.current = { x: e.clientX, y: e.clientY }

            // Check if hovering over experience item
            const target = e.target as HTMLElement
            const experienceItem = target.closest('.experience-item')
            setIsActive(!!experienceItem)

            // Update cursor visibility
            if (experienceItem) {
                document.body.style.cursor = 'none'
            } else {
                document.body.style.cursor = ''
            }
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            document.body.style.cursor = ''
        }
    }, [])

    useEffect(() => {
        if (isActive) {
            createIntervalRef.current = setInterval(() => {
                const newBlob: BlobTrail = {
                    id: blobIdRef.current++,
                    x: lastMousePosRef.current.x,
                    y: lastMousePosRef.current.y,
                }

                setBlobs(prev => {
                    const updated = [...prev, newBlob]
                    // Keep only last 15 blobs for a longer trail effect
                    return updated.slice(-15)
                })
            }, 30) // Create new blob every 30ms for smoother trail
        } else {
            if (createIntervalRef.current) {
                clearInterval(createIntervalRef.current)
                createIntervalRef.current = null
            }
            // Clear blobs when not active
            setBlobs([])
        }

        return () => {
            if (createIntervalRef.current) {
                clearInterval(createIntervalRef.current)
            }
        }
    }, [isActive])

    return (
        <div className="fixed inset-0 pointer-events-none z-[5]">
            <AnimatePresence>
                {blobs.map((blob, index) => {
                    const opacity = (index + 1) / blobs.length // Fade in as they appear
                    const scale = 0.3 + (index / blobs.length) * 1.2 // Grow more dramatically

                    return (
                        <motion.div
                            key={blob.id}
                            className="absolute rounded-full bg-accent"
                            style={{
                                left: blob.x,
                                top: blob.y,
                                width: '120px',
                                height: '120px',
                                transform: 'translate(-50%, -50%)',
                                filter: 'blur(40px)',
                            }}
                            initial={{ opacity: 0, scale: 0.2 }}
                            animate={{ opacity: opacity * 0.8, scale }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        />
                    )
                })}
            </AnimatePresence>
        </div>
    )
}

export default ExperienceBlobEffect
