import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const CYAN = "#22d3ee";
const PURPLE = "#a855f7";

function Node({ color }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.5;
    meshRef.current.rotation.y = t * 0.35;
  });

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.3} roughness={0.25} />
      </mesh>
    </Float>
  );
}

// Tiny rotating node badge for each Experience timeline entry, replacing the
// flat Briefcase icon. Alternates cyan/purple by index so consecutive
// timeline entries read as distinct, echoing the cyan-to-purple gradient
// already used on the timeline's connecting line.
export default function ExperienceNode3D({ accent = "cyan" }) {
  const color = accent === "purple" ? PURPLE : CYAN;

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Node color={color} />
        <ambientLight intensity={0.6} />
        <pointLight position={[1.5, 1.5, 1.5]} intensity={1.2} color={color} />
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
