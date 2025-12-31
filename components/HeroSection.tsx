'use client'

import { type FC, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import Bitmap3D from '@/components/Bitmap3D'
import CursorEffect from '@/components/CursorEffect'
import Heading from '@/components/Heading'
import Nav from '@/components/Nav'
import Section from '@/components/Section'

const SpinningEye: FC<{ mouseVelocity: number }> = ({ mouseVelocity }) => {
    const groupRef = useRef<THREE.Group>(null)
    const orbitRef = useRef<THREE.Group>(null)
    const { scene } = useGLTF('/eye.glb')

    useFrame((state, delta) => {
        if (groupRef.current) {
            const speed = 0.001 + mouseVelocity * 0.015
            groupRef.current.rotation.x += speed
            groupRef.current.rotation.z += speed * 0.5
        }

        if (orbitRef.current) {
            const orbitSpeed = 0.1
            const orbitRadius = 1.5
            const orbitAngle = state.clock.elapsedTime * orbitSpeed + Math.PI

            orbitRef.current.position.x = Math.sin(orbitAngle) * orbitRadius
            orbitRef.current.position.y =
                Math.cos(orbitAngle * 1.5) * orbitRadius * 0.5

            const zOscillation = Math.cos(state.clock.elapsedTime * 0.25) * 1.5
            orbitRef.current.position.z = zOscillation
        }

        state.invalidate() // Only re-render when needed
    })

    return (
        <group ref={orbitRef}>
            <group ref={groupRef}>
                <primitive object={scene} scale={[3.5, 3.5, 3.5]} />
            </group>
        </group>
    )
}

const HeroSection: FC = () => {
    const [mouseVelocity, setMouseVelocity] = useState(0)
    const lastMousePos = useRef({ x: 0, y: 0 })
    const lastTime = useRef(Date.now())

    useEffect(() => {
        let rafId: number | null = null

        const handleMouseMove = (e: MouseEvent) => {
            if (rafId !== null) return

            rafId = requestAnimationFrame(() => {
                const now = Date.now()
                const dt = Math.max(now - lastTime.current, 1) / 1000

                const dx = e.clientX - lastMousePos.current.x
                const dy = e.clientY - lastMousePos.current.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                const velocity = distance / dt / 1000

                setMouseVelocity(prev => prev * 0.8 + velocity * 0.2)

                lastMousePos.current = { x: e.clientX, y: e.clientY }
                lastTime.current = now
                rafId = null
            })
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })

        const decayInterval = setInterval(() => {
            setMouseVelocity(prev => prev * 0.95)
        }, 100)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            clearInterval(decayInterval)
            if (rafId !== null) cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <Section className="flex items-center justify-center flex-col">
            <Bitmap3D>
                <SpinningEye mouseVelocity={mouseVelocity} />
            </Bitmap3D>
            <CursorEffect />
            <Heading level="h1">
                bringing back, <br />
                what has been forgotten.
            </Heading>
            <Nav />
        </Section>
    )
}

export default HeroSection
