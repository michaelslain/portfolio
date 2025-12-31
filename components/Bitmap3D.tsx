"use client";

import { type FC, type ReactNode, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Effect, BlendFunction } from "postprocessing";
import * as THREE from "three";

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
`;

class HalftoneEffectImpl extends Effect {
  constructor() {
    super("HalftoneEffect", halftoneFragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ["time", new THREE.Uniform(0)],
        ["accentColor", new THREE.Uniform(new THREE.Color("#b00020"))],
        ["resolution", new THREE.Uniform(new THREE.Vector2(1920, 1080))],
      ]),
    });
  }

  update(
    renderer: THREE.WebGLRenderer,
    inputBuffer: THREE.WebGLRenderTarget,
    deltaTime?: number,
  ) {
    const timeUniform = this.uniforms.get("time");
    const resolutionUniform = this.uniforms.get("resolution");

    if (timeUniform) {
      timeUniform.value += deltaTime || 0;
    }

    if (resolutionUniform) {
      const size = renderer.getSize(new THREE.Vector2());
      resolutionUniform.value.set(size.x, size.y);
    }
  }
}


interface Bitmap3DProps {
  children: ReactNode;
  className?: string;
  ambientIntensity?: number;
  directionalIntensity?: number;
  pointIntensity?: number;
  isVisible?: boolean;
}

const Bitmap3D: FC<Bitmap3DProps> = ({
  children,
  className = "fixed top-0 left-0 w-screen h-[200vh] -z-50 pointer-events-none overflow-hidden",
  ambientIntensity = 0.3,
  directionalIntensity = 1.2,
  pointIntensity = 0.8,
  isVisible = true,
}) => {
  const effect = useMemo(() => new HalftoneEffectImpl(), []);

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8] }}
        style={{ width: "100%", height: "100%" }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
        dpr={1}
        frameloop={isVisible ? "always" : "never"}
      >
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 5, 5]} intensity={directionalIntensity} />
        <pointLight
          position={[-3, -3, 3]}
          intensity={pointIntensity}
          color="#ffffff"
        />

        {children}

        <EffectComposer>
          <primitive object={effect} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Bitmap3D;
export { HalftoneEffectImpl };
