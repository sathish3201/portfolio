import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float, Line, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Same accent palette as ParticleField.jsx's COLOR_A/COLOR_B, reused here so
// this scene reads as part of the same design system, not a one-off effect.
const CYAN = "#22d3ee";
const PURPLE = "#a855f7";

// Four satellite nodes standing in for local-agent-pipeline's real
// architecture: NL-to-SQL, RAG (ChromaDB), the MCP tool layer, and the
// two-tier cache. Sizes vary so the graph doesn't read as four identical
// dots — the two "heavier" systems (RAG, cache) get a slightly larger node.
const SATELLITES = [
  { angle: 0, color: CYAN, size: 0.16 },
  { angle: Math.PI / 2, color: PURPLE, size: 0.12 },
  { angle: Math.PI, color: CYAN, size: 0.18 },
  { angle: (3 * Math.PI) / 2, color: PURPLE, size: 0.13 },
];
const ORBIT_RADIUS = 1.3;

function Node({ position, color, size }) {
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere args={[size, 24, 24]} position={position}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} roughness={0.25} />
      </Sphere>
    </Float>
  );
}

function ArchitectureGraph() {
  const groupRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const satellitePositions = useMemo(
    () =>
      SATELLITES.map((s) => [
        Math.cos(s.angle) * ORBIT_RADIUS,
        Math.sin(s.angle) * ORBIT_RADIUS * 0.5,
        Math.sin(s.angle) * 0.4,
      ]),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Ambient auto-rotation is the base motion; pointer tilt is layered on
    // top as an additive offset rather than overwriting rotation.y each
    // frame (that was the earlier bug — resetting rotation.y to the ambient
    // value every frame silently discarded the pointer contribution before
    // it could ever be seen). Tilt amounts are smaller than ParticleField's
    // since this scene fills a small ~160px card header, not the full
    // viewport — the same rotation magnitude would look far more extreme
    // here relative to the object's on-screen size.
    const baseY = t * 0.15;
    const tiltX = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.current.y * 0.18, 0.06);
    const tiltYOffset = THREE.MathUtils.lerp(
      groupRef.current.userData.tiltYOffset ?? 0,
      mouse.current.x * 0.18,
      0.06
    );

    groupRef.current.rotation.x = tiltX;
    groupRef.current.rotation.y = baseY + tiltYOffset;
    groupRef.current.userData.tiltYOffset = tiltYOffset;

    if (state.pointer) {
      mouse.current = { x: state.pointer.x, y: state.pointer.y };
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central "Agent / MCP Server" node */}
      <Node position={[0, 0, 0]} color={CYAN} size={0.24} />

      {satellitePositions.map((pos, i) => (
        <group key={i}>
          <Node position={pos} color={SATELLITES[i].color} size={SATELLITES[i].size} />
          <Line
            points={[[0, 0, 0], pos]}
            color={SATELLITES[i].color}
            transparent
            opacity={0.55}
            lineWidth={2.5}
          />
        </group>
      ))}

      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={1.4} color={CYAN} />
      <pointLight position={[-2, -1, 1.5]} intensity={1.1} color={PURPLE} />
    </group>
  );
}

export default function ProjectArchitectureScene() {
  // Drag-to-rotate and scroll-to-zoom are disabled until the scene is
  // clicked/focused — the card sits in normal page scroll flow, so an
  // always-on wheel/drag listener would hijack the visitor's scroll or
  // text-selection the moment their cursor crosses the card. Clicking
  // opts in; clicking elsewhere (blur) opts back out.
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const cursorClass = !focused ? "cursor-pointer" : dragging ? "cursor-grabbing" : "cursor-grab";

  return (
    <div
      className={`h-full w-full ${cursorClass}`}
      onClick={() => setFocused(true)}
      onPointerLeave={() => setFocused(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ArchitectureGraph />
        <EffectComposer>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
        <OrbitControls
          enabled={focused}
          enableZoom={focused}
          enableRotate={focused}
          enablePan={false}
          minDistance={1.8}
          maxDistance={5}
          onStart={() => setDragging(true)}
          onEnd={() => setDragging(false)}
        />
      </Canvas>
    </div>
  );
}
