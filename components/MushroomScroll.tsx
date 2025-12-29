'use client'

import { type FC, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { EffectComposer } from '@react-three/postprocessing'
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const SpinningMushroom: FC<{ scrollVelocity: number }> = ({ scrollVelocity }) => {
    const groupRef = useRef<THREE.Group>(null)
    const { scene } = useGLTF('/mushroom.glb')

    // Clone the scene to avoid issues with multiple instances
    const clonedScene = useMemo(() => scene.clone(), [scene])

    useFrame(() => {
        if (groupRef.current) {
            // Rotate on Y-axis based on scroll velocity
            const speed = scrollVelocity * 0.05
            groupRef.current.rotation.y += speed
        }
    })

    return (
        <group ref={groupRef}>
            <primitive object={clonedScene} scale={[3.5, 3.5, 3.5]} />
        </group>
    )
}

const halftoneFragmentShader = `
uniform float time;
uniform vec3 accentColor;
uniform vec2 resolution;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 texel = inputColor;
    float luminance = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grayscale = vec3(luminance);

    vec2 pixelPos = uv * resolution;
    float dotSize = 16.0;
    vec2 halftoneUV = pixelPos / dotSize;
    vec2 grid = fract(halftoneUV);
    vec2 gridCenter = vec2(0.5);
    float gridDist = distance(grid, gridCenter);

    float wave = sin(halftoneUV.x * 2.0 + time * 0.5) * sin(halftoneUV.y * 2.0 + time * 0.7) * 0.05 + 0.95;
    float dotRadius = luminance * 0.5 * wave;
    float dots = 1.0 - step(dotRadius, gridDist);

    vec3 finalColor = mix(vec3(0.0), accentColor, dots);
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
                ['resolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))],
            ]),
        })
    }

    update(
        renderer: THREE.WebGLRenderer,
        inputBuffer: THREE.WebGLRenderTarget,
        deltaTime?: number,
    ) {
        this.uniforms.get('time')!.value += deltaTime || 0
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

const MushroomScroll: FC = () => {
    const [scrollVelocity, setScrollVelocity] = useState(0)
    const lastScrollPos = useRef(0)
    const lastTime = useRef(Date.now())

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now()
            const dt = Math.max(now - lastTime.current, 1) / 1000

            const currentScroll = window.scrollY
            const distance = Math.abs(currentScroll - lastScrollPos.current)

            // Calculate velocity (pixels per second)
            const velocity = distance / dt / 100 // Normalize

            // Smooth the velocity
            setScrollVelocity(prev => prev * 0.7 + velocity * 0.3)

            lastScrollPos.current = currentScroll
            lastTime.current = now
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        // Decay velocity when scrolling stops
        const decayInterval = setInterval(() => {
            setScrollVelocity(prev => prev * 0.92)
        }, 50)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearInterval(decayInterval)
        }
    }, [])

    return (
        <div className="w-screen h-[200vh] relative">
            <div className="sticky top-0 w-full h-screen pointer-events-none">
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

                    <SpinningMushroom scrollVelocity={scrollVelocity} />
                    <HalftonePostProcess />
                </Canvas>
            </div>
        </div>
    )
}

export default MushroomScroll
