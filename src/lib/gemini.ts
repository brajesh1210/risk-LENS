const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export interface RemediationAdvice {
  explanation: string;
  safeAlternative: string;
  patchCommand: string;
  urgency: "IMMEDIATE" | "HIGH" | "MEDIUM" | "LOW";
}

export async function getRemediationAdvice(
  packageName: string,
  version: string,
  cveId: string,
  cveDescription: string
): Promise<RemediationAdvice> {
  if (!GEMINI_API_KEY) return getMockRemediation(packageName, version);

  const prompt = `You are a cybersecurity expert. Analyze this vulnerability.

Package: ${packageName} v${version}
CVE: ${cveId}
Description: ${cveDescription}

Return JSON only:
{
  "explanation": "2 sentences",
  "safeAlternative": "${packageName}@latest version",
  "patchCommand": "npm install ${packageName}@latest",
  "urgency": "IMMEDIATE|HIGH|MEDIUM|LOW"
}`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
      }),
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return JSON.parse(text) as RemediationAdvice;
  } catch {
    return getMockRemediation(packageName, version);
  }
}

function getMockRemediation(packageName: string, version: string): RemediationAdvice {
  return {
    explanation: `The ${packageName} v${version} package contains a known vulnerability allowing remote code execution. Immediate patching required to prevent supply chain compromise.`,
    safeAlternative: `${packageName}@latest`,
    patchCommand: `npm install ${packageName}@latest`,
    urgency: "HIGH",
  };
}

export function parsePackageJson(content: string) {
  try {
    const json = JSON.parse(content);
    const deps = { ...(json.dependencies || {}), ...(json.devDependencies || {}) };
    return Object.entries(deps).map(([name, version]) => ({
      name,
      version: (version as string).replace(/[\^~>=<]/g, "").split(" ")[0],
      ecosystem: "npm",
    }));
  } catch { return []; }
}

export function parseSBOM(content: string) {
  try {
    const json = JSON.parse(content);
    if (json.components) {
      return json.components.map((c: { name: string; version: string; purl?: string }) => ({
        name: c.name, version: c.version || "latest", ecosystem: detectEcosystem(c.purl || ""),
      }));
    }
    if (json.packages) {
      return json.packages.map((p: { name: string; versionInfo?: string }) => ({
        name: p.name, version: p.versionInfo || "latest", ecosystem: "npm",
      }));
    }
    return [];
  } catch { return []; }
}

function detectEcosystem(purl: string): string {
  if (purl.includes("pkg:npm")) return "npm";
  if (purl.includes("pkg:pypi")) return "PyPI";
  if (purl.includes("pkg:maven")) return "Maven";
  return "npm";
}