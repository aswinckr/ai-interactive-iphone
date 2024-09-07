"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

const colors = [
  { name: "Hot Pink", value: "#FF69B4" },
  { name: "Matte Teal", value: "#2A9D8F" },
  { name: "Matte Coral", value: "#E76F51" },
  { name: "Matte Purple", value: "#7B2CBF" },
];

function ColorSelector({
  selectedColor,
  onColorSelect,
}: {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
      {colors.map((color) => (
        <button
          key={color.name}
          className={`w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-transform ${
            selectedColor === color.value ? "ring-2 ring-white scale-110" : ""
          }`}
          style={{ backgroundColor: color.value }}
          onClick={() => onColorSelect(color.value)}
          title={color.name}
        />
      ))}
    </div>
  );
}

function IPhoneModel({
  color,
  triggerRotation,
}: {
  color: string;
  triggerRotation: number;
}) {
  const { scene } = useGLTF("/models/iphone.glb");
  const groupRef = useRef<THREE.Group>();
  const rotationRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        if (
          child.material.name === "oZRkkORNzkufnGD" ||
          child.material.name === "eShKpuMNVJTRrgg"
        ) {
          child.material.color.set(color);
          child.material.metalness = 0.3; // Adjust for a more matte look
          child.material.roughness = 0.7; // Increase roughness for a matte finish
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, color]);

  useEffect(() => {
    rotationRef.current.target += Math.PI * 2;
  }, [triggerRotation]);

  useFrame(() => {
    if (groupRef.current) {
      rotationRef.current.current = THREE.MathUtils.lerp(
        rotationRef.current.current,
        rotationRef.current.target,
        0.05
      );
      groupRef.current.rotation.y = rotationRef.current.current;
    }
  });

  return (
    <group ref={groupRef as React.Ref<THREE.Group>}>
      <primitive object={scene} />
    </group>
  );
}

export default function Home() {
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [rotationTrigger, setRotationTrigger] = useState(0);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setRotationTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full h-screen relative bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Stage environment="studio" intensity={0.6}>
          <IPhoneModel
            color={selectedColor}
            triggerRotation={rotationTrigger}
          />
        </Stage>
        <OrbitControls enableZoom={false} />
      </Canvas>
      <ColorSelector
        selectedColor={selectedColor}
        onColorSelect={handleColorSelect}
      />
    </div>
  );
}
