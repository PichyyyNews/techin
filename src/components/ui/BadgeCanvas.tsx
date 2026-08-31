import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface BadgeProps {
  name?: string;
  role?: string;
  subRole?: string;
  idNumber?: string;
}

// ----------------------------------------------------------------------------
// Physics-driven Lanyard & Card Component (Vercel Ship Interactive 3D Event Badge)
// ----------------------------------------------------------------------------
function Lanyard({
  name = 'S. PICHAYUT',
  role = 'STUDENT TEACHER',
  subRole = 'สาธิตมหาวิทยาลัย / CS EDU',
  idNumber = 'ID: 6710203040',
}: BadgeProps) {
  const { camera } = useThree();
  
  // Physics simulation state
  const isDragging = useRef(false);
  const cardPos = useRef(new THREE.Vector3(0, -0.6, 0));
  const cardVel = useRef(new THREE.Vector3(0, 0, 0));
  const cardRot = useRef(new THREE.Euler(0, 0, 0));
  const rotVel = useRef(new THREE.Euler(0, 0, 0));

  const cardRef = useRef<THREE.Group>(null);
  const strapRef = useRef<THREE.Mesh>(null);

  // Anchor point at the top
  const anchor = useMemo(() => new THREE.Vector3(0, 2.4, 0), []);

  // Curve points for dynamic lanyard ribbon
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.4, 0),
      new THREE.Vector3(0, 1.4, 0),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, -0.6, 0),
    ]);
  }, []);

  // Frame update: Spring kinematics and physics oscillation
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();

    if (isDragging.current) {
      // Calculate 3D target point from 2D pointer raycast
      const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const target = camera.position.clone().add(dir.multiplyScalar(distance));
      
      // Clamp drag area
      target.x = Math.max(-2.5, Math.min(2.5, target.x));
      target.y = Math.max(-2.0, Math.min(1.2, target.y));
      target.z = 0;

      // Spring drag pull
      const diff = target.clone().sub(cardPos.current);
      cardVel.current.add(diff.multiplyScalar(24 * dt));
      
      // Dynamic tilt when dragging
      rotVel.current.y += (diff.x * 2.5 - cardRot.current.y) * 15 * dt;
      rotVel.current.z += (-diff.x * 1.5 - cardRot.current.z) * 15 * dt;
      rotVel.current.x += (diff.y * 1.5 - cardRot.current.x) * 15 * dt;
    } else {
      // Natural hanging gravity & spring pull to rest position
      const restTarget = new THREE.Vector3(
        Math.sin(t * 1.2) * 0.12 + (state.pointer.x * 0.15),
        -0.6 + Math.sin(t * 2) * 0.04,
        Math.cos(t * 1.5) * 0.08
      );

      const springForce = restTarget.sub(cardPos.current).multiplyScalar(14);
      cardVel.current.add(springForce.multiplyScalar(dt));

      // Natural sway rotations
      const targetRotY = Math.sin(t * 0.9) * 0.2 + (state.pointer.x * 0.3);
      const targetRotZ = Math.sin(t * 1.4) * 0.08 + (cardVel.current.x * -0.2);
      const targetRotX = Math.cos(t * 1.1) * 0.06 + (cardVel.current.y * 0.15);

      rotVel.current.y += (targetRotY - cardRot.current.y) * 10 * dt;
      rotVel.current.z += (targetRotZ - cardRot.current.z) * 10 * dt;
      rotVel.current.x += (targetRotX - cardRot.current.x) * 10 * dt;
    }

    // Apply damping
    cardVel.current.multiplyScalar(0.92);
    rotVel.current.x *= 0.88;
    rotVel.current.y *= 0.88;
    rotVel.current.z *= 0.88;

    // Integrate position & rotation
    cardPos.current.add(cardVel.current.clone().multiplyScalar(dt * 10));
    cardRot.current.x += rotVel.current.x * dt * 10;
    cardRot.current.y += rotVel.current.y * dt * 10;
    cardRot.current.z += rotVel.current.z * dt * 10;

    // Update 3D card mesh
    if (cardRef.current) {
      cardRef.current.position.copy(cardPos.current);
      cardRef.current.rotation.copy(cardRot.current);
    }

    // Update lanyard ribbon strap geometry
    if (strapRef.current) {
      const mid1 = new THREE.Vector3(
        cardPos.current.x * 0.35,
        1.5 + Math.sin(t) * 0.02,
        cardPos.current.z * 0.35
      );
      const mid2 = new THREE.Vector3(
        cardPos.current.x * 0.75,
        0.4,
        cardPos.current.z * 0.75
      );
      const cardClipTop = cardPos.current.clone().add(new THREE.Vector3(0, 1.7, 0));

      curve.points = [anchor, mid1, mid2, cardClipTop];
      
      const newGeom = new THREE.TubeGeometry(curve, 32, 0.035, 8, false);
      strapRef.current.geometry.dispose();
      strapRef.current.geometry = newGeom;
    }
  });

  return (
    <>
      {/* 1. Dynamic Lanyard Ribbon Cord (สายคล้องคอ 3D ที่ขยับตามแรงฟิสิกส์) */}
      <mesh ref={strapRef}>
        <tubeGeometry args={[curve, 32, 0.035, 8, false]} />
        <meshStandardMaterial
          color="#18181B"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Top Anchor Ring (จุดยึดสายด้านบน) */}
      <mesh position={[0, 2.4, 0]}>
        <torusGeometry args={[0.08, 0.02, 16, 32]} />
        <meshStandardMaterial color="#D4D4D8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 3. Physics Interactive Event Card */}
      <group
        ref={cardRef}
        position={[0, -0.6, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          isDragging.current = true;
          (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
        }}
        onPointerUp={(e) => {
          isDragging.current = false;
          (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
        }}
      >
        {/* Metal Lanyard Clip (คลิปหนีบโลหะ) */}
        <mesh position={[0, 1.78, 0]}>
          <boxGeometry args={[0.36, 0.18, 0.1]} />
          <meshStandardMaterial color="#D4D4D8" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Clip Metal Ring */}
        <mesh position={[0, 1.66, 0]}>
          <torusGeometry args={[0.09, 0.02, 16, 32]} />
          <meshStandardMaterial color="#E4E4E7" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Main 3D Card Body with Smooth Edges */}
        <RoundedBox
          args={[2.35, 3.45, 0.06]}
          radius={0.1}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#09090B"
            metalness={0.3}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Inset Inner Plate */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[2.15, 3.25]} />
          <meshStandardMaterial color="#121215" roughness={0.4} />
        </mesh>

        {/* Top Hole Slot */}
        <mesh position={[0, 1.45, 0.04]}>
          <planeGeometry args={[0.45, 0.07]} />
          <meshBasicMaterial color="#09090B" />
        </mesh>

        {/* Header Ribbon Tag */}
        <mesh position={[0, 1.18, 0.04]}>
          <planeGeometry args={[1.95, 0.32]} />
          <meshStandardMaterial color="#27272A" />
        </mesh>

        <Text
          position={[0, 1.18, 0.05]}
          fontSize={0.11}
          color="#FAFAFA"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          ACADEMIC PRACTICUM 2026
        </Text>

        {/* Profile Avatar Graphic Frame */}
        <mesh position={[0, 0.52, 0.04]}>
          <planeGeometry args={[1.05, 1.05]} />
          <meshStandardMaterial color="#18181B" roughness={0.5} />
        </mesh>

        <mesh position={[0, 0.52, 0.045]}>
          <planeGeometry args={[0.95, 0.95]} />
          <meshStandardMaterial color="#27272A" roughness={0.3} metalness={0.4} />
        </mesh>

        <Text
          position={[0, 0.52, 0.055]}
          fontSize={0.35}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          SP
        </Text>

        {/* Name */}
        <Text
          position={[0, -0.22, 0.05]}
          fontSize={0.17}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          {name}
        </Text>

        {/* Role */}
        <Text
          position={[0, -0.48, 0.05]}
          fontSize={0.12}
          color="#A1A1AA"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          {role}
        </Text>

        {/* Sub-role */}
        <Text
          position={[0, -0.72, 0.05]}
          fontSize={0.1}
          color="#71717A"
          anchorX="center"
          anchorY="middle"
        >
          {subRole}
        </Text>

        {/* Divider */}
        <mesh position={[0, -0.96, 0.04]}>
          <planeGeometry args={[1.8, 0.015]} />
          <meshBasicMaterial color="#27272A" />
        </mesh>

        {/* ID Number */}
        <Text
          position={[-0.45, -1.18, 0.05]}
          fontSize={0.09}
          color="#E4E4E7"
          anchorX="left"
          anchorY="middle"
        >
          {idNumber}
        </Text>

        {/* Status Light Dot */}
        <mesh position={[0.68, -1.18, 0.045]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </>
  );
}

// ----------------------------------------------------------------------------
// BadgeCanvas Container
// ----------------------------------------------------------------------------
export function BadgeCanvas() {
  return (
    <div className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] lg:h-[540px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 45 }}
        className="w-full h-full"
        gl={{ alpha: true, antialias: true }}
      >
        {/* Studio Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-5, -2, -2]} intensity={0.6} />
        <pointLight position={[0, 2, 4]} intensity={0.8} />

        {/* 3D Interactive Lanyard with Physics Spring Drag */}
        <Lanyard />
      </Canvas>

      {/* Interaction Hint Badge */}
      <div className="absolute bottom-2 right-4 pointer-events-none text-[10px] font-mono text-neutral-400 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-xs border border-neutral-200 shadow-2xs flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" />
        <span>Grab & fling 3D badge</span>
      </div>
    </div>
  );
}

export default BadgeCanvas;
