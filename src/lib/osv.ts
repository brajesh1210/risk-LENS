import axios from "axios";
import { CVE, Package, Component } from "@/types";

const OSV_API = "https://api.osv.dev/v1";

interface OSVResponse {
  vulns?: OSVVulnerability[];
}

interface OSVVulnerability {
  id: string;
  summary?: string;
  details?: string;
  severity?: Array<{ type: string; score: string }>;
  database_specific?: { severity?: string };
  references?: Array<{ url: string; type: string }>;
  published?: string;
}

export async function queryOSV(pkg: Package): Promise<CVE[]> {
  try {
    const response = await axios.post<OSVResponse>(
      `${OSV_API}/query`,
      {
        package: { name: pkg.name, ecosystem: pkg.ecosystem || "npm" },
        version: pkg.version,
      },
      { timeout: 10000, headers: { "Content-Type": "application/json" } }
    );

    const vulns: OSVVulnerability[] = response.data.vulns || [];

    return vulns.map((vuln) => {
      const severityData = vuln.severity?.[0];
      const score = severityData
        ? parseCVSSScore(severityData.score)
        : getDefaultScore(vuln.database_specific?.severity);

      return {
        id: vuln.id,
        severity: getSeverityLevel(score),
        score,
        description: vuln.summary || vuln.details || "No description available",
        url: `https://osv.dev/vulnerability/${vuln.id}`,
        published: vuln.published,
      };
    });
  } catch (error) {
    console.error(`OSV query failed for ${pkg.name}:`, error);
    return [];
  }
}

function parseCVSSScore(scoreStr: string): number {
  if (scoreStr.startsWith("CVSS")) {
    const match = scoreStr.match(/(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 5.0;
  }
  const num = parseFloat(scoreStr);
  return isNaN(num) ? 5.0 : num;
}

function getDefaultScore(severity?: string): number {
  switch (severity?.toUpperCase()) {
    case "CRITICAL": return 9.5;
    case "HIGH": return 7.5;
    case "MEDIUM": return 5.0;
    case "LOW": return 2.5;
    default: return 5.0;
  }
}

function getSeverityLevel(score: number): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 9.0) return "CRITICAL";
  if (score >= 7.0) return "HIGH";
  if (score >= 4.0) return "MEDIUM";
  return "LOW";
}

export function calculateRiskScore(cves: CVE[]): number {
  if (cves.length === 0) return 0;
  const maxScore = Math.max(...cves.map((c) => c.score));
  const avgScore = cves.reduce((sum, c) => sum + c.score, 0) / cves.length;
  return Math.min(10, maxScore * 0.7 + avgScore * 0.3);
}

export function getComponentStatus(
  riskScore: number
): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE" {
  if (riskScore >= 9.0) return "CRITICAL";
  if (riskScore >= 7.0) return "HIGH";
  if (riskScore >= 4.0) return "MEDIUM";
  if (riskScore > 0) return "LOW";
  return "SAFE";
}

export async function enrichComponent(
  pkg: Package,
  trustDepth: number,
  usedBy: string[] = []
): Promise<Component> {
  const cves = await queryOSV(pkg);
  const riskScore = calculateRiskScore(cves);
  const status = getComponentStatus(riskScore);

  return {
    id: `${pkg.name}@${pkg.version}`,
    name: pkg.name,
    version: pkg.version,
    type: pkg.type || getPackageType(pkg.ecosystem),
    ecosystem: pkg.ecosystem || "npm",
    trustDepth,
    cves,
    riskScore,
    status,
    usedBy,
    license: "Unknown",
  };
}

function getPackageType(ecosystem: string): string {
  const types: Record<string, string> = {
    npm: "npm Library",
    PyPI: "Python Package",
    Maven: "Java Library",
    Go: "Go Module",
  };
  return types[ecosystem] || "Library";
}