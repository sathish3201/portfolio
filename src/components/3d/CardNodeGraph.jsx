import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const CYAN = "#22d3ee";
const PURPLE = "#a855f7";

// Lighter-weight node-graph for the non-flagship project cards — same
// visual language as ProjectArchitectureScene (central node + orbiting
// satellites + connecting lines) but with fewer nodes and a smaller
// footprint, so the flagship card stays visually the most elaborate.
// `nodeCount` and `accent` let each card read as distinct rather than
// eight identical graphs.
function Graph({ nodeCount, accent }) {
  const groupRef = useRef(null);
  const primary = accent === "purple" ? PURPLE : CYAN;
  const secondary = accent === "purple" ? CYAN : PURPLE;

  const positions = useMemo(() => {
    const radius = 1.1;
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2;
      return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.55, Math.sin(angle) * 0.3];
    });
  }, [nodeCount]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere args={[0.18, 20, 20]}>
          <meshStandardMaterial color={primary} emissive={primary} emissiveIntensity={1.3} roughness={0.3} />
        </Sphere>
      </Float>

      {positions.map((pos, i) => (
        <group key={i}>
          <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.6}>
            <Sphere args={[0.11, 16, 16]} position={pos}>
              <meshStandardMaterial
                color={i % 2 === 0 ? secondary : primary}
                emissive={i % 2 === 0 ? secondary : primary}
                emissiveIntensity={1.2}
                roughness={0.3}
              />
            </Sphere>
          </Float>
          <Line points={[[0, 0, 0], pos]} color={primary} transparent opacity={0.45} lineWidth={2} />
        </group>
      ))}

      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={1.3} color={primary} />
      <pointLight position={[-2, -1, 1.5]} intensity={1} color={secondary} />
    </group>
  );
}

export default function CardNodeGraph({ nodeCount = 3, accent = "cyan" }) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Graph nodeCount={nodeCount} accent={accent} />
        <EffectComposer>
          <Bloom intensity={1} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
