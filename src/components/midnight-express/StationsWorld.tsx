"use client";

import React, { useMemo, useState } from "react";
import * as THREE from "three";
import { PROJECTS_DATA, SKILLS_CRATES, StationProject } from "@/data/midnight-express-data";

interface StationsWorldProps {
  progress: number;
  onSelectProject: (project: StationProject) => void;
  onOpenAboutModal: () => void;
}

// ─── High-Definition Canvas Texture Generators (Cached) ──────────────────────

const signCache = new Map<string, THREE.CanvasTexture>();
const posterCache = new Map<string, THREE.CanvasTexture>();
const crateCache = new Map<string, THREE.CanvasTexture>();
let aboutBoardCache: THREE.CanvasTexture | null = null;

function makeStationSignTexture(
  title: string,
  stnBadge: string,
  code: string
): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const cacheKey = `${title}__${stnBadge}__${code}`;
  if (signCache.has(cacheKey)) {
    return signCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 560;
  canvas.height = 150;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Dark curved retro casing
  ctx.fillStyle = "#0c101d";
  ctx.fillRect(0, 0, 560, 150);
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 548, 138);

  // Top Station Number Badge (e.g. "STATION 1/4")
  ctx.fillStyle = "rgba(251, 191, 36, 0.2)";
  ctx.fillRect(190, 14, 180, 26);
  ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(190, 14, 180, 26);

  ctx.font = "900 13px monospace";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(stnBadge.toUpperCase(), 280, 27);

  // Train Icon + Station Title in warm glowing neon
  ctx.font = "900 32px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 10;
  ctx.fillText(`🚆  ${title}`, 280, 76);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.font = "bold 13px monospace";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(code, 280, 116);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  signCache.set(cacheKey, texture);
  return texture;
}

// ─── Station Overhead Canopy & Iron Truss Framework ───────────────────────────

function StationRoofCanopy({ width = 24 }: { width?: number }) {
  return (
    <group position={[0, 3.4, -0.6]}>
      {/* Roof Canopy Overhang */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, 0.12, 3.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Front Fascia Beam */}
      <mesh position={[0, -0.1, 1.65]}>
        <boxGeometry args={[width, 0.2, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Overhead Iron Arch Trusses */}
      {[-width * 0.35, -width * 0.12, width * 0.12, width * 0.35].map((x, i) => (
        <group key={i} position={[x, -0.4, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.8, 3.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Hanging Vintage Industrial Pendant Lamp */}
          <group position={[0, -0.55, 0.5]}>
            {/* Lamp Cord */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.6, 6]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Umbrella Shade */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.24, 0.12, 16]} />
              <meshStandardMaterial color="#b45309" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Glowing Filament Bulb */}
            <mesh position={[0, -0.06, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            {/* Warm Platform Spotlight */}
            <pointLight position={[0, -0.1, 0]} color="#fde047" intensity={2.6} distance={4.5} />
          </group>
        </group>
      ))}
    </group>
  );
}

// ─── Platform Street Furniture (Bench, Luggage, Plants) ───────────────────────

function PlatformProps({ nextStop }: { nextStop?: string }) {
  const nextStopTex = useMemo(() => {
    if (!nextStop || typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 300, 100);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 292, 92);
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("NEXT STOP", 20, 35);
    ctx.font = "900 18px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`➔ ${nextStop}`, 20, 68);
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    return t;
  }, [nextStop]);

  return (
    <group>
      {/* Wooden Park Bench */}
      <group position={[-5.4, 0.2, 0.4]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.3, 0.05, 0.35]} />
          <meshStandardMaterial color="#5c3821" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.4, -0.15]}>
          <boxGeometry args={[1.3, 0.35, 0.04]} />
          <meshStandardMaterial color="#5c3821" roughness={0.8} />
        </mesh>
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.1, 0]}>
            <boxGeometry args={[0.06, 0.2, 0.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Terracotta Planter with Green Foliage */}
      <group position={[-7.2, 0.2, 0.4]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.4, 16]} />
          <meshStandardMaterial color="#c2410c" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 10, 10]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>
      </group>

      {/* Stacked Vintage Leather Suitcases */}
      <group position={[7.2, 0.2, 0.4]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        <mesh position={[0.05, 0.38, 0]}>
          <boxGeometry args={[0.5, 0.22, 0.35]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
      </group>

      {/* Next Stop Indicator Sign */}
      {nextStopTex && (
        <group position={[8.8, 1.3, 0.2]}>
          <mesh>
            <planeGeometry args={[1.6, 0.55]} />
            <meshBasicMaterial map={nextStopTex} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.0, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function makeProjectPosterTexture(
  title: string,
  category: string,
  tech: string,
  status: "Deployed" | "Prototype" | "Winner"
): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const cacheKey = `${title}__${status}__${category}`;
  if (posterCache.has(cacheKey)) {
    return posterCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 440;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background
  ctx.fillStyle = "#070b14";
  ctx.fillRect(0, 0, 440, 540);
  ctx.strokeStyle = status === "Deployed" ? "#22c55e" : status === "Winner" ? "#fbbf24" : "#38bdf8";
  ctx.lineWidth = 7;
  ctx.strokeRect(8, 8, 424, 524);

  // Status Top Badge
  ctx.fillStyle = status === "Deployed" ? "#15803d" : status === "Winner" ? "#b45309" : "#0284c7";
  ctx.fillRect(24, 24, 392, 42);
  ctx.font = "900 17px monospace";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const badgeLabel = status === "Deployed" ? "🟢 DEPLOYED · LIVE APP" : status === "Winner" ? "🏆 HACKATHON WINNER" : "⚡ PROTOTYPE BUILD";
  ctx.fillText(badgeLabel, 220, 45);

  // Category
  ctx.font = "bold 15px monospace";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(category.toUpperCase(), 220, 100);

  // Title (Fit text properly)
  ctx.font = "900 30px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 220, 150);

  // Divider Line
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.moveTo(35, 195);
  ctx.lineTo(405, 195);
  ctx.stroke();

  // Tech stack
  ctx.font = "bold 15px monospace";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("TECH STACK", 220, 230);

  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText(tech, 220, 268);

  // Clickable Action Button at bottom
  ctx.fillStyle = status === "Deployed" ? "#16a34a" : "#2563eb";
  ctx.fillRect(36, 420, 368, 64);
  ctx.font = "900 19px sans-serif";
  ctx.fillStyle = "#ffffff";
  const btnLabel = status === "Deployed" ? "VISIT LIVE DEMO ↗" : "EXPLORE PROJECT ↗";
  ctx.fillText(btnLabel, 220, 452);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  posterCache.set(cacheKey, texture);
  return texture;
}

function makeCrateLabelTexture(category: string, skills: string[]): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const cacheKey = `${category}__${skills.join(",")}`;
  if (crateCache.has(cacheKey)) {
    return crateCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 440;
  canvas.height = 260;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Dark weathered timber stencil
  ctx.fillStyle = "#1c1109";
  ctx.fillRect(0, 0, 440, 260);

  // Stenciled border
  ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 420, 240);

  // Stenciled category header
  ctx.fillStyle = "rgba(251, 191, 36, 0.15)";
  ctx.fillRect(20, 20, 400, 45);
  ctx.font = "900 19px monospace";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`★  ${category.toUpperCase()}  ★`, 220, 42);

  // Skills list
  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#f8fafc";
  skills.slice(0, 4).forEach((s, idx) => {
    ctx.fillText(`• ${s}`, 220, 96 + idx * 36);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  crateCache.set(cacheKey, texture);
  return texture;
}

function makeAboutBoardTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  if (aboutBoardCache) {
    return aboutBoardCache;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background
  ctx.fillStyle = "#070b14";
  ctx.fillRect(0, 0, 512, 360);
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 344);

  // Top Badge
  ctx.fillStyle = "rgba(251, 191, 36, 0.2)";
  ctx.fillRect(24, 20, 464, 38);
  ctx.font = "900 16px monospace";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("★ THE BUILDER'S FIELD DOSSIER ★", 256, 38);

  // Name
  ctx.font = "900 34px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("BHARAT PATEL", 256, 88);

  // Subtitle Motto
  ctx.font = "italic 16px sans-serif";
  ctx.fillStyle = "#fde047";
  ctx.fillText("“Learn by Building. Compete by Innovating.”", 256, 126);

  // Line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.beginPath();
  ctx.moveTo(30, 150);
  ctx.lineTo(482, 150);
  ctx.stroke();

  // Bullet items
  ctx.font = "bold 16.5px sans-serif";
  ctx.fillStyle = "#e2e8f0";
  ctx.textAlign = "left";
  ctx.fillText("🎓  B.E. Electronics & Computer Eng. · TSEC (2028)", 36, 182);
  ctx.fillText("🏆  Hack-It-Out 2.0 & DevSprint Winner", 36, 218);
  ctx.fillText("🚀  TSEC Cultural Committee Web & Content Head", 36, 254);

  // Click CTA Button
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(36, 285, 440, 50);
  ctx.font = "900 18px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("CLICK TO INSPECT BIO & RESUME ↗", 256, 310);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  aboutBoardCache = texture;
  return texture;
}

// ─── Station 1: Projects Junction (Interactive Clickable Posters) ─────────────

function StationProjects({
  offsetX,
  onSelectProject,
}: {
  offsetX: number;
  onSelectProject: (proj: StationProject) => void;
}) {
  const signTex = useMemo(
    () => makeStationSignTexture("Projects Junction", "STATION 1/4", "STN 01 · KM 14"),
    []
  );
  const [hoveredProjId, setHoveredProjId] = useState<string | null>(null);

  return (
    <group position={[offsetX, -0.6, -3.4]}>
      {/* Overhead Iron Truss Roof Canopy with Hanging Warm Pendant Lamps */}
      <StationRoofCanopy width={24} />

      {/* Platform Street Furniture (Bench, Luggage, Plants, Next Stop Sign) */}
      <PlatformProps nextStop="Skills Central" />

      {/* Brick Platform Deck */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[22, 0.4, 2.5]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      {/* Yellow Safety Platform Edge Strip */}
      <mesh position={[0, 0.21, 1.15]}>
        <boxGeometry args={[22, 0.02, 0.18]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </mesh>

      {/* Main Overhead Station Nameboard */}
      {signTex && (
        <group position={[0, 2.45, -0.8]}>
          <mesh>
            <planeGeometry args={[3.4, 0.92]} />
            <meshBasicMaterial map={signTex} />
          </mesh>
          <mesh position={[-1.5, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.5, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}

      {/* Lit Clickable Project Display Posters */}
      {PROJECTS_DATA.slice(0, 5).map((proj, idx) => {
        const xPos = (idx - 2) * 3.4;
        const posterTex = makeProjectPosterTexture(
          proj.title,
          proj.category,
          proj.technologies.slice(0, 3).join(" · "),
          proj.status
        );
        const isHovered = hoveredProjId === proj.id;

        return (
          <group
            key={proj.id}
            position={[xPos, 1.15, -0.5]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(proj);
            }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setHoveredProjId(proj.id);
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              setHoveredProjId(null);
              document.body.style.cursor = "default";
            }}
          >
            {/* Poster Backing Board with Interactive Hover Glow */}
            <mesh scale={isHovered ? 1.05 : 1.0}>
              <boxGeometry args={[1.7, 2.1, 0.08]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive={isHovered ? "#38bdf8" : "#000000"}
                emissiveIntensity={isHovered ? 0.6 : 0}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {posterTex && (
              <mesh position={[0, 0, 0.05]} scale={isHovered ? 1.05 : 1.0}>
                <planeGeometry args={[1.6, 2.0]} />
                <meshBasicMaterial map={posterTex} />
              </mesh>
            )}

            {/* Top Spotlight */}
            <pointLight position={[0, 1.2, 0.4]} color="#fef08a" intensity={2.2} distance={3.0} />
          </group>
        );
      })}

      {/* Platform Lamp Posts */}
      {[-9, -3, 3, 9].map((x, i) => (
        <group key={i} position={[x, 0.2, 0.8]}>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.035, 0.05, 2.6, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <pointLight position={[0, 2.6, 0]} color="#fde047" intensity={2.8} distance={5.0} />
        </group>
      ))}
    </group>
  );
}

// ─── Station 2: Skills Central ────────────────────────────────────────────────

function StationSkills({ offsetX }: { offsetX: number }) {
  const signTex = useMemo(
    () => makeStationSignTexture("Skills Central", "STATION 2/4", "STN 02 · KM 28"),
    []
  );

  return (
    <group position={[offsetX, -0.6, -3.4]}>
      {/* Overhead Iron Roof Canopy */}
      <StationRoofCanopy width={20} />

      {/* Platform Street Furniture */}
      <PlatformProps nextStop="About Town" />

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[18, 0.4, 2.5]} />
        <meshStandardMaterial color="#3d2c1d" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.21, 1.15]}>
        <boxGeometry args={[18, 0.02, 0.18]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </mesh>

      {signTex && (
        <group position={[0, 2.45, -0.8]}>
          <mesh>
            <planeGeometry args={[3.4, 0.92]} />
            <meshBasicMaterial map={signTex} />
          </mesh>
          <mesh position={[-1.5, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.5, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}

      {/* Stacked Cargo Crates with High-Resolution Stencils */}
      {SKILLS_CRATES.map((crate, idx) => {
        const xPos = (idx - 1.5) * 3.4;
        const labelTex = makeCrateLabelTexture(crate.category, crate.skills);
        return (
          <group key={crate.category} position={[xPos, 0.2, -0.4]}>
            <mesh position={[0, crate.crateSize[1] / 2, 0]}>
              <boxGeometry args={crate.crateSize} />
              <meshStandardMaterial color="#6b4126" roughness={0.75} />
            </mesh>
            {labelTex && (
              <mesh position={[0, crate.crateSize[1] / 2, crate.crateSize[2] / 2 + 0.02]}>
                <planeGeometry args={[crate.crateSize[0] * 0.9, crate.crateSize[1] * 0.78]} />
                <meshBasicMaterial map={labelTex} />
              </mesh>
            )}
            <mesh position={[0.2, crate.crateSize[1] + 0.35, 0]}>
              <boxGeometry args={[0.9, 0.7, 0.8]} />
              <meshStandardMaterial color="#4a2c19" roughness={0.8} />
            </mesh>
          </group>
        );
      })}

      {[-8, -2, 2, 8].map((x, i) => (
        <group key={i} position={[x, 0.2, 0.8]}>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.035, 0.05, 2.6, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <pointLight position={[0, 2.6, 0]} color="#fde047" intensity={2.8} distance={5.0} />
        </group>
      ))}
    </group>
  );
}

// ─── Station 3: About Town (Cottage + Clickable Inspection Board) ─────────────

function StationAbout({
  offsetX,
  onOpenAboutModal,
}: {
  offsetX: number;
  onOpenAboutModal: () => void;
}) {
  const signTex = useMemo(
    () => makeStationSignTexture("About Town", "STATION 3/4", "STN 03 · KM 42"),
    []
  );
  const aboutBoardTex = useMemo(() => makeAboutBoardTexture(), []);
  const [isHoveredBoard, setIsHoveredBoard] = useState(false);

  return (
    <group position={[offsetX, -0.6, -3.4]}>
      {/* Overhead Iron Roof Canopy */}
      <StationRoofCanopy width={22} />

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[18, 0.4, 2.5]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.21, 1.15]}>
        <boxGeometry args={[18, 0.02, 0.18]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </mesh>

      {signTex && (
        <group position={[-5.2, 2.45, -0.8]}>
          <mesh>
            <planeGeometry args={[3.4, 0.92]} />
            <meshBasicMaterial map={signTex} />
          </mesh>
          <mesh position={[-1.5, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.5, -0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}

      {/* ─── Golden Victory Trophy on Pedestal (Left side of platform) ─── */}
      <group position={[-5.0, 0.2, 0.2]}>
        {/* Stepped Pedestal */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.7, 0.6, 0.7]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Trophy Cup */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.35, 0.15, 0.6, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.32, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.15, 0.03, 6, 16, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
        <mesh position={[0.32, 1.0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.15, 0.03, 6, 16, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
        {/* Floating Star */}
        <mesh position={[0, 1.45, 0]}>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
        </mesh>
        {/* Spotlight on Trophy */}
        <pointLight position={[0, 1.6, 0.4]} color="#fbbf24" intensity={2.0} distance={3.0} />
      </group>

      {/* ─── Grand Clickable Builder Field Dossier Board on Platform ─── */}
      <group
        position={[-1.1, 1.25, -0.35]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenAboutModal();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHoveredBoard(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setIsHoveredBoard(false);
          document.body.style.cursor = "default";
        }}
      >
        <mesh scale={isHoveredBoard ? 1.05 : 1.0}>
          <boxGeometry args={[3.2, 2.2, 0.1]} />
          <meshStandardMaterial
            color="#070b14"
            emissive={isHoveredBoard ? "#fbbf24" : "#000000"}
            emissiveIntensity={isHoveredBoard ? 0.6 : 0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {aboutBoardTex && (
          <mesh position={[0, 0, 0.06]} scale={isHoveredBoard ? 1.05 : 1.0}>
            <planeGeometry args={[3.1, 2.1]} />
            <meshBasicMaterial map={aboutBoardTex} />
          </mesh>
        )}

        {/* Spotlights Illuminating the Dossier */}
        <pointLight position={[-1.0, 1.2, 0.5]} color="#fef08a" intensity={2.5} distance={3.5} />
        <pointLight position={[1.0, 1.2, 0.5]} color="#fef08a" intensity={2.5} distance={3.5} />
      </group>

      {/* ─── Platform Wooden Bench ─── */}
      <group position={[1.0, 0.2, 0.4]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.35]} />
          <meshStandardMaterial color="#5c3821" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.4, -0.15]}>
          <boxGeometry args={[1.2, 0.35, 0.04]} />
          <meshStandardMaterial color="#5c3821" roughness={0.8} />
        </mesh>
        {/* Legs */}
        {[-0.5, 0.5].map((x) => (
          <mesh key={x} position={[x, 0.1, 0]}>
            <boxGeometry args={[0.06, 0.2, 0.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ─── Lit-Up Stationmaster Cottage with Waving Silhouette ─── */}
      <group position={[3.6, 0.2, -1.2]}>
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[4.4, 2.6, 2.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.9, 0]}>
          <coneGeometry args={[3.4, 1.2, 4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        {/* Chimney */}
        <mesh position={[-1.4, 3.2, 0]}>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.9} />
        </mesh>

        {/* Windows with Window Grilles */}
        <mesh position={[-1.1, 1.3, 1.22]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[-1.1, 1.3, 1.23]}>
          <boxGeometry args={[1.12, 0.04, 0.02]} />
          <meshBasicMaterial color="#451a03" />
        </mesh>
        <mesh position={[-1.1, 1.3, 1.23]}>
          <boxGeometry args={[0.04, 1.12, 0.02]} />
          <meshBasicMaterial color="#451a03" />
        </mesh>

        <mesh position={[1.1, 1.3, 1.22]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[1.1, 1.3, 1.23]}>
          <boxGeometry args={[1.12, 0.04, 0.02]} />
          <meshBasicMaterial color="#451a03" />
        </mesh>
        <mesh position={[1.1, 1.3, 1.23]}>
          <boxGeometry args={[0.04, 1.12, 0.02]} />
          <meshBasicMaterial color="#451a03" />
        </mesh>

        <mesh position={[0, 0.9, 1.22]}>
          <planeGeometry args={[0.85, 1.8]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>

        {/* Waving Silhouette of Bharat */}
        <group position={[0, 0.9, 1.45]}>
          <mesh position={[0, 0.58, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.15, 0.17, 0.58, 8]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
          <mesh position={[0.24, 0.38, 0]} rotation={[0, 0, -0.6]}>
            <cylinderGeometry args={[0.04, 0.04, 0.38, 6]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
        </group>

        <pointLight position={[0, 2.2, 1.6]} color="#fde047" intensity={3.8} distance={5.5} />
      </group>

      {[-8, -2, 8].map((x, i) => (
        <group key={i} position={[x, 0.2, 0.8]}>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.035, 0.05, 2.6, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <pointLight position={[0, 2.6, 0]} color="#fde047" intensity={2.8} distance={5.0} />
        </group>
      ))}
    </group>
  );
}

// ─── Station 4: Terminus: Contact ─────────────────────────────────────────────

function StationTerminus({ offsetX }: { offsetX: number }) {
  const signTex = useMemo(
    () => makeStationSignTexture("Terminus: Contact", "STATION 4/4", "TERMINUS · KM 56"),
    []
  );

  return (
    <group position={[offsetX, -0.6, -3.4]}>
      {/* Overhead Iron Roof Canopy */}
      <StationRoofCanopy width={22} />

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[20, 0.4, 2.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.21, 1.3]}>
        <boxGeometry args={[20, 0.02, 0.2]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </mesh>

      {signTex && (
        <group position={[0, 2.65, -0.8]}>
          <mesh>
            <planeGeometry args={[4.0, 1.05]} />
            <meshBasicMaterial map={signTex} />
          </mesh>
          <mesh position={[-1.8, -0.9, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.8, -0.9, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}

      {/* Terminal Archway Pillars */}
      {[-7, -2.5, 2.5, 7].map((x, i) => (
        <group key={i} position={[x, 0.2, -0.8]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 3.0, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 3.1, 0]}>
            <boxGeometry args={[0.6, 0.3, 0.6]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Station Clock */}
      <group position={[0, 3.5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.12, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <circleGeometry args={[0.38, 24]} />
          <meshBasicMaterial color="#fef9c3" />
        </mesh>
        <mesh position={[0, 0.08, 0.08]}>
          <boxGeometry args={[0.03, 0.2, 0.01]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
        <mesh position={[0.07, 0, 0.08]} rotation={[0, 0, -Math.PI / 3]}>
          <boxGeometry args={[0.025, 0.24, 0.01]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {[-9, -3.5, 3.5, 9].map((x, i) => (
        <group key={i} position={[x, 0.2, 1.0]}>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 2.6, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <pointLight position={[0, 2.6, 0]} color="#fde047" intensity={2.8} distance={5.0} />
        </group>
      ))}
    </group>
  );
}

// ─── Composite Stations World ─────────────────────────────────────────────────

export default function StationsWorld({
  progress,
  onSelectProject,
  onOpenAboutModal,
}: StationsWorldProps) {
  const stn1X = (0.20 - progress) * 60;
  const stn2X = (0.45 - progress) * 60;
  const stn3X = (0.70 - progress) * 60;
  const stn4X = (1.00 - progress) * 60;

  return (
    <group>
      {Math.abs(stn1X) < 24 && (
        <StationProjects offsetX={stn1X} onSelectProject={onSelectProject} />
      )}
      {Math.abs(stn2X) < 24 && <StationSkills offsetX={stn2X} />}
      {Math.abs(stn3X) < 24 && (
        <StationAbout offsetX={stn3X} onOpenAboutModal={onOpenAboutModal} />
      )}
      {Math.abs(stn4X) < 24 && <StationTerminus offsetX={stn4X} />}
    </group>
  );
}
