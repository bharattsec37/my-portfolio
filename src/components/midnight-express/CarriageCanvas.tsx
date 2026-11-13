"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CarriageInterior from "./CarriageInterior";
import WindowLandscape from "./WindowLandscape";
import StationsWorld from "./StationsWorld";
import { StationProject } from "@/data/midnight-express-data";

export type PerformanceMode = "ultra" | "balanced" | "lite";

interface CarriageCanvasProps {
  progress: number; // 0.0 to 1.0
  speed: number; // 0 (stopped at station) to 1 (full speed)
  isEmergencyBraked: boolean;
  onPullEmergencyChain: () => void;
  onSelectProject: (proj: StationProject) => void;
  onOpenAboutModal: () => void;
  performanceMode?: PerformanceMode;
  isVisible?: boolean;
}

// ─── Camera Motion Rig (Vibration, Sway & Mouse Parallax) ─────────────────────

function CameraRig({
  speed,
  isEmergencyBraked,
  isVisible = true,
  performanceMode = "balanced",
}: {
  speed: number;
  isEmergencyBraked: boolean;
  isVisible?: boolean;
  performanceMode?: PerformanceMode;
}) {
  const mouse = useRef({ x: 0, y: 0 });
  const jerkOffset = useRef(0);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.25;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };
    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (isEmergencyBraked) {
      jerkOffset.current = 0.35; // sudden forward jerk
    }
  }, [isEmergencyBraked]);

  useFrame(({ camera, clock }) => {
    if (!isVisible) return;
    const t = clock.getElapsedTime();

    // Rhythmic train vibration proportional to speed & performance mode
    const vibrateY = performanceMode === "lite" ? 0 : Math.sin(t * 12) * 0.0025 * speed;
    const vibrateX = performanceMode === "lite" ? 0 : Math.cos(t * 8) * 0.0018 * speed;
    const swayZ = Math.sin(t * 3.5) * (performanceMode === "lite" ? 0.0025 : 0.005) * speed;

    // Decay emergency brake jerk smoothly
    jerkOffset.current *= 0.92;

    // Target camera position
    const targetX = (performanceMode === "lite" ? 0 : mouse.current.x) + vibrateX;
    const targetY = 0.28 - (performanceMode === "lite" ? 0 : mouse.current.y) + vibrateY;
    const targetZ = 2.45 - jerkOffset.current;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);

    camera.rotation.z = swayZ + jerkOffset.current * 0.05;
    camera.lookAt(0, 0.25, -2.5);
  });

  return null;
}

// ─── Main Carriage Canvas Component ──────────────────────────────────────────

export default function CarriageCanvas({
  progress,
  speed,
  isEmergencyBraked,
  onPullEmergencyChain,
  onSelectProject,
  onOpenAboutModal,
  performanceMode = "balanced",
  isVisible = true,
}: CarriageCanvasProps) {
  const [isHoveredChain, setIsHoveredChain] = useState(false);

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault();
    console.warn("[CarriageCanvas] WebGL context lost");
  }, []);

  const dprSetting: [number, number] | number =
    performanceMode === "ultra"
      ? [1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1.5)]
      : performanceMode === "balanced"
      ? [1, Math.min(1.5, typeof window !== "undefined" ? window.devicePixelRatio : 1.25)]
      : 1.0;

  return (
    <Canvas
      camera={{ position: [0, 0.28, 2.45], fov: 46 }}
      dpr={dprSetting}
      performance={{ min: 0.5 }}
      gl={{
        antialias: performanceMode !== "lite",
        alpha: false,
        powerPreference: performanceMode === "ultra" ? "high-performance" : "default",
        onContextLost: handleContextLost,
      } as Parameters<typeof Canvas>[0]["gl"]}
    >
      <color attach="background" args={["#030712"]} />

      {/* Atmospheric Cinematic Lighting */}
      <ambientLight intensity={0.55} color="#94a3b8" />
      {/* Cool Moonlight filling the window from outside */}
      <directionalLight position={[10, 6, -8]} intensity={1.8} color="#93c5fd" />
      {/* Warm Fill inside the carriage */}
      <pointLight position={[0, 1.2, 0.8]} intensity={1.2} color="#fde047" distance={4} />

      {/* Camera Rig with Rhythmic Motion & Parallax */}
      <CameraRig
        speed={speed}
        isEmergencyBraked={isEmergencyBraked}
        isVisible={isVisible}
        performanceMode={performanceMode}
      />

      {/* Multi-layer Parallax Landscape outside */}
      <WindowLandscape speed={speed} isVisible={isVisible} performanceMode={performanceMode} />

      {/* Passing Station Platforms */}
      <StationsWorld
        progress={progress}
        onSelectProject={onSelectProject}
        onOpenAboutModal={onOpenAboutModal}
      />

      {/* Wooden Carriage Interior & Window */}
      <CarriageInterior
        onPullEmergencyChain={onPullEmergencyChain}
        isHoveredChain={isHoveredChain}
        setIsHoveredChain={setIsHoveredChain}
        isVisible={isVisible}
        performanceMode={performanceMode}
      />
    </Canvas>
  );
}

