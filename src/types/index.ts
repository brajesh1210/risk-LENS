export interface Package {
  name: string;
  version: string;
  ecosystem: string;
  type?: string;
}

export interface CVE {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  score: number;
  description: string;
  url?: string;
  published?: string;
}

export interface Component {
  id: string;
  name: string;
  version: string;
  type: string;
  ecosystem: string;
  trustDepth: number;
  cves: CVE[];
  riskScore: number;
  status: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
  usedBy?: string[];
  license?: string;
  position3D?: { x: number; y: number; z: number };
  isolated?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  isHighRisk: boolean;
  isBreached?: boolean;
}

export interface AnalysisResult {
  id: string;
  name: string;
  timestamp: string;
  overallRiskScore: number;
  components: Component[];
  edges: GraphEdge[];
  summary: {
    totalComponents: number;
    totalCVEs: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    maxDepth: number;
    exposurePercentage: number;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  packages: Package[];
  stats: {
    packages: number;
    vulnerabilities: number;
    riskScore: number;
  };
}

export interface ROIMetrics {
  estimatedBreachCost: number;
  potentialFineAmount: number;
  complianceHoursSaved: number;
  riskReductionPercentage: number;
  annualSavings: number;
  meanTimeToDetect: number;
}