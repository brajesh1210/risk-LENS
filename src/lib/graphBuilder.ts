import { Component, GraphEdge, AnalysisResult, Package } from "@/types";
import { enrichComponent } from "./osv";

export function build3DPositions(components: Component[]): Component[] {
  return components.map((comp) => {
    // Spherical coordinates based on trust depth
    const radius = comp.trustDepth * 4;
    const theta = (parseInt(comp.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0).toString()) % 360) * (Math.PI / 180);
    const phi = (parseInt(comp.id.charCodeAt(0).toString()) % 180) * (Math.PI / 180);

    return {
      ...comp,
      position3D: {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      },
    };
  });
}

export function buildEdges(components: Component[]): GraphEdge[] {
  const edges: GraphEdge[] = [];

  components.forEach((comp) => {
    if (comp.trustDepth === 1) {
      edges.push({
        id: `org-root-${comp.id}`,
        source: "org-root",
        target: comp.id,
        isHighRisk: comp.riskScore >= 7,
      });
    } else if (comp.trustDepth > 1) {
      // Connect to a depth-1 component
      const parents = components.filter((c) => c.trustDepth === comp.trustDepth - 1);
      if (parents.length > 0) {
        const parent = parents[parseInt(comp.id.charCodeAt(0).toString()) % parents.length];
        edges.push({
          id: `${parent.id}-${comp.id}`,
          source: parent.id,
          target: comp.id,
          isHighRisk: comp.riskScore >= 7,
        });
      }
    }
  });

  return edges;
}

export async function analyzeStack(
  packages: Package[],
  stackName: string = "my-stack"
): Promise<AnalysisResult> {
  const components = await Promise.all(
    packages.map((pkg, i) =>
      enrichComponent(pkg, Math.min(Math.floor(i / 3) + 1, 4))
    )
  );

  const componentsWith3D = build3DPositions(components);
  const edges = buildEdges(componentsWith3D);

  const allCVEs = components.flatMap((c) => c.cves);
  const maxScore = components.length > 0 ? Math.max(...components.map((c) => c.riskScore), 0) : 0;

  const summary = {
    totalComponents: components.length,
    totalCVEs: allCVEs.length,
    criticalCount: components.filter((c) => c.status === "CRITICAL").length,
    highCount: components.filter((c) => c.status === "HIGH").length,
    mediumCount: components.filter((c) => c.status === "MEDIUM").length,
    lowCount: components.filter((c) => c.status === "LOW").length,
    maxDepth: Math.max(...components.map((c) => c.trustDepth), 0),
    exposurePercentage: Math.round((allCVEs.length / Math.max(components.length, 1)) * 10),
  };

  return {
    id: Date.now().toString(),
    name: stackName,
    timestamp: new Date().toISOString(),
    overallRiskScore: Math.round(maxScore * 10) / 10,
    components: componentsWith3D,
    edges,
    summary,
  };
}