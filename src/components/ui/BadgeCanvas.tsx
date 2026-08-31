import * as THREE from 'three';
import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';

useGLTF.preload('/tag.glb');
useTexture.preload('/band.jpg');

function Badge() {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  const gltf = useGLTF('/tag.glb') as unknown as {
    nodes: {
      card: THREE.Mesh;
      clip: THREE.Mesh;
      clamp: THREE.Mesh;
    };
    materials: {
      base: THREE.MeshStandardMaterial;
      metal: THREE.MeshStandardMaterial;
    };
  };
  const { nodes, materials } = gltf;

  const bandTexture = useTexture('/band.jpg');
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;
  bandTexture.repeat.set(1, 4);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural smooth 3D tilting on hover & subtle floating
    const targetRotX = Math.sin(t * 1.2) * 0.04 + (hovered ? -state.pointer.y * 0.2 : 0);
    const targetRotY = Math.sin(t * 0.8) * 0.06 + (hovered ? state.pointer.x * 0.3 : 0);
    const targetPosY = Math.sin(t * 1.5) * 0.05;

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosY, 5, delta);
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* สายคล้องคอ (Strap) ดิ่งตรงจากขอบบนสุดของ Container ลงมาที่คลิปอย่างสมบูรณ์แบบ ไร้รอยต่อ ไร้การกระพริบ */}
      <mesh position={[0, 2.3, 0]}>
        <planeGeometry args={[0.3, 2.8]} />
        <meshStandardMaterial
          map={bandTexture}
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* บัตร + คลิป 3D สัดส่วนมาตรฐาน */}
      <group scale={2.2} position={[0, -0.6, 0]}>
        <mesh geometry={nodes.card.geometry}>
          <meshPhysicalMaterial
            map={materials.base.map}
            map-anisotropy={16}
            clearcoat={1}
            clearcoatRoughness={0.15}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        <mesh
          geometry={nodes.clip.geometry}
          material={materials.metal}
          material-roughness={0.3}
        />
        <mesh
          geometry={nodes.clamp.geometry}
          material={materials.metal}
        />
      </group>
    </group>
  );
}

export function BadgeCanvas() {
  return (
    <div className="relative w-full h-[520px] flex items-center justify-center select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 32 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full cursor-pointer"
      >
        <ambientLight intensity={Math.PI * 0.9} />
        
        <Suspense fallback={null}>
          <Badge />

          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={8}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default BadgeCanvas;
