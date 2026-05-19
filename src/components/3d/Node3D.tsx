"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sphere, Box } from "@react-three/drei";
import * as THREE from "three";
import { Component } from "@/types";
import { useAnalysisStore } from "@/store/analysisStore";

interface Node3DProps {
  component: Component;
  isOrg?: boolean;
}

const STATUS_COLORS = {
  CRITICAL: "#FF003C",
  HIGH: "#ff8800",
  MEDIUM: "#ffcc00",
  LOW: "#00FF41",
  SAFE: "#00FF41",
};

export function Node3D({ component, isOrg = false }: Node3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setSelectedComponent, setCameraTarget, isolatedNodes } = useAnalysisStore();

  const isIsolated = isolatedNodes.has(component.id);
  const color = isIsolated ? "#444" : STATUS_COLORS[component.status];
  const position = component.position3D || { x: 0, y: 0, z: 0 };
  const size = isOrg ? 1.2 : component.status === "CRITICAL" ? 0.7 : 0.5;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Pulse animation for critical/high
    if (component.status === "CRITICAL" || component.status === "HIGH") {
      const pulse = 1 + Math.sin(t * 3) * 0.15;
      meshRef.current.scale.set(pulse, pulse, pulse);

      // Glitch effect on critical
      if (component.status === "CRITICAL" && !isIsolated) {
        meshRef.current.position.x = position.x + (Math.random() - 0.5) * 0.05;
        meshRef.current.position.z = position.z + (Math.random() - 0.5) * 0.05;
      }
    } else {
      meshRef.current.rotation.y = t * 0.3;
    }

    // Org node gentle rotation
    if (isOrg) {
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.rotation.x = t * 0.1;
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponent(component);
    setCameraTarget(component.id);
  };

  return (
    <group position={[position.x, position.y, position.z]}>
      {isOrg ? (
        <Box
          ref={meshRef as React.RefObject<THREE.Mesh>}
          args={[size, size, size]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            wireframe={false}
            transparent
            opacity={0.9}
          />
        </Box>
      ) : (
        <Sphere
          ref={meshRef as React.RefObject<THREE.Mesh>}
          args={[size, 16, 16]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={component.status === "CRITICAL" ? 0.8 : 0.3}
            wireframe={component.status === "SAFE" || component.status === "LOW"}
            transparent
            opacity={isIsolated ? 0.3 : 0.9}
          />
        </Sphere>
      )}

      {/* Glow ring for critical/high */}
      {(component.status === "CRITICAL" || component.status === "HIGH") && !isIsolated && (
        <mesh>
          <ringGeometry args={[size * 1.5, size * 1.8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* CVE Badge */}
      {component.cves.length > 0 && !isIsolated && (
        <Html distanceFactor={15} position={[size + 0.3, size + 0.3, 0]}>
          <div
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white font-mono"
            style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          >
            {component.cves.length}
          </div>
        </Html>
      )}

      {/* Label */}
      <Html distanceFactor={12} position={[0, -size - 0.5, 0]} center>
        <div
          className="text-xs font-bold uppercase tracking-wider pointer-events-none font-mono whitespace-nowrap"
          style={{
            color: isIsolated ? "#555" : color,
            textShadow: `0 0 8px ${color}`,
            opacity: hovered ? 1 : 0.8,
          }}
        >
          {component.name.length > 12 ? component.name.substring(0, 12) + "..." : component.name}
        </div>
      </Html>

      {/* Isolation indicator */}
      {isIsolated && (
        <Html distanceFactor={10} position={[0, size + 0.5, 0]} center>
          <div className="text-xs text-[#00FF41] font-mono font-bold">⚡ ISOLATED</div>
        </Html>
      )}
    </group>
  );
}