"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Grid } from "@react-three/drei";
import * as THREE from "three";
import { Node3D } from "./Node3D";
import { Edge3D } from "./Edge3D";
import { useAnalysisStore } from "@/store/analysisStore";
import { Component } from "@/types";

function CameraController() {
  const { camera } = useThree();
  const { cameraTargetId, currentAnalysis, setCameraTarget } = useAnalysisStore();
  const targetRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!cameraTargetId || !currentAnalysis) return;
    const comp = currentAnalysis.components.find((c) => c.id === cameraTargetId);
    if (comp?.position3D) {
      targetRef.current = new THREE.Vector3(
        comp.position3D.x + 3,
        comp.position3D.y + 2,
        comp.position3D.z + 3
      );
    }
  }, [cameraTargetId, currentAnalysis]);

  useFrame(() => {
    if (targetRef.current) {
      camera.position.lerp(targetRef.current, 0.05);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(targetRef.current) < 0.5) {
        targetRef.current = null;
        setCameraTarget(null);
      }
    }
  });

  return null;
}

function ScanEffect() {
  const ringRef = useRef<THREE.Mesh>(null);
  const { scanActive, setScanActive } = useAnalysisStore();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (scanActive) {
      startTimeRef.current = Date.now();
      setTimeout(() => setScanActive(false), 3000);
    }
  }, [scanActive]);

  useFrame(() => {
    if (!scanActive || !ringRef.current || !startTimeRef.current) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const scale = elapsed * 8;
    ringRef.current.scale.set(scale, scale, scale);
    const material = ringRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = Math.max(0, 1 - elapsed / 3);
  });

  if (!scanActive) return null;

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1, 1.1, 64]} />
      <meshBasicMaterial color="#00FF41" transparent opacity={1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CameraShake() {
  const { camera } = useThree();
  const { isBlastSimulating } = useAnalysisStore();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isBlastSimulating) startTimeRef.current = Date.now();
    else startTimeRef.current = null;
  }, [isBlastSimulating]);

  useFrame(() => {
    if (!isBlastSimulating || !startTimeRef.current) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    if (elapsed > 1.5 && elapsed < 2.5) {
      camera.position.x += (Math.random() - 0.5) * 0.1;
      camera.position.y += (Math.random() - 0.5) * 0.1;
    }
  });

  return null;
}

export function Scene3D() {
  const { currentAnalysis } = useAnalysisStore();

  if (!currentAnalysis) return null;

  const orgComponent: Component = {
    id: "org-root",
    name: "YOUR ORG",
    version: "",
    type: "Organization",
    ecosystem: "",
    trustDepth: 0,
    cves: [],
    riskScore: 0,
    status: "SAFE",
    position3D: { x: 0, y: 0, z: 0 },
  };

  return (
    <Canvas
      camera={{ position: [12, 8, 12], fov: 60 }}
      style={{ background: "#000000" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#00FF41" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#FF003C" />

      <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />

      <Grid
        args={[40, 40]}
        cellColor="#1a1a1a"
        sectionColor="#00FF41"
        sectionThickness={0.5}
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid
        position={[0, -8, 0]}
      />

      {/* Org core */}
      <Node3D component={orgComponent} isOrg />

      {/* Components */}
      {currentAnalysis.components.map((comp) => (
        <Node3D key={comp.id} component={comp} />
      ))}

      {/* Edges */}
      {currentAnalysis.edges.map((edge) => {
        const sourceComp = edge.source === "org-root"
          ? orgComponent
          : currentAnalysis.components.find((c) => c.id === edge.source);
        const targetComp = currentAnalysis.components.find((c) => c.id === edge.target);
        if (!sourceComp?.position3D || !targetComp?.position3D) return null;

        return (
          <Edge3D
            key={edge.id}
            edge={edge}
            sourcePos={sourceComp.position3D}
            targetPos={targetComp.position3D}
          />
        );
      })}

      <ScanEffect />
      <CameraController />
      <CameraShake />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </Canvas>
  );
}