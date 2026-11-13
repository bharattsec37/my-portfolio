"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CarriageInteriorProps {
  onPullEmergencyChain: () => void;
  isHoveredChain: boolean;
  setIsHoveredChain: (v: boolean) => void;
}

// ─── Procedural Canvas Textures ───────────────────────────────────────────────

function makeRainGlassTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "rgba(10, 24, 45, 0.05)";
  ctx.fillRect(0, 0, 1024, 512);

  // Vertical rain run streaks
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 380;
    const len = 30 + Math.random() * 70;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, y + len);
    ctx.stroke();
  }

  // Water droplets with realistic light highlight
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 1.4 + Math.random() * 3.2;

    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.arc(x + 0.8, y + 0.8, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makeStickyNoteTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#fef08a";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 252, 252);

  ctx.font = "bold 26px sans-serif";
  ctx.fillStyle = "#1e293b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Pull me!", 128, 90);
  ctx.font = "italic bold 19px sans-serif";
  ctx.fillText("(There's a", 128, 138);
  ctx.fillText("surprise 😜)", 128, 172);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makeEmergencyPlaqueTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#b45309";
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 244, 116);

  ctx.fillStyle = "#fde047";
  ctx.fillRect(14, 14, 228, 100);

  ctx.fillStyle = "#78350f";
  [
    [18, 18],
    [238, 18],
    [18, 110],
    [238, 110],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.font = "900 20px monospace";
  ctx.fillStyle = "#78350f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("EMERGENCY", 128, 50);
  ctx.fillText("CHAIN", 128, 80);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makeJournalCoverTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#27140e";
  ctx.fillRect(0, 0, 256, 340);
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(10, 10, 236, 320);
  ctx.setLineDash([]);

  ctx.font = "900 52px serif";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#f59e0b";
  ctx.shadowBlur = 8;
  ctx.fillText("BP", 128, 160);
  ctx.shadowBlur = 0;

  ctx.font = "italic bold 13px serif";
  ctx.fillStyle = "#d97706";
  ctx.fillText("ENGINEER'S LOG", 128, 205);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ─── Shape Helper for Seamless Rounded-Beveled Window Frame ───────────────────

function createRoundedFrameShape(
  outerW: number,
  outerH: number,
  innerW: number,
  innerH: number,
  radius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const ox = outerW / 2;
  const oy = outerH / 2;
  const or = radius + 0.04;

  shape.moveTo(-ox + or, -oy);
  shape.lineTo(ox - or, -oy);
  shape.quadraticCurveTo(ox, -oy, ox, -oy + or);
  shape.lineTo(ox, oy - or);
  shape.quadraticCurveTo(ox, oy, ox - or, oy);
  shape.lineTo(-ox + or, oy);
  shape.quadraticCurveTo(-ox, oy, -ox, oy - or);
  shape.lineTo(-ox, -oy + or);
  shape.quadraticCurveTo(-ox, -oy, -ox + or, -oy);

  const hole = new THREE.Path();
  const ix = innerW / 2;
  const iy = innerH / 2;
  const ir = radius;

  hole.moveTo(-ix + ir, -iy);
  hole.lineTo(ix - ir, -iy);
  hole.quadraticCurveTo(ix, -iy, ix, -iy + ir);
  hole.lineTo(ix, iy - ir);
  hole.quadraticCurveTo(ix, iy, ix - ir, iy);
  hole.lineTo(-ix + ir, iy);
  hole.quadraticCurveTo(-ix, iy, -ix, iy - ir);
  hole.lineTo(-ix, -iy + ir);
  hole.quadraticCurveTo(-ix, -iy, -ix + ir, -iy);

  shape.holes.push(hole);
  return shape;
}

interface CarriageInteriorProps {
  onPullEmergencyChain: () => void;
  isHoveredChain: boolean;
  setIsHoveredChain: (v: boolean) => void;
  isVisible?: boolean;
  performanceMode?: "ultra" | "balanced" | "lite";
}

// ─── Foreground Table Props (Mug, Journal, Lantern) ───────────────────────────

function TableMug({ isVisible = true, performanceMode = "balanced" }: { isVisible?: boolean; performanceMode?: "ultra" | "balanced" | "lite" }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = performanceMode === "ultra" ? 28 : performanceMode === "balanced" ? 14 : 6;

  const [geo, initialOffsets] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.07;
      positions[i * 3 + 1] = Math.random() * 0.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.07;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return [g, offsets];
  }, [count]);

  useFrame(({ clock }) => {
    if (!isVisible || !pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + 0.0032;
      if (y > 0.42) {
        y = 0.02;
        pos.setX(i, (Math.random() - 0.5) * 0.06);
        pos.setZ(i, (Math.random() - 0.5) * 0.06);
      }
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 3 + initialOffsets[i]) * 0.0007);
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={[-0.85, -0.28, 1.35]}>
      {/* Round Cork Coaster */}
      <mesh position={[0, -0.015, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.016, 24]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>
      {/* Ceramic Coffee Mug */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.09, 0.075, 0.17, 24]} />
        <meshStandardMaterial color="#5c2c16" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Mug Handle */}
      <mesh position={[0.1, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.05, 0.014, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#5c2c16" roughness={0.4} />
      </mesh>
      {/* Coffee Liquid */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.082, 0.082, 0.02, 24]} />
        <meshStandardMaterial color="#2d170b" roughness={0.2} />
      </mesh>
      {/* Rising Steam */}
      <points ref={pointsRef} geometry={geo} position={[0, 0.16, 0]}>
        <pointsMaterial color="#fef3c7" size={0.038} transparent opacity={0.4} depthWrite={false} />
      </points>
    </group>
  );
}

function TableJournal() {
  const coverTex = useMemo(() => makeJournalCoverTexture(), []);

  return (
    <group position={[0.05, -0.36, 1.35]} rotation={[-Math.PI / 2 + 0.32, 0, -0.08]}>
      {/* Pages block */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[0.42, 0.58, 0.03]} />
        <meshStandardMaterial color="#fef9c3" roughness={0.8} />
      </mesh>
      {/* Gold Gilded Page Edges */}
      <mesh position={[0.212, 0, -0.015]}>
        <boxGeometry args={[0.005, 0.57, 0.028]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Leather Cover with BP Monogram */}
      {coverTex && (
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[0.43, 0.59]} />
          <meshStandardMaterial map={coverTex} roughness={0.6} metalness={0.15} />
        </mesh>
      )}

      {/* Gold-trimmed Fountain Pen resting beside notebook */}
      <group position={[0.28, 0, 0.02]} rotation={[0, 0, 0.08]}>
        <mesh>
          <cylinderGeometry args={[0.012, 0.012, 0.38, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.015, 12]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.205, 0]}>
          <coneGeometry args={[0.01, 0.03, 10]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

function TableHurricaneLantern({ isVisible = true }: { isVisible?: boolean }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!isVisible) return;
    const t = clock.getElapsedTime();
    const flicker = Math.sin(t * 14) * 0.08 + Math.cos(t * 23) * 0.05 + 1.0;
    if (flameRef.current) {
      flameRef.current.scale.y = 0.9 + flicker * 0.15;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 3.6 * flicker;
    }
  });

  return (
    <group position={[1.08, -0.28, 1.35]} scale={0.62}>
      {/* Heavy Brass Kerosene Tank Base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.08, 20]} />
        <meshStandardMaterial color="#b45309" metalness={0.88} roughness={0.25} />
      </mesh>
      {/* Wick Adjustment Knob */}
      <mesh position={[0.14, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.03, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} />
      </mesh>
      {/* Burner Collar */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.11, 0.04, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Glowing Mantle Flame Inside */}
      <mesh ref={flameRef} position={[0, 0.19, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      {/* Clear Glass Hurricane Chimney */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 0.26, 20, 1, true]} />
        <meshStandardMaterial
          color="#fef9c3"
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.25}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Top Ventilated Brass Hood Cap */}
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.1, 0.07, 0.06, 18]} />
        <meshStandardMaterial color="#b45309" metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.92} />
      </mesh>
      {/* Arched Wire Handle */}
      <mesh position={[0, 0.38, 0]}>
        <torusGeometry args={[0.15, 0.009, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#78350f" metalness={0.8} />
      </mesh>
      {/* Wire Cage Ribs */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.24, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.28, 6]} />
          <meshStandardMaterial color="#78350f" metalness={0.8} />
        </mesh>
      ))}

      {/* Warm Ambient Lantern Spotlight illuminating tabletop and frame */}
      <pointLight
        ref={lightRef}
        position={[0, 0.22, 0]}
        color="#fbbf24"
        intensity={3.6}
        distance={4.5}
      />
    </group>
  );
}

// ─── Right Wall: Interactive Emergency Chain & Sticky Note ─────────────────────

function EmergencyChainAndNote({
  onPull,
  isHovered,
  setIsHovered,
  isVisible = true,
}: {
  onPull: () => void;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  isVisible?: boolean;
}) {
  const chainRef = useRef<THREE.Group>(null);
  const plaqueTex = useMemo(() => makeEmergencyPlaqueTexture(), []);
  const noteTex = useMemo(() => makeStickyNoteTexture(), []);

  useFrame(({ clock }) => {
    if (!isVisible) return;
    if (chainRef.current) {
      chainRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 3.5) * 0.04;
    }
  });

  return (
    <group position={[1.72, 0.45, 0.2]}>
      {/* Brass Plaque "EMERGENCY CHAIN" */}
      {plaqueTex && (
        <mesh position={[0, 0.32, 0.02]}>
          <planeGeometry args={[0.38, 0.19]} />
          <meshStandardMaterial map={plaqueTex} metalness={0.6} roughness={0.3} />
        </mesh>
      )}

      {/* Brass Wall Bracket */}
      <mesh position={[0, 0.18, 0.02]}>
        <boxGeometry args={[0.08, 0.06, 0.06]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Red Chain & Pull Handle */}
      <group
        ref={chainRef}
        position={[0, 0.14, 0.04]}
        onClick={(e) => {
          e.stopPropagation();
          onPull();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, -i * 0.065 - 0.025, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.055, 8]} />
            <meshStandardMaterial
              color={isHovered ? "#ef4444" : "#dc2626"}
              emissive={isHovered ? "#b91c1c" : "#000000"}
              emissiveIntensity={isHovered ? 0.6 : 0}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Red Oval Pull Ring Handle */}
        <mesh position={[0, -0.38, 0]}>
          <torusGeometry args={[0.065, 0.016, 8, 20]} />
          <meshStandardMaterial
            color={isHovered ? "#f87171" : "#dc2626"}
            emissive={isHovered ? "#dc2626" : "#450a0a"}
            emissiveIntensity={isHovered ? 0.9 : 0.2}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* Sticky Yellow Post-It Note */}
      <group
        position={[0, -0.22, 0.02]}
        rotation={[0, 0, -0.04]}
        onClick={(e) => {
          e.stopPropagation();
          onPull();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        {noteTex && (
          <mesh scale={isHovered ? 1.05 : 1.0}>
            <planeGeometry args={[0.38, 0.38]} />
            <meshStandardMaterial map={noteTex} roughness={0.9} />
          </mesh>
        )}
        {/* Golden Push-pin */}
        <mesh position={[0, 0.16, 0.02]}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Master Carriage Interior Assembly ────────────────────────────────────────

export default function CarriageInterior({
  onPullEmergencyChain,
  isHoveredChain,
  setIsHoveredChain,
  isVisible = true,
  performanceMode = "balanced",
}: CarriageInteriorProps) {
  const rainGlassTex = useMemo(() => makeRainGlassTexture(), []);

  // 1. Seamless Rounded Brass Inner Window Frame Geometry
  const brassFrameGeo = useMemo(() => {
    const shape = createRoundedFrameShape(3.25, 1.58, 2.92, 1.28, 0.22);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    });
  }, []);

  // 2. Seamless Rounded Mahogany Outer Window Bevel Geometry
  const woodBevelGeo = useMemo(() => {
    const shape = createRoundedFrameShape(3.48, 1.82, 3.22, 1.56, 0.26);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });
  }, []);

  // 3. Spaced Golden Rivet Bolts around the brass frame
  const rivetPositions = useMemo(() => {
    const pos: [number, number][] = [];
    const hw = 1.48;
    const hh = 0.68;

    // Top & Bottom rows
    for (let x = -hw + 0.15; x <= hw - 0.15; x += 0.32) {
      pos.push([x, hh]);
      pos.push([x, -hh]);
    }
    // Left & Right sides
    for (let y = -hh + 0.2; y <= hh - 0.2; y += 0.28) {
      pos.push([-hw, y]);
      pos.push([hw, y]);
    }
    return pos;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ─── 1. Carriage Compartment Inset Walls Framing Window ─── */}
      {/* Top Ceiling Wall */}
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[4.8, 0.65, 0.3]} />
        <meshStandardMaterial color="#22120b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Left Wall Panel */}
      <mesh position={[-2.15, 0.38, 0]}>
        <boxGeometry args={[0.85, 1.9, 0.3]} />
        <meshStandardMaterial color="#22120b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Right Wall Panel */}
      <mesh position={[2.15, 0.38, 0]}>
        <boxGeometry args={[0.85, 1.9, 0.3]} />
        <meshStandardMaterial color="#22120b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* ─── 2. Seamless Rounded Outer Mahogany Wood Frame Bevel ─── */}
      <mesh geometry={woodBevelGeo} position={[0, 0.35, 0.04]}>
        <meshStandardMaterial color="#351a10" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* ─── 3. Seamless Rounded Inner Antique Brass Frame Bevel ─── */}
      <mesh geometry={brassFrameGeo} position={[0, 0.35, 0.09]}>
        <meshStandardMaterial
          color="#d97706"
          emissive="#78350f"
          emissiveIntensity={0.12}
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* ─── 4. Studded Golden Brass Rivet Bolts around the Window Frame ─── */}
      {rivetPositions.map(([x, y], i) => (
        <mesh key={i} position={[x, y + 0.35, 0.18]}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#fbbf24"
            emissiveIntensity={0.25}
            metalness={0.96}
            roughness={0.12}
          />
        </mesh>
      ))}

      {/* ─── 5. Crystal Window Glass with Rain Streaks & Water Droplets ─── */}
      {rainGlassTex && (
        <mesh position={[0, 0.35, 0.01]}>
          <planeGeometry args={[2.95, 1.3]} />
          <meshStandardMaterial
            map={rainGlassTex}
            color="#bae6fd"
            roughness={0.06}
            metalness={0.92}
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ─── 6. Left Corner: Gathered Crimson Velvet Curtain with Gold Tassel ─── */}
      <group position={[-1.68, 0.65, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.26, 1.4, 16]} />
          <meshStandardMaterial color="#881337" roughness={0.85} />
        </mesh>
        {/* Golden Tieback Cord */}
        <mesh position={[0.08, -0.15, 0.02]}>
          <torusGeometry args={[0.16, 0.02, 8, 18]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ─── 7. Left Corner: Cozy Upholstered Seat Cushion ─── */}
      <group position={[-1.75, -0.22, 0.65]}>
        <mesh>
          <boxGeometry args={[0.55, 0.55, 0.45]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.9} />
        </mesh>
      </group>

      {/* ─── 8. Foreground Wide Varnished Mahogany Tabletop with Brass Edge ─── */}
      <mesh position={[0, -0.42, 1.35]}>
        <boxGeometry args={[4.2, 0.12, 1.3]} />
        <meshStandardMaterial color="#33180e" roughness={0.35} metalness={0.22} />
      </mesh>
      {/* Front Polished Brass Tabletop Lip */}
      <mesh position={[0, -0.42, 1.99]}>
        <boxGeometry args={[4.2, 0.12, 0.02]} />
        <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* ─── 9. Tabletop Artifacts (Mug, Journal, Hurricane Lantern) ─── */}
      <TableMug isVisible={isVisible} performanceMode={performanceMode} />
      <TableJournal />
      <TableHurricaneLantern isVisible={isVisible} />

      {/* ─── 10. Right Wall: Emergency Chain & Sticky Note ─── */}
      <EmergencyChainAndNote
        onPull={onPullEmergencyChain}
        isHovered={isHoveredChain}
        setIsHovered={setIsHoveredChain}
        isVisible={isVisible}
      />
    </group>
  );
}
