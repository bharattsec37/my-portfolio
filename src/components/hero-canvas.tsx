"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const nodeCount = 180;
const nodePositions = Array.from({ length: nodeCount }, (_, index) => {
  const phi = Math.acos(1 - 2 * (index + 0.5) / nodeCount);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;
  const radius = 1.15;
  return new THREE.Vector3(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
});
const nodeGeometry = new THREE.BufferGeometry().setFromPoints(nodePositions);
const edgePositions: number[] = [];
nodePositions.forEach((point, index) => nodePositions.forEach((candidate, candidateIndex) => {
  if (candidateIndex > index && point.distanceTo(candidate) < 0.36) {
    edgePositions.push(point.x, point.y, point.z, candidate.x, candidate.y, candidate.z);
  }
}));
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));

function NodeField({ isVisible = true }: { isVisible?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const reducedMotion = useReducedMotion();

  useFrame(({ pointer, size }, delta) => {
    if (!isVisible || !group.current || reducedMotion) return;
    elapsed.current += delta;
    const mobileFactor = size.width < 600 ? 0.3 : 1;
    const targetRotationX = Math.sin(elapsed.current * 0.16) * 0.12 - pointer.y * 0.1;
    const targetRotationY = elapsed.current * 0.08 + pointer.x * 0.16;
    group.current.rotation.x += (targetRotationX - group.current.rotation.x) * delta * 2;
    group.current.rotation.y += (targetRotationY - group.current.rotation.y) * delta * 2;
    group.current.position.y = Math.sin(elapsed.current * 0.5) * 0.04 * mobileFactor;
  });

  return <group ref={group}>
    <lineSegments geometry={edgeGeometry}><lineBasicMaterial color="#245bff" transparent opacity={0.3} /></lineSegments>
    <points geometry={nodeGeometry}><pointsMaterial color="#c6ff3d" size={0.026} sizeAttenuation transparent opacity={0.9} /></points>
    <mesh><icosahedronGeometry args={[0.72, 1]} /><meshBasicMaterial color="#754bff" wireframe transparent opacity={0.24} /></mesh>
    <mesh><sphereGeometry args={[0.055, 12, 12]} /><meshBasicMaterial color="#f4f4f0" /></mesh>
  </group>;
}

export default function HeroCanvas() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "150px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.7} />
        <NodeField isVisible={isVisible} />
      </Canvas>
    </div>
  );
}