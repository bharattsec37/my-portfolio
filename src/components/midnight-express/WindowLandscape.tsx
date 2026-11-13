"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WindowLandscapeProps {
  speed: number; // 0 (stopped at station) to 1 (full express cruise)
  isVisible?: boolean;
  performanceMode?: "ultra" | "balanced" | "lite";
}

export default function WindowLandscape({
  speed,
  isVisible = true,
  performanceMode = "balanced",
}: WindowLandscapeProps) {
  const polesGroupRef = useRef<THREE.Group>(null);
  const midHillsRef = useRef<THREE.Group>(null);
  const treesRef = useRef<THREE.Group>(null);
  const fogRef = useRef<THREE.Group>(null);
  const firefliesRef = useRef<THREE.Points>(null);
  const rainRef = useRef<THREE.Points>(null);

  // Dynamic particle count depending on performance mode
  const rainCount = performanceMode === "ultra" ? 120 : performanceMode === "balanced" ? 60 : 25;
  const fireflyCount = performanceMode === "ultra" ? 40 : performanceMode === "balanced" ? 20 : 8;

  // Telegraph poles count and spacing
  const POLE_COUNT = 8;
  const POLE_SPACING = 6;
  const POLE_TOTAL_SPAN = POLE_COUNT * POLE_SPACING;

  // Midground trees count and positions
  const TREE_COUNT = 16;
  const TREE_SPACING = 4;
  const TREE_TOTAL_SPAN = TREE_COUNT * TREE_SPACING;

  // Passing Rain Streaks Buffer
  const [rainGeo] = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 6 - 1;
      pos[i * 3 + 2] = -Math.random() * 8 - 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return [g];
  }, [rainCount]);

  // Generate distant mountain points
  const mountains = useMemo(() => {
    return [
      { x: -35, y: 1.8, r: 12, h: 6 },
      { x: -18, y: 2.4, r: 16, h: 8 },
      { x: 0, y: 2.8, r: 18, h: 9 },
      { x: 18, y: 2.2, r: 15, h: 7 },
      { x: 35, y: 1.6, r: 13, h: 6 },
    ];
  }, []);

  // Fireflies particle buffer
  const [fireflyGeo] = useMemo(() => {
    const pos = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 2.2 - 0.2;
      pos[i * 3 + 2] = -Math.random() * 6 - 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return [g];
  }, [fireflyCount]);

  useFrame((_, delta) => {
    if (!isVisible) return;
    const currentSpeed = speed;

    // 1. Move poles from right to left (+X to -X)
    if (polesGroupRef.current) {
      polesGroupRef.current.children.forEach((child) => {
        child.position.x -= delta * 14 * currentSpeed;
        if (child.position.x < -POLE_TOTAL_SPAN / 2) {
          child.position.x += POLE_TOTAL_SPAN;
        }
      });
    }

    // 2. Move midground trees
    if (treesRef.current) {
      treesRef.current.children.forEach((child) => {
        child.position.x -= delta * 8 * currentSpeed;
        if (child.position.x < -TREE_TOTAL_SPAN / 2) {
          child.position.x += TREE_TOTAL_SPAN;
        }
      });
    }

    // 3. Move distant hills slowly
    if (midHillsRef.current) {
      midHillsRef.current.children.forEach((child) => {
        child.position.x -= delta * 2.2 * currentSpeed;
        if (child.position.x < -40) {
          child.position.x += 80;
        }
      });
    }

    // 4. Subtle fog drift
    if (fogRef.current) {
      fogRef.current.position.x -= delta * 1.5 * (currentSpeed + 0.2);
      if (fogRef.current.position.x < -20) {
        fogRef.current.position.x = 20;
      }
    }

    // 5. Fireflies bobbing
    if (firefliesRef.current) {
      const pos = firefliesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < fireflyCount; i++) {
        let x = pos.getX(i) - delta * (currentSpeed * 4 + 0.3);
        if (x < -8) x = 8;
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }

    // 6. Passing Rain Falling Particles
    if (rainRef.current) {
      const pos = rainRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < rainCount; i++) {
        let y = pos.getY(i) - delta * 9;
        let x = pos.getX(i) - delta * (currentSpeed * 5 + 1.2);
        if (y < -1.5) y = 4.5;
        if (x < -7) x = 7;
        pos.setY(i, y);
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ─── Layer 0: Night Sky Backdrop (Z: -30) ─── */}
      <mesh position={[0, 0, -30]}>
        <planeGeometry args={[100, 40]} />
        <meshBasicMaterial color="#030712" />
      </mesh>

      {/* Glowing Full Night Moon with Ambient Halo (Upper Right of Window) */}
      <group position={[3.6, 2.2, -18]}>
        <mesh>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshBasicMaterial color="#fef9c3" />
        </mesh>
        {/* Soft Moon Glow Halo */}
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[1.3, 3.2, 32]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
        {/* Cool moonlight cast from the moon */}
        <pointLight position={[0, 0, 1]} color="#bae6fd" intensity={2.0} distance={15} />
      </group>

      {/* ─── Layer 1: Distant Mountains (Z: -24) ─── */}
      <group ref={midHillsRef}>
        {mountains.map((m, idx) => (
          <mesh key={idx} position={[m.x, m.y - 1.5, -24]}>
            <coneGeometry args={[m.r, m.h, 6]} />
            <meshStandardMaterial color="#090d16" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* ─── Layer 2: Midground Rolling Horizon & Distant Village Glow (Z: -16) ─── */}
      <mesh position={[0, -0.6, -16]}>
        <planeGeometry args={[90, 4]} />
        <meshStandardMaterial color="#0b1329" roughness={0.9} />
      </mesh>

      {/* Distant Town Window Lantern Lights */}
      {[-18, -12, -4, 6, 14, 22].map((x, i) => (
        <mesh key={i} position={[x, -0.2, -15.8]}>
          <boxGeometry args={[0.25, 0.2, 0.05]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#fef08a" : "#fbbf24"} />
        </mesh>
      ))}

      {/* ─── Layer 3: Midground Pine Trees (Z: -10) ─── */}
      <group ref={treesRef}>
        {Array.from({ length: TREE_COUNT }).map((_, i) => {
          const x = (i - TREE_COUNT / 2) * TREE_SPACING;
          return (
            <group key={i} position={[x, -0.5, -10]}>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.12, 0.8, 5]} />
                <meshStandardMaterial color="#1f1813" />
              </mesh>
              <mesh position={[0, 1.1, 0]}>
                <coneGeometry args={[0.85, 1.4, 6]} />
                <meshStandardMaterial color="#0f291e" roughness={0.8} />
              </mesh>
              <mesh position={[0, 1.7, 0]}>
                <coneGeometry args={[0.65, 1.1, 6]} />
                <meshStandardMaterial color="#143c2c" roughness={0.8} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ─── Layer 4: Passing Telegraph Poles & Wires (Z: -5.5) ─── */}
      <group ref={polesGroupRef}>
        {Array.from({ length: POLE_COUNT }).map((_, i) => {
          const x = (i - POLE_COUNT / 2) * POLE_SPACING;
          return (
            <group key={i} position={[x, -0.4, -5.5]}>
              {/* Wooden Pole Mast */}
              <mesh position={[0, 1.1, 0]}>
                <cylinderGeometry args={[0.06, 0.09, 2.8, 7]} />
                <meshStandardMaterial color="#2d1c14" roughness={0.85} />
              </mesh>
              {/* Crossbar */}
              <mesh position={[0, 2.2, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1.2, 0.08, 0.08]} />
                <meshStandardMaterial color="#2d1c14" roughness={0.85} />
              </mesh>
              {/* Ceramic Insulators */}
              <mesh position={[-0.48, 2.3, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.08, 6]} />
                <meshStandardMaterial color="#e2e8f0" />
              </mesh>
              <mesh position={[0.48, 2.3, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.08, 6]} />
                <meshStandardMaterial color="#e2e8f0" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Overhead Wires Drooping Across Scene */}
      <mesh position={[0, 1.8, -5.5]}>
        <boxGeometry args={[40, 0.015, 0.015]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 1.68, -5.5]}>
        <boxGeometry args={[40, 0.012, 0.012]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>

      {/* ─── Layer 5: Drifting Night Mist / Fog (Z: -4.5) ─── */}
      <group ref={fogRef} position={[0, 0.2, -4.5]}>
        <mesh position={[-8, 0.2, 0]}>
          <planeGeometry args={[14, 2.5]} />
          <meshBasicMaterial color="#1e293b" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[8, -0.1, 0]}>
          <planeGeometry args={[14, 2.2]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ─── Layer 6: Floating Fireflies (Z: -3 to -6) ─── */}
      <points ref={firefliesRef} geometry={fireflyGeo}>
        <pointsMaterial color="#a3e635" size={0.06} transparent opacity={0.7} depthWrite={false} />
      </points>

      {/* ─── Layer 7: Passing Rain Streaks (Z: -2 to -6) ─── */}
      <points ref={rainRef} geometry={rainGeo}>
        <pointsMaterial color="#bae6fd" size={0.038} transparent opacity={0.4} depthWrite={false} />
      </points>
    </group>
  );
}

