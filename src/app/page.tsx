"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";

function IPhoneModel() {
  const { scene } = useGLTF("/models/iphone.glb");
  return <primitive object={scene} />;
}

export default function Home() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Stage environment="studio" intensity={0.6}>
          <IPhoneModel />
        </Stage>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
