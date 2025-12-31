'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Bitmap3D from '@/components/Bitmap3D'
import Section from '@/components/Section'
import Text from '@/components/Text'
import Heading from '@/components/Heading'

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

        element.setAttribute('data-scroll', '')

        const handleScroll = (args: any) => {
            const elementProgress = args.currentElements?.['fish-container']

            if (elementProgress) {
                const progress = elementProgress.progress || 0
                console.log('Fish scroll progress:', progress)

                // Fish becomes sticky when we're scrolling through the section
                // Progress should be between ~0.33 and ~0.66 when actually sticky
                const sticky = progress > 0.25 && progress < 0.75
                setIsSticky(sticky)

                // Only update scroll progress when sticky
                if (sticky) {
                    // Normalize progress to 0-1 range for the sticky portion
                    const normalizedProgress = (progress - 0.25) / 0.5
                    setScrollProgress(
                        Math.max(0, Math.min(1, normalizedProgress))
                    )
                }
            } else {
                setIsSticky(false)
            }
        }

        let locomotiveScroll: any = null
        let intervalId: NodeJS.Timeout | null = null
        let attempts = 0
        const maxAttempts = 20 // Try for up to 2 seconds (20 * 100ms)

        // Poll until Locomotive Scroll is ready
        intervalId = setInterval(() => {
            attempts++
            const scroll = (window as any).__locomotiveScroll

            if (scroll) {
                console.log(
                    'Locomotive Scroll found, attaching fish scroll handler'
                )
                locomotiveScroll = scroll
                locomotiveScroll.on('scroll', handleScroll)
                if (intervalId) clearInterval(intervalId)
            } else if (attempts >= maxAttempts) {
                console.log(
                    'Locomotive Scroll not found for fish after',
                    maxAttempts,
                    'attempts'
                )
                if (intervalId) clearInterval(intervalId)
            }
        }, 100)

        return () => {
            if (intervalId) clearInterval(intervalId)
            if (locomotiveScroll) {
                locomotiveScroll.off('scroll', handleScroll)
            }
        }
    }, [])

    return (
        <Section customHeight="300vh" className="">
            <Heading
                level="h1"
                className="absolute top-8 left-8 md:left-16 lg:left-24 z-20"
            >
                my process
            </Heading>
            <div
                ref={containerRef}
                id="fish-container"
                data-scroll-id="fish-container"
                className="w-full h-full relative"
            >
                <div
                    className="w-full h-screen pointer-events-none"
                    data-scroll
                    data-scroll-sticky
                    data-scroll-target="#fish-container"
                >
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
                        <Text className="font-mono md:text-lg text-accent">
                            01.
                        </Text>
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
                        <Text className="font-mono md:text-lg text-accent">
                            02.
                        </Text>
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
                        <Text className="font-mono md:text-lg text-accent">
                            03.
                        </Text>
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
