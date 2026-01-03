'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Bitmap3D from '@/components/Bitmap3D'
import Section from '@/components/Section'
import Text from '@/components/Text'
import Heading from '@/components/Heading'
import Number from '@/components/Number'

const SpinningFish: FC<{ scrollProgress: number; isSticky: boolean }> = ({
    scrollProgress,
    isSticky,
}) => {
    const groupRef = useRef<THREE.Group>(null)
    const { scene } = useGLTF('/fish.glb')

    const clonedScene = useMemo(() => scene.clone(), [scene])

    useEffect(() => {
        if (clonedScene) {
            const box = new THREE.Box3().setFromObject(clonedScene)
            const center = box.getCenter(new THREE.Vector3())

            clonedScene.position.set(-center.x, -center.y, -center.z)
        }
    }, [clonedScene])

    useFrame(() => {
        if (groupRef.current && isSticky) {
            // Rotate based on scroll progress (tied directly to scroll position)
            const rotation = scrollProgress * Math.PI * 2
            groupRef.current.rotation.y = rotation
        }
    })

    return (
        <group position={[0, 0, -20]}>
            <group ref={groupRef}>
                <primitive object={clonedScene} scale={[10, 10, 10]} />
            </group>
        </group>
    )
}

const ProcessSection: FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0)
    const [isSticky, setIsSticky] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = containerRef.current
        if (!element) return

        const handleScroll = () => {
            const rect = element.getBoundingClientRect()
            const windowHeight = window.innerHeight
            const elementHeight = element.offsetHeight

            // Calculate when element is in viewport
            const elementTop = rect.top
            const elementBottom = rect.bottom

            // Progress from 0 to 1 as element scrolls through viewport
            let progress = 0

            if (elementTop <= windowHeight && elementBottom >= 0) {
                // Element is in viewport
                const totalScrollableHeight = elementHeight + windowHeight
                const scrolledAmount = windowHeight - elementTop
                progress = scrolledAmount / totalScrollableHeight
            }

            // Fish becomes sticky when scrolling through middle section
            const sticky = progress > 0.25 && progress < 0.75
            setIsSticky(sticky)

            // Update scroll progress when sticky OR when in view
            if (sticky) {
                const normalizedProgress = (progress - 0.25) / 0.5
                setScrollProgress(Math.max(0, Math.min(1, normalizedProgress)))
            } else if (progress > 0 && progress <= 1) {
                // Update progress even when not sticky
                setScrollProgress(Math.max(0, Math.min(1, progress)))
            }
        }

        let locomotiveScroll: any = null
        let intervalId: NodeJS.Timeout | null = null
        let attempts = 0
        const maxAttempts = 20

        // Poll until Locomotive Scroll v5 is ready
        intervalId = setInterval(() => {
            attempts++
            const scroll = (window as any).__locomotiveScroll

            if (scroll) {
                locomotiveScroll = scroll
                // V5 wraps Lenis - access lenisInstance for scroll events
                if (locomotiveScroll.lenisInstance) {
                    locomotiveScroll.lenisInstance.on('scroll', handleScroll)
                }
                handleScroll() // Initial call
                if (intervalId) clearInterval(intervalId)
            } else if (attempts >= maxAttempts) {
                // Fallback to native scroll if Locomotive isn't available
                window.addEventListener('scroll', handleScroll)
                handleScroll() // Initial call
                if (intervalId) clearInterval(intervalId)
            }
        }, 100)

        return () => {
            if (intervalId) clearInterval(intervalId)
            if (locomotiveScroll && locomotiveScroll.lenisInstance) {
                locomotiveScroll.lenisInstance.off('scroll', handleScroll)
            } else {
                window.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    return (
        <Section customHeight="300vh" className="mt-64">
            <Heading
                level="h1"
                className="absolute top-8 left-8 md:left-16 lg:left-24 z-20"
            >
                my process
            </Heading>
            <div
                ref={containerRef}
                id="fish-container"
                className="w-full h-full relative"
            >
                <div className="w-full h-screen sticky top-0 pointer-events-none">
                    <Bitmap3D
                        className="w-full h-full"
                        ambientIntensity={1.2}
                        directionalIntensity={2.5}
                        pointIntensity={2.0}
                    >
                        <SpinningFish
                            scrollProgress={scrollProgress}
                            isSticky={isSticky}
                        />
                    </Bitmap3D>
                </div>

                {/* Text Components - Alternating Left/Right/Left */}
                {/* First Text - Left */}
                <div className="absolute left-8 md:left-16 lg:left-24 top-[20%] pointer-events-auto z-10 max-w-md">
                    <div className="bg-background/80 p-4 rounded">
                        <Number>01.</Number>
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </Text>
                    </div>
                </div>

                {/* Second Text - Right */}
                <div className="absolute right-8 md:right-16 lg:right-24 top-[40%] pointer-events-auto z-10 max-w-md">
                    <div className="bg-background/80 p-4 rounded">
                        <Number>02.</Number>
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </Text>
                    </div>
                </div>

                {/* Third Text - Left */}
                <div className="absolute left-8 md:left-16 lg:left-24 top-[60%] pointer-events-auto z-10 max-w-md">
                    <div className="bg-background/80 p-4 rounded">
                        <Number>03.</Number>
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </Text>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default ProcessSection
