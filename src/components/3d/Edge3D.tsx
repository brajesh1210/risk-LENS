"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Component, GraphEdge } from "@/types";
import { useAnalysisStore } from "@/store/analysisStore";

interface Edge3DProps {
  edge: GraphEdge;
  sourcePos: { x: number; y: number; z: number };
  targetPos: { x: number; y: number; z: number };
}

export function Edge3D({ edge, sourcePos, targetPos }: Edge3DProps) {
  const lineRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const { isBlastSimulating, blastSourceId, isolatedNodes } = useAnalysisStore();

  const isIsolated = isolatedNodes.has(edge.target) || isolatedNodes.has(edge.source);
  const isBlasting = isBlastSimulating && (blastSourceId === edge.source || blastSourceId === edge.target);

  const points = useMemo(() => {
    return [
      new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z),
      new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z),
    ];
  }, [sourcePos, targetPos]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  const color = isIsolated ? "#222" : isBlasting ? "#FF003C" : edge.isHighRisk ? "#FF003C" : "#1a4d2e";

  useFrame(({ clock }) => {
    if (!particleRef.current) return;
    const t = (clock.getElapsedTime() * 0.5) % 1;

    // Animate particle along edge
    particleRef.current.position.x = sourcePos.x + (targetPos.x - sourcePos.x) * t;
    particleRef.current.position.y = sourcePos.y + (targetPos.y - sourcePos.y) * t;
    particleRef.current.position.z = sourcePos.z + (targetPos.z - sourcePos.z) * t;
  });

  return (
    <group>
      {/* Line */}
      <primitive
        object={new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: isIsolated ? 0.1 : isBlasting ? 1 : edge.isHighRisk ? 0.6 : 0.3,
            linewidth: isBlasting ? 4 : edge.isHighRisk ? 2 : 1,
          })
        )}
      />

      {/* Particle flow */}
      {!isIsolated && (
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Blast wave */}
      {isBlasting && <BlastWave sourcePos={sourcePos} targetPos={targetPos} />}
    </group>
  );
}

function BlastWave({ sourcePos, targetPos }: { sourcePos: { x: number; y: number; z: number }; targetPos: { x: number; y: number; z: number } }) {
  const waveRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef(Date.now());

  useFrame(() => {
    if (!waveRef.current) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const duration = 2;
    const t = Math.min(elapsed / duration, 1);

    waveRef.current.position.x = sourcePos.x + (targetPos.x - sourcePos.x) * t;
    waveRef.current.position.y = sourcePos.y + (targetPos.y - sourcePos.y) * t;
    waveRef.current.position.z = sourcePos.z + (targetPos.z - sourcePos.z) * t;

    const scale = 1 + Math.sin(elapsed * 10) * 0.3;
    waveRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={waveRef}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#FF003C" transparent opacity={0.6} />
    </mesh>
  );
}