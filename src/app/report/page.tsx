"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAnalysisStore } from "@/store/analysisStore";
import { Component } from "@/types";
import { calculateROI, formatCurrency } from "@/lib/roiCalculator";

export default function ReportPage() {
  const { currentAnalysis } = useAnalysisStore();
  const router = useRouter();

  if (!currentAnalysis) {
    if (typeof window !== "undefined") router.push("/analyze");
    return null;
  }

  const overallColor = currentAnalysis.overallRiskScore >= 9 ? "#FF003C" :
                       currentAnalysis.overallRiskScore >= 7 ? "#ff8800" : "#00FF41";

  const criticalComponents = currentAnalysis.components
    .filter((c) => c.status === "CRITICAL" || c.status === "HIGH")
    .sort((a, b) => b.riskScore - a.riskScore);

  const roi = calculateROI(currentAnalysis);

  const handleExportJSON = () => {
    const data = JSON.stringify(currentAnalysis, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentAnalysis.name}-report.json`;
    a.click();
  };

  const handleExportCSV = () => {
    const headers = "Component,Type,Version,CVEs,Score,Depth,Status";
    const rows = currentAnalysis.components.map(
      (c) => `${c.name},${c.type},${c.version},${c.cves.length},${c.riskScore},${c.trustDepth},${c.status}`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentAnalysis.name}-report.csv`;
    a.click();
  };

  const handlePrintPDF = () => window.print();

  const distributionData = [
    { label: "Critical (9.0+)", count: currentAnalysis.summary.criticalCount, color: "#FF003C" },
    { label: "High (7.0-8.9)", count: currentAnalysis.summary.highCount, color: "#ff8800" },
    { label: "Medium (4.0-6.9)", count: currentAnalysis.summary.mediumCount, color: "#ffcc00" },
    { label: "Low (0.0-3.9)", count: currentAnalysis.summary.lowCount, color: "#00FF41" },
  ];
  const totalRisks = distributionData.reduce((s, d) => s + d.count, 1);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] sticky top-0 bg-black z-20 glass">
        <Link href="/graph" className="text-[#00FF41] text-sm font-mono hover:underline">
          ← BACK TO GRAPH
        </Link>
        <div className="text-center">
          <p className="text-[#555] text-xs uppercase tracking-widest font-mono">RISK ASSESSMENT</p>
          <h1 className="font-bold">Report</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrintPDF} className="border border-[#333] text-white text-xs px-3 py-2 rounded-lg hover:border-[#555] font-mono">
            PDF
          </button>
          <button onClick={handleExportCSV} className="border border-[#333] text-white text-xs px-3 py-2 rounded-lg hover:border-[#555] font-mono">
            CSV
          </button>
          <button onClick={handleExportJSON} className="bg-[#00FF41] text-black text-xs px-4 py-2 rounded-lg font-bold font-mono hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]">
            EXPORT JSON
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Report Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF41]" />
            <span className="text-[#555] text-xs font-mono">riskLENS / RISK ASSESSMENT REPORT</span>
          </div>
          <h1 className="text-3xl font-black mt-2 font-mono">{currentAnalysis.name}</h1>
          <p className="text-[#555] text-sm mt-1 font-mono">
            Generated: {new Date(currentAnalysis.timestamp).toLocaleString()} · ID: {currentAnalysis.id}
          </p>
        </motion.div>

        {/* Overview */}
        <div className="glass border border-[#1a1a1a] rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[#555] text-xs uppercase mb-2 font-mono">OVERALL RISK SCORE</p>
              <div className="text-6xl font-black font-mono" style={{ color: overallColor }}>
                {currentAnalysis.overallRiskScore.toFixed(1)}
                <span className="text-3xl text-[#555]">/10</span>
              </div>
              <div className="text-xs font-bold uppercase mt-2 inline-block px-3 py-1 rounded font-mono"
                style={{ background: overallColor + "22", color: overallColor }}>
                {currentAnalysis.overallRiskScore >= 9 ? "CRITICAL" : currentAnalysis.overallRiskScore >= 7 ? "HIGH" : "MEDIUM"}
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-[#555]">Supply Chain Exposure</span>
                  <span>{currentAnalysis.summary.exposurePercentage}%</span>
                </div>
                <div className="bg-[#1a1a1a] rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(currentAnalysis.summary.exposurePercentage, 100)}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-2 rounded-full"
                    style={{ background: overallColor }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              {[
                { label: "Components", value: currentAnalysis.summary.totalComponents },
                { label: "CVEs Detected", value: currentAnalysis.summary.totalCVEs, color: "#FF003C" },
                { label: "Critical Risks", value: currentAnalysis.summary.criticalCount, color: "#FF003C" },
                { label: "Max Depth", value: currentAnalysis.summary.maxDepth },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4">
                  <div className="text-3xl font-bold font-mono" style={{ color: stat.color || "white" }}>
                    {stat.value}
                  </div>
                  <div className="text-[#555] text-xs mt-1 uppercase font-mono">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Impact (NEW) */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 font-mono">💰 Financial Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-red rounded-xl p-6 border border-[#FF003C]/30">
              <p className="text-[#FF003C] text-xs uppercase tracking-widest font-mono mb-2">ESTIMATED BREACH COST</p>
              <p className="text-4xl font-black font-mono text-[#FF003C]">{formatCurrency(roi.estimatedBreachCost)}</p>
              <p className="text-[#888] text-xs mt-2">If critical CVEs are exploited</p>
            </div>
            <div className="glass border border-[#00FF41]/30 rounded-xl p-6">
              <p className="text-[#00FF41] text-xs uppercase tracking-widest font-mono mb-2">POTENTIAL ANNUAL SAVINGS</p>
              <p className="text-4xl font-black font-mono text-[#00FF41]">{formatCurrency(roi.annualSavings)}</p>
              <p className="text-[#888] text-xs mt-2">With risk-LENS automation</p>
            </div>
          </div>
        </section>

        {/* Critical Exposures */}
        {criticalComponents.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 font-mono">⚠ Critical Exposures</h2>
            <div className="space-y-4">
              {criticalComponents.slice(0, 5).map((comp, i) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CriticalCard component={comp} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Inventory Table */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 font-mono">📋 Full Component Inventory</h2>
          <div className="glass border border-[#1a1a1a] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-[#1a1a1a]">
                <tr className="text-[#555] text-xs uppercase font-mono">
                  {["Component", "Type", "Version", "CVEs", "Score", "Depth", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentAnalysis.components.map((comp) => (
                  <ComponentRow key={comp.id} component={comp} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Risk Distribution */}
        <section className="glass border border-[#1a1a1a] rounded-2xl p-6">
          <h3 className="font-bold mb-4 font-mono">📊 Risk Distribution</h3>
          <div className="space-y-3">
            {distributionData.map((item, i) => {
              const pct = Math.round((item.count / totalRisks) * 100);
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between text-sm mb-1 font-mono">
                    <span className="text-[#888]">{item.label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      <footer className="border-t border-[#1a1a1a] py-6 px-6 mt-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF41]" />
            <span className="text-[#888] text-sm font-bold">
              risk<span className="text-[#00FF41]">LENS</span>
            </span>
          </div>
          <p className="text-[#555] text-xs">
            Generated by risk-LENS · Data from OSV · Not a substitute for professional security audit
          </p>
        </div>
      </footer>
    </div>
  );
}

function CriticalCard({ component }: { component: Component }) {
  const color = component.status === "CRITICAL" ? "#FF003C" : "#ff8800";
  const topCVE = component.cves[0];

  return (
    <div className="glass border rounded-2xl p-6 border-l-4" style={{ borderColor: "#1a1a1a", borderLeftColor: color }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold font-mono">{component.name}</h3>
          <div className="flex items-center gap-3 mt-1 font-mono">
            <span className="text-[#555] text-xs">v{component.version}</span>
            <span className="text-xs uppercase px-2 py-0.5 rounded bg-[#1a1a1a] text-[#888]">{component.type}</span>
            <span className="text-xs uppercase text-purple-400">Trust Depth: {component.trustDepth}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[#555] text-xs font-mono">RISK SCORE</p>
          <p className="text-3xl font-black font-mono" style={{ color }}>{component.riskScore.toFixed(1)}</p>
        </div>
      </div>
      <div className="bg-[#1a1a1a] h-1.5 rounded-full mb-4">
        <div className="h-1.5 rounded-full" style={{ width: `${component.riskScore * 10}%`, background: color }} />
      </div>
      {topCVE && (
        <p className="text-sm font-mono" style={{ color: "#aaa" }}>
          <span style={{ color }}>{component.cves.length} CVE{component.cves.length > 1 ? "s" : ""}</span>
          {" "}including {topCVE.id} ({topCVE.description.substring(0, 80)}...)
        </p>
      )}
    </div>
  );
}

function ComponentRow({ component }: { component: Component }) {
  const colors: Record<string, string> = {
    CRITICAL: "#FF003C", HIGH: "#ff8800", MEDIUM: "#ffcc00", LOW: "#00FF41", SAFE: "#333"
  };
  const color = colors[component.status] || "#333";

  return (
    <tr className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a] transition-colors font-mono">
      <td className="px-4 py-3 text-sm font-medium">{component.name}</td>
      <td className="px-4 py-3 text-[#888] text-sm">{component.type}</td>
      <td className="px-4 py-3 text-[#888] text-sm">{component.version}</td>
      <td className="px-4 py-3">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: component.cves.length > 0 ? color + "22" : "#1a1a1a",
            color: component.cves.length > 0 ? color : "#555"
          }}>
          {component.cves.length}
        </span>
      </td>
      <td className="px-4 py-3 font-bold" style={{ color }}>{component.riskScore.toFixed(1)}</td>
      <td className="px-4 py-3 text-[#888] text-sm">{component.trustDepth}</td>
      <td className="px-4 py-3">
        <span className="text-xs font-bold uppercase px-2 py-1 rounded"
          style={{ background: color + "22", color }}>
          {component.status}
        </span>
      </td>
    </tr>
  );
}