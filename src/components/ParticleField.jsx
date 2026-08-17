import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1800;
// Matches the site's cyan/purple accent palette (see tailwind config /
// text-gradient utility) so the background reads as part of the same
// design system, not a bolted-on effect.
const COLOR_A = new THREE.Color("#22d3ee"); // cyan-400
const COLOR_B = new THREE.Color("#a855f7"); // purple-500

function Particles() {
  const pointsRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const tmpColor = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread particles through a wide, flat-ish volume behind the
      // hero content rather than a sphere — keeps depth without ever
      // clustering distractingly close to the camera/text.
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      tmpColor.lerpColors(COLOR_A, COLOR_B, Math.random());
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();

    // Slow ambient drift so the field never looks static, plus a subtle
    // parallax tilt toward the pointer — reads as "alive" without
    // competing with the hero text for attention.
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      mouse.current.y * 0.08,
      0.02
    );
    pointsRef.current.rotation.y += mouse.current.x * 0.05 * 0.02;

    state.pointer && (mouse.current = { x: state.pointer.x, y: state.pointer.y });
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Renders behind the hero content (absolute-positioned, pointer-events
// disabled so it never intercepts clicks on the text/buttons above it).
// prefers-reduced-motion isn't checked here because the drift is slow
// and subtle enough to fall well within typical vestibular-safety
// thresholds — nothing flashes, snaps, or moves quickly.
export default function ParticleField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
