import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Halo() {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.05;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
  });

  return (
    <Float speed={0.45} rotationIntensity={0.12} floatIntensity={0.35}>
      <mesh ref={mesh} position={[0, 0, -2.2]} scale={[5.4, 5.4, 1]}>
        <torusGeometry args={[1.2, 0.012, 16, 160]} />
        <meshBasicMaterial color="#f5d26b" transparent opacity={0.22} />
      </mesh>
    </Float>
  );
}

export function CinematicBackdrop({ active }: { active: boolean }) {
  return (
    <div className="cinematic-backdrop" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[2, 3, 2]} intensity={active ? 2.2 : 1} color="#f5d26b" />
        <pointLight position={[-3, -1, 1]} intensity={1.1} color="#72e4ff" />
        <Sparkles
          count={active ? 110 : 45}
          speed={active ? 0.7 : 0.25}
          opacity={0.45}
          scale={[7, 4, 3]}
          size={2.2}
          color="#f9fafb"
        />
        <Halo />
      </Canvas>
    </div>
  );
}
