import * as THREE from 'three';
import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { cn } from '../../lib/utils';

extend({ MeshLineGeometry, MeshLineMaterial });

useGLTF.preload('/tag.glb');
useTexture.preload('/band.jpg');
useTexture.preload('/badge-custom.png');

function Band({ maxSpeed = 50, minSpeed = 10 }: { maxSpeed?: number; minSpeed?: number }) {
  const band = useRef<THREE.Mesh & { geometry: { setPoints: (pts: THREE.Vector3[]) => void } }>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null!);
  const j2 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null!);
  const j3 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = useRef(new THREE.Vector3()).current;
  const ang = useRef(new THREE.Vector3()).current;
  const rot = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 3,
    linearDamping: 3,
  };

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

  const texture = useTexture('/band.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  const cardTexture = useTexture('/badge-custom.png');
  cardTexture.flipY = false;
  cardTexture.colorSpace = THREE.SRGBColorSpace;
  const { width, height } = useThree((state) => state.size);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  // Physics constraints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      // Fix jitter on middle rope joints
      [j1, j2].forEach((ref) => {
        if (ref.current) {
          if (!ref.current.lerped) {
            ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
          }
          const clampedDistance = Math.max(
            0.1,
            Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
          );
          ref.current.lerped.lerp(
            ref.current.translation(),
            delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
          );
        }
      });

      // Point 0 stays 100% glued to j3 at the metal clip ring without any lag
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped || j2.current.translation());
      curve.points[2].copy(j1.current.lerped || j1.current.translation());
      curve.points[3].copy(fixed.current.translation());

      const points = curve.getPoints(32);
      band.current.geometry.setPoints(points);

      // Tilt card back towards the screen
      ang.copy(card.current.angvel() as THREE.Vector3);
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel(
        { x: ang.x * 0.98, y: ang.y * 0.98 - rot.y * 0.25, z: ang.z * 0.98 },
        true
      );
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 2.88, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
              if (card.current) {
                const currentTrans = card.current.translation();
                drag(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(vec.set(currentTrans.x, currentTrans.y, currentTrans.z))
                );
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.2}
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
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-expect-error meshLineGeometry registered via extend */}
        <meshLineGeometry />
        {/* @ts-expect-error meshLineMaterial registered via extend */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap={1}
          map={texture}
          repeat={[-3, 1]}
          lineWidth={1}
          onBeforeCompile={(shader: { vertexShader: string }) => {
            shader.vertexShader = shader.vertexShader.replace(
              'normal.xy *= .5 * w;',
              `if (counters <= 0.05 || counters >= 0.95) {
                normal.y = 0.0;
                normal.x = -1.0;
              }
              normal.xy *= .5 * w;`
            );
          }}
        />
      </mesh>
    </>
  );
}

export function BadgeCanvas({ className }: { className?: string } = {}) {
  return (
    <div className={cn("relative w-full h-[520px] sm:h-[580px] lg:h-[640px] flex items-start justify-center select-none overflow-visible", className)}>
      <Canvas
        camera={{ position: [0, 0, 13], fov: 25 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={Math.PI} />
        
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band />
          </Physics>

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
              intensity={10}
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
