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

// Region positions in 3D space — feminine standing figure with visible
// reproductive anatomy (uterus, ovaries, fallopian tubes) inside the pelvis.
const REGION_POSITIONS: Record<string, [number, number, number]> = {
  head: [0, 2.45, 0],
  chest: [0, 1.35, 0.32],
  abdomen: [0, 0.35, 0.3],
  uterus: [0, -0.35, 0.35],
  ovaryL: [-0.32, -0.3, 0.32],
  ovaryR: [0.32, -0.3, 0.32],
  pelvis: [0, -0.7, 0.25],
  lowerBack: [0, 0.35, -0.32],
  armL: [-1.1, 1.05, 0],
  armR: [1.1, 1.05, 0],
  legL: [-0.32, -1.7, 0],
  legR: [0.32, -1.7, 0],
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.95} castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.45} color="#f8c8dc" />
      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.22}>
          <FemaleBody onSelect={onSelect} selected={selected} markers={markers} />
        </Float>
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3.5} maxDistance={9} />
    </Canvas>
  );
}

function FemaleBody({ onSelect, selected, markers }: Props) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.05;
  });

  // Translucent skin material so reproductive organs glow softly through the pelvis
  const skin = (
    <meshPhysicalMaterial
      color="#f4d8c8"
      roughness={0.45}
      transmission={0.18}
      thickness={0.6}
      clearcoat={0.3}
      clearcoatRoughness={0.55}
      attenuationColor="#f6c7b6"
      attenuationDistance={1.2}
    />
  );

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Head */}
      <mesh position={REGION_POSITIONS.head} castShadow>
        <sphereGeometry args={[0.5, 48, 48]} />
        {skin}
      </mesh>
      {/* Hair cap — soft bun */}
      <mesh position={[0, 2.75, -0.1]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#3a2a25" roughness={0.7} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.3, 24]} />
        {skin}
      </mesh>

      {/* Bust / chest — feminine silhouette */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.62, 32, 32]} />
        {skin}
      </mesh>
      {/* Subtle bust definition */}
      <mesh position={[-0.22, 1.25, 0.42]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        {skin}
      </mesh>
      <mesh position={[0.22, 1.25, 0.42]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        {skin}
      </mesh>

      {/* Waist (narrower) */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        {skin}
      </mesh>

      {/* Abdomen */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        {skin}
      </mesh>

      {/* Hips — wider, feminine */}
      <mesh position={[0, -0.45, 0]} castShadow scale={[1.25, 0.9, 1]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        {skin}
      </mesh>

      {/* ===== Reproductive anatomy (visible through translucent skin) ===== */}
      {/* Uterus — pear shape using a slightly squashed sphere + cervix cylinder */}
      <group position={[0, -0.35, 0.18]}>
        <mesh scale={[1, 1.15, 0.9]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial
            color="#e87a8e"
            emissive="#c84a64"
            emissiveIntensity={0.35}
            roughness={0.45}
          />
        </mesh>
        {/* cervix */}
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.1, 16]} />
          <meshStandardMaterial color="#c46078" roughness={0.5} />
        </mesh>
        {/* Fallopian tubes — curved torus segments */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.08, 0.12, 0]} rotation={[0, 0, s * Math.PI * 0.5]}>
            <mesh>
              <torusGeometry args={[0.13, 0.018, 12, 32, Math.PI * 0.7]} />
              <meshStandardMaterial color="#e89aa8" roughness={0.5} />
            </mesh>
          </group>
        ))}
        {/* Ovaries — small almond shapes */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.26, 0.05, 0]} scale={[1, 0.7, 0.7]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial
              color="#f0b890"
              emissive="#d68a60"
              emissiveIntensity={0.3}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Arms (slimmer) */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.78, 1.3, 0]} rotation={[0, 0, s * 0.18]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.13, 1.45, 12, 16]} />
            {skin}
          </mesh>
        </group>
      ))}

      {/* Legs (longer, slimmer) */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.26, -1.55, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.18, 1.6, 12, 16]} />
            {skin}
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

      {/* Pulsing pointer ring on the selected region */}
      {selected && REGION_POSITIONS[selected] && (
        <Pointer position={REGION_POSITIONS[selected]} />
      )}

      {/* Markers */}
      {markers.map((m) => {
        const pos = REGION_POSITIONS[m.region] ?? REGION_POSITIONS.abdomen;
        return (
          <mesh key={m.id} position={[pos[0] * 1.05, pos[1], pos[2] + 0.45]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={painCol(m.pain)}
              emissive={painCol(m.pain)}
              emissiveIntensity={0.7}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Pointer({ position }: { position: [number, number, number] }) {
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s1 = 1 + Math.sin(t * 3) * 0.15;
    const s2 = 1.3 + Math.sin(t * 3 + 1) * 0.2;
    if (ring.current) ring.current.scale.set(s1, s1, s1);
    if (ring2.current) {
      ring2.current.scale.set(s2, s2, s2);
      (ring2.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 - Math.sin(t * 3 + 1) * 0.25;
    }
  });
  return (
    <group position={[position[0], position[1], position[2] + 0.55]}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.02, 12, 48]} />
        <meshStandardMaterial color="#e07a8a" emissive="#e07a8a" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.012, 12, 48]} />
        <meshBasicMaterial color="#e07a8a" transparent opacity={0.4} toneMapped={false} />
      </mesh>
      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#e07a8a" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
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
          opacity={hover || selected ? 0.32 : 0}
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
  if (id === "head") return 0.55;
  if (id.startsWith("arm")) return 0.32;
  if (id.startsWith("leg")) return 0.38;
  if (id === "lowerBack") return 0.5;
  if (id === "uterus") return 0.18;
  if (id.startsWith("ovary")) return 0.12;
  if (id === "pelvis") return 0.5;
  return 0.5;
}

function labelFor(id: string) {
  return ({
    head: "Head",
    chest: "Chest",
    abdomen: "Abdomen",
    uterus: "Uterus",
    ovaryL: "Left ovary",
    ovaryR: "Right ovary",
    pelvis: "Pelvis",
    lowerBack: "Lower back",
    armL: "Left arm",
    armR: "Right arm",
    legL: "Left leg",
    legR: "Right leg",
  } as Record<string, string>)[id] ?? id;
}

function painCol(p: number) {
  if (p <= 3) return "#7fb878";
  if (p <= 6) return "#f0b878";
  return "#e07a8a";
}
