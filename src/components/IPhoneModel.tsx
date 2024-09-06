import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function IPhone() {
  const { scene } = useGLTF("/models/iphone.glb");
  const ref = useRef<THREE.Group>();

  useEffect(() => {
    if (ref.current) {
      // Adjust the scale of the model
      ref.current.scale.set(50, 50, 50);
      // Center the model
      ref.current.position.set(0, 0, 0);
    }
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return <primitive object={scene} ref={ref} />;
}

function CameraController() {
  const { camera, gl } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 200);
    camera.updateProjectionMatrix();
  }, [camera]);

  return (
    <OrbitControls
      enableZoom={true}
      enablePan={false}
      minDistance={100}
      maxDistance={300}
      args={[camera, gl.domElement]}
    />
  );
}

export default function IPhoneModel() {
  return (
    <Canvas>
      <CameraController />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <IPhone />
    </Canvas>
  );
}
