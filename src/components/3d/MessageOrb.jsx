import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

const CYAN = "#22d3ee";
const PURPLE = "#a855f7";

// Tiny per-message avatar orb — cyan for the visitor's own messages,
// purple for the assistant's — sized to sit inline with each chat bubble
// like a mini avatar. No Bloom/EffectComposer here: at ~24px on screen
// the extra postprocessing pass isn't visible and isn't worth paying for
// on every single message in a growing conversation.
function Orb({ color }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 1.2;
  });

  return (
    <Sphere ref={meshRef} args={[0.9, 20, 20]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} roughness={0.3} />
    </Sphere>
  );
}

export default function MessageOrb({ accent = "cyan" }) {
  const color = accent === "purple" ? PURPLE : CYAN;

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 2.6], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Orb color={color} />
        <ambientLight intensity={0.7} />
        <pointLight position={[1, 1, 1]} intensity={1} color={color} />
      </Canvas>
    </div>
  );
}
