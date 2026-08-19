import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const CYAN = "#22d3ee";
const PURPLE = "#a855f7";

// Large, sparse node-graph meant to sit behind the whole About section at
// low opacity — same visual language as the Projects/Hero graphs, but
// spread wider and rendered dimmer so it reads as ambient texture behind
// the reading-heavy paragraphs, not a competing focal point.
const NODES = [
  { pos: [-3.2, 1.6, -1], color: CYAN, size: 0.16 },
  { pos: [3, 2.2, -1.5], color: PURPLE, size: 0.13 },
  { pos: [-2.4, -2, -0.5], color: PURPLE, size: 0.11 },
  { pos: [3.4, -1.8, -1], color: CYAN, size: 0.15 },
  { pos: [0, 3, -2], color: CYAN, size: 0.1 },
];

function Graph() {
  const groupRef = useRef(null);
  const links = useMemo(
    () => [
      [NODES[0].pos, NODES[4].pos],
      [NODES[4].pos, NODES[1].pos],
      [NODES[0].pos, NODES[2].pos],
      [NODES[1].pos, NODES[3].pos],
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {NODES.map((n, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
          <Sphere args={[n.size, 20, 20]} position={n.pos}>
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={1.1} roughness={0.35} />
          </Sphere>
        </Float>
      ))}

      {links.map((pts, i) => (
        <Line key={i} points={pts} color={CYAN} transparent opacity={0.2} lineWidth={1.5} />
      ))}

      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1} color={CYAN} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color={PURPLE} />
    </group>
  );
}

export default function AboutBackgroundGraph() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Graph />
        <EffectComposer>
          <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
