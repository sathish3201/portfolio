import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Same accent palette as ParticleField.jsx / ProjectArchitectureScene.jsx.
const CYAN = "#22d3ee";
const PURPLE = "#a855f7";

// Larger-scale version of the Local Agent Pipeline node-graph from the
// Projects flagship card, sized to sit behind the Hero's headline as a
// background centerpiece rather than a small card-header accent.
const SATELLITES = [
  { angle: 0, color: CYAN, size: 0.34 },
  { angle: Math.PI / 2, color: PURPLE, size: 0.26 },
  { angle: Math.PI, color: CYAN, size: 0.38 },
  { angle: (3 * Math.PI) / 2, color: PURPLE, size: 0.28 },
];
const ORBIT_RADIUS = 2.8;

function Node({ position, color, size }) {
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.7}>
      <Sphere args={[size, 24, 24]} position={position}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} roughness={0.25} />
      </Sphere>
    </Float>
  );
}

// The "glowing ball" centerpiece — a pulsing emissive core standing in for
// the Agent/MCP hub, distinct from (and larger than) the graph's own
// central node so it reads as the scene's focal point.
function GlowingCore() {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 1.4) * 0.08;
    meshRef.current.scale.setScalar(pulse);
    meshRef.current.material.emissiveIntensity = 1.6 + Math.sin(t * 1.4) * 0.6;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <Sphere ref={meshRef} args={[0.55, 32, 32]}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} roughness={0.15} />
      </Sphere>
    </Float>
  );
}

function PipelineGraph() {
  const groupRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const satellitePositions = useMemo(
    () =>
      SATELLITES.map((s) => [
        Math.cos(s.angle) * ORBIT_RADIUS,
        Math.sin(s.angle) * ORBIT_RADIUS * 0.5,
        Math.sin(s.angle) * 0.8,
      ]),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Same additive-tilt pattern as ProjectArchitectureScene: ambient
    // auto-rotation as the base, pointer tilt layered on top rather than
    // overwriting rotation.y each frame.
    const baseY = t * 0.08;
    const tiltX = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.current.y * 0.1, 0.05);
    const tiltYOffset = THREE.MathUtils.lerp(
      groupRef.current.userData.tiltYOffset ?? 0,
      mouse.current.x * 0.1,
      0.05
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
      <GlowingCore />

      {satellitePositions.map((pos, i) => (
        <group key={i}>
          <Node position={pos} color={SATELLITES[i].color} size={SATELLITES[i].size} />
          <Line
            points={[[0, 0, 0], pos]}
            color={SATELLITES[i].color}
            transparent
            opacity={0.4}
            lineWidth={2}
          />
        </group>
      ))}

      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={1.4} color={CYAN} />
      <pointLight position={[-4, -2, 3]} intensity={1.1} color={PURPLE} />
    </group>
  );
}

export default function HeroPipelineScene() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <PipelineGraph />
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
