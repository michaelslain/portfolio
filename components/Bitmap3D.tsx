'use client'

import { type FC, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { EffectComposer } from '@react-three/postprocessing'
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const SpinningEye: FC<{ mouseVelocity: number }> = ({ mouseVelocity }) => {
    const groupRef = useRef<THREE.Group>(null)
    const orbitRef = useRef<THREE.Group>(null)
    const { scene } = useGLTF('/eye.glb')

    useFrame(state => {
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
    })

    return (
        <group ref={orbitRef}>
            <group ref={groupRef}>
                <primitive object={scene} scale={[3.5, 3.5, 3.5]} />
            </group>
        </group>
    )
}

const SpinningSunflower: FC<{ mouseVelocity: number }> = ({
    mouseVelocity,
}) => {
    const groupRef = useRef<THREE.Group>(null)
    const orbitRef = useRef<THREE.Group>(null)
    const { scene } = useGLTF('/sunflower.glb')

    useFrame(state => {
        if (groupRef.current) {
            const speed = 0.002 + mouseVelocity * 0.02
            // Reversed rotation direction (negative values)
            groupRef.current.rotation.x -= speed * 2
            groupRef.current.rotation.y -= speed
        }

        if (orbitRef.current) {
            // Orbital rotation - slow circular motion
            const orbitSpeed = 0.15
            const orbitRadius = 1.2
            const orbitAngle = state.clock.elapsedTime * orbitSpeed

            orbitRef.current.position.x = Math.sin(orbitAngle) * orbitRadius
            orbitRef.current.position.y =
                Math.cos(orbitAngle * 1.3) * orbitRadius * 0.6

            // Oscillate distance from camera (z-axis)
            const zOscillation = Math.sin(state.clock.elapsedTime * 0.2) * 2
            orbitRef.current.position.z = zOscillation
        }
    })

    return (
        <group ref={orbitRef}>
            <group ref={groupRef}>
                <primitive object={scene} scale={[2.5, 2.5, 2.5]} />
            </group>
        </group>
    )
}

const halftoneFragmentShader = `
uniform float time;
uniform vec3 accentColor;
uniform vec2 resolution;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Sample the original rendered scene
    vec4 texel = inputColor;

    // Convert to grayscale first
    float luminance = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grayscale = vec3(luminance);

    // Create halftone grid based on screen pixels
    vec2 pixelPos = uv * resolution;
    float dotSize = 16.0; // Size of each halftone dot in pixels
    vec2 halftoneUV = pixelPos / dotSize;
    vec2 grid = fract(halftoneUV);
    vec2 gridCenter = vec2(0.5);
    float gridDist = distance(grid, gridCenter);

    // Animate slightly
    float wave = sin(halftoneUV.x * 2.0 + time * 0.5) * sin(halftoneUV.y * 2.0 + time * 0.7) * 0.05 + 0.95;

    // Create dots based on luminance - brighter areas = bigger dots
    float dotRadius = luminance * 0.5 * wave;
    float dots = 1.0 - step(dotRadius, gridDist);

    // Apply accent color to dots, background is transparent/black
    vec3 finalColor = mix(vec3(0.0), accentColor, dots);

    // Use dot pattern to determine final output
    outputColor = vec4(finalColor, dots * 0.8 + texel.a * (1.0 - dots) * 0.2);
}
`

class HalftoneEffect extends Effect {
    constructor() {
        super('HalftoneEffect', halftoneFragmentShader, {
            blendFunction: BlendFunction.NORMAL,
            uniforms: new Map<string, THREE.Uniform<any>>([
                ['time', new THREE.Uniform(0)],
                ['accentColor', new THREE.Uniform(new THREE.Color('#b00020'))],
                [
                    'resolution',
                    new THREE.Uniform(new THREE.Vector2(1920, 1080)),
                ],
            ]),
        })
    }

    update(
        renderer: THREE.WebGLRenderer,
        inputBuffer: THREE.WebGLRenderTarget,
        deltaTime?: number,
    ) {
        this.uniforms.get('time')!.value += deltaTime || 0

        // Update resolution based on actual render size
        const size = renderer.getSize(new THREE.Vector2())
        this.uniforms.get('resolution')!.value.set(size.x, size.y)
    }
}

const HalftonePostProcess: FC = () => {
    const effect = useMemo(() => new HalftoneEffect(), [])

    return (
        <EffectComposer>
            <primitive object={effect} />
        </EffectComposer>
    )
}

const Bitmap3D: FC = () => {
    const [mouseVelocity, setMouseVelocity] = useState(0)
    const [isVisible, setIsVisible] = useState(true)
    const lastMousePos = useRef({ x: 0, y: 0 })
    const lastTime = useRef(Date.now())

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now()
            const dt = Math.max(now - lastTime.current, 1) / 1000 // Convert to seconds

            const dx = e.clientX - lastMousePos.current.x
            const dy = e.clientY - lastMousePos.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Calculate velocity (pixels per second)
            const velocity = distance / dt / 1000 // Normalize to reasonable range

            // Smooth the velocity with exponential decay
            setMouseVelocity(prev => prev * 0.8 + velocity * 0.2)

            lastMousePos.current = { x: e.clientX, y: e.clientY }
            lastTime.current = now
        }

        window.addEventListener('mousemove', handleMouseMove)

        // Decay velocity when mouse stops moving
        const decayInterval = setInterval(() => {
            setMouseVelocity(prev => prev * 0.95)
        }, 50)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            clearInterval(decayInterval)
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const windowHeight = window.innerHeight

            // Component is visible if we're within the first screen height
            // Since the container is h-[200vh], we check if scrollTop is less than one viewport
            const newVisibility = scrollTop < windowHeight
            setIsVisible(newVisibility)
        }

        handleScroll() // Check on mount
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        console.log('Bitmap3D isVisible:', isVisible)
    }, [isVisible])

    if (!isVisible) {
        return null
    }

    return (
        <div className="fixed top-0 left-0 w-screen h-[200vh] -z-50 pointer-events-none overflow-hidden">
            <Canvas
                camera={{ position: [0, 0, 8] }}
                style={{ background: 'transparent' }}
                gl={{
                    antialias: false,
                    powerPreference: 'high-performance',
                    alpha: true,
                }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <pointLight
                    position={[-3, -3, 3]}
                    intensity={0.8}
                    color="#ffffff"
                />

                {/* The actual 3D model that spins */}
                <SpinningEye mouseVelocity={mouseVelocity} />

                {/* Post-processing halftone effect */}
                <HalftonePostProcess />
            </Canvas>
        </div>
    )
}

export default Bitmap3D
