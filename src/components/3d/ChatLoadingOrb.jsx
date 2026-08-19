import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const CYAN = "#22d3ee";
const PURPLE = "#a855f7";

// Replaces the flat spinner icon while the chat is waiting on a model
// reply — a small orbiting/pulsing sphere pair standing in for the
// request "thinking," reusing the same bloom/emissive language as the
// rest of the site's 3D accents instead of a generic loading spinner.
function Orb() {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 3;
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.32, 20, 20]}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.4} roughness={0.25} />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.5, 0, 0]}>
        <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={1.4} roughness={0.25} />
      </Sphere>
    </group>
  );
}

export default function ChatLoadingOrb() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 1.8], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Orb />
        <ambientLight intensity={0.6} />
        <pointLight position={[1, 1, 1]} intensity={1.2} color={CYAN} />
        <EffectComposer>
          <Bloom intensity={1} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
