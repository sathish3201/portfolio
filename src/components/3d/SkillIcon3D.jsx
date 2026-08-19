import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const CYAN = "#22d3ee";
const PURPLE = "#a855f7";

// One distinct primitive per skill category, so the four icon slots read as
// visually different at a glance rather than four identical shapes in
// different colors — mirrors each category's own character loosely
// (box = structured/database, torus = looping/pipeline, octahedron =
// distributed/cloud, icosahedron = many-faceted/tools).
const GEOMETRY = {
  box: (args) => <boxGeometry args={args} />,
  torus: (args) => <torusGeometry args={[args[0] * 0.6, args[0] * 0.28, 16, 32]} />,
  octahedron: (args) => <octahedronGeometry args={[args[0] * 0.75, 0]} />,
  icosahedron: (args) => <icosahedronGeometry args={[args[0] * 0.75, 0]} />,
};

function Shape({ shape, color }) {
  const meshRef = useRef(null);
  const geometryArgs = [0.62, 0.62, 0.62];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.4;
    meshRef.current.rotation.y = t * 0.55;
  });

  return (
    <Float speed={2.5} rotationIntensity={0} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        {(GEOMETRY[shape] ?? GEOMETRY.box)(geometryArgs)}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} roughness={0.3} />
      </mesh>
    </Float>
  );
}

export default function SkillIcon3D({ shape = "box", accent = "cyan" }) {
  const color = accent === "purple" ? PURPLE : CYAN;

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Shape shape={shape} color={color} />
        <ambientLight intensity={0.6} />
        <pointLight position={[1.5, 1.5, 1.5]} intensity={1.2} color={color} />
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
