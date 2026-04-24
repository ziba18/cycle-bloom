import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment, Html } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

type Marker = { id: string; region: string; pain: number };
type Props = {
  onSelect: (id: string) => void;
  selected: string | null;
  markers: Marker[];
};

// Region positions in 3D space (approximate human body in standing pose)
const REGION_POSITIONS: Record<string, [number, number, number]> = {
  head: [0, 2.4, 0],
  chest: [0, 1.2, 0.25],
  abdomen: [0, 0.3, 0.25],
  pelvis: [0, -0.5, 0.2],
  lowerBack: [0, 0.3, -0.25],
  armL: [-1.1, 1.0, 0],
  armR: [1.1, 1.0, 0],
  legL: [-0.35, -1.6, 0],
  legR: [0.35, -1.6, 0],
};

export function AnatomyScene({ onSelect, selected, markers }: Props) {
  const [hasWebGL] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch { return false; }
  });

  if (!hasWebGL) {
    return (
      <div className="h-full flex items-center justify-center text-center px-6">
        <div>
          <p className="font-display text-2xl">3D body unavailable</p>
          <p className="text-sm text-muted-foreground mt-2">Your browser does not support WebGL. You can still log regions using the buttons.</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0.4, 6], fov: 38 }} dpr={[1, 2]}>
      <color attach="background" args={["#faf6f0"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#f8c8dc" />
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
          <Body onSelect={onSelect} selected={selected} markers={markers} />
        </Float>
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3.5} maxDistance={9} />
    </Canvas>
  );
}

function Body({ onSelect, selected, markers }: Props) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.05;
  });

  const baseMat = (
    <meshPhysicalMaterial
      color="#cfe3c7"
      roughness={0.45}
      transmission={0.05}
      thickness={0.5}
      clearcoat={0.3}
      clearcoatRoughness={0.6}
    />
  );

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Head */}
      <mesh position={REGION_POSITIONS.head} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 48, 48]} />
        {baseMat}
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 24]} />
        {baseMat}
      </mesh>
      {/* Torso (chest) */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.6, 0.7, 16, 24]} />
        {baseMat}
      </mesh>
      {/* Abdomen */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <capsuleGeometry args={[0.5, 0.4, 16, 24]} />
        {baseMat}
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <capsuleGeometry args={[0.55, 0.25, 16, 24]} />
        {baseMat}
      </mesh>
      {/* Arms */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.85, 1.25, 0]} rotation={[0, 0, s * 0.15]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.16, 1.4, 12, 16]} />
            {baseMat}
          </mesh>
        </group>
      ))}
      {/* Legs */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.28, -1.4, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.22, 1.5, 12, 16]} />
            {baseMat}
          </mesh>
        </group>
      ))}

      {/* Hit zones for region selection */}
      {Object.entries(REGION_POSITIONS).map(([id, pos]) => (
        <HitZone
          key={id}
          id={id}
          position={pos}
          selected={selected === id}
          onSelect={onSelect}
          radius={radiusFor(id)}
        />
      ))}

      {/* Markers */}
      {markers.map((m) => {
        const pos = REGION_POSITIONS[m.region] ?? REGION_POSITIONS.abdomen;
        return (
          <mesh key={m.id} position={[pos[0] * 1.05, pos[1], pos[2] + 0.4]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color={painCol(m.pain)}
              emissive={painCol(m.pain)}
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function HitZone({ id, position, selected, onSelect, radius }: {
  id: string; position: [number, number, number]; selected: boolean; onSelect: (id: string) => void; radius: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <group position={position}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
        onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial
          color={selected ? "#a8c4a2" : "#f8c8dc"}
          transparent
          opacity={hover || selected ? 0.35 : 0}
        />
      </mesh>
      {(hover || selected) && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="px-2 py-1 rounded-full bg-card/90 backdrop-blur text-[10px] font-medium border border-border whitespace-nowrap shadow-soft">
            {labelFor(id)}
          </div>
        </Html>
      )}
    </group>
  );
}

function radiusFor(id: string) {
  if (id === "head") return 0.6;
  if (id.startsWith("arm")) return 0.35;
  if (id.startsWith("leg")) return 0.4;
  if (id === "lowerBack") return 0.5;
  return 0.55;
}

function labelFor(id: string) {
  return ({
    head: "Head", chest: "Chest", abdomen: "Abdomen", pelvis: "Pelvis",
    lowerBack: "Lower back", armL: "Left arm", armR: "Right arm", legL: "Left leg", legR: "Right leg",
  } as Record<string, string>)[id] ?? id;
}

function painCol(p: number) {
  if (p <= 3) return "#7fb878";
  if (p <= 6) return "#f0b878";
  return "#e07a8a";
}
