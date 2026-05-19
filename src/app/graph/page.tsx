"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scene3D } from "@/components/3d/Scene3D";
import { DetailPanel } from "@/components/DetailPanel";
import { CommandConsole } from "@/components/CommandConsole";
import { ROIDashboard } from "@/components/ROIDashboard";
import { useAnalysisStore } from "@/store/analysisStore";
import { Component } from "@/types";

export default function GraphPage() {
  const router = useRouter();
  const {
    currentAnalysis,
    toggleConsole,
    toggleROIDashboard,
    setScanActive,
    healthIndex,
    isBlastSimulating,
    setSelectedComponent,
  } = useAnalysisStore();

  useEffect(() => {
    if (!currentAnalysis) router.push("/analyze");
  }, [currentAnalysis, router]);

  if (!currentAnalysis) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888] font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  const overallColor = currentAnalysis.overallRiskScore >= 9 ? "#FF003C" :
                       currentAnalysis.overallRiskScore >= 7 ? "#ff8800" : "#00FF41";

  const criticalComponents = currentAnalysis.components
    .filter((c) => c.status === "CRITICAL" || c.status === "HIGH")
    .slice(0, 5);

  const healthColor = healthIndex >= 70 ? "#00FF41" : healthIndex >= 40 ? "#ff8800" : "#FF003C";

  return (
    <div className={`h-screen bg-black flex flex-col overflow-hidden ${isBlastSimulating ? "shake" : ""}`}>
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-black z-30 flex-shrink-0 glass">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <span className="font-bold text-sm font-mono">
              risk<span className="text-[#00FF41]">LENS</span>
            </span>
          </Link>
          <div className="text-[#444]">|</div>
          <span className="text-[#888] text-sm font-mono">📄 {currentAnalysis.name}.json</span>
        </div>

        {/* Risk Score Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono"
          style={{ borderColor: overallColor + "44", background: overallColor + "11" }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: overallColor }} />
          <span className="font-bold" style={{ color: overallColor }}>
            SCORE: {currentAnalysis.overallRiskScore.toFixed(1)}{" "}
            {currentAnalysis.overallRiskScore >= 9 ? "CRITICAL" : currentAnalysis.overallRiskScore >= 7 ? "HIGH" : "MEDIUM"}
          </span>
        </motion.div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScanActive(true)}
            className="border border-[#333] text-white text-xs px-3 py-2 rounded-lg hover:border-[#00FF41] hover:text-[#00FF41] font-mono"
          >
            🔍 SCAN
          </button>
          <button
            onClick={toggleConsole}
            className="border border-[#333] text-white text-xs px-3 py-2 rounded-lg hover:border-[#00FF41] hover:text-[#00FF41] font-mono"
          >
            ▸ CONSOLE (Ctrl+\)
          </button>
          <button
            onClick={toggleROIDashboard}
            className="bg-purple-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-purple-500 font-mono font-bold"
          >
            💰 ROI METRICS
          </button>
          <Link href="/report">
            <button className="bg-[#00FF41] text-black text-xs px-4 py-2 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] font-mono">
              EXPORT ↓
            </button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 glass border-r border-[#1a1a1a] flex flex-col overflow-y-auto flex-shrink-0">
          {/* Health Index Widget */}
          <div className="p-4 border-b border-[#1a1a1a]">
            <p className="text-xs uppercase tracking-widest text-[#555] mb-3 font-mono">
              INFRASTRUCTURE HEALTH
            </p>
            <motion.div
              key={healthIndex}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-5xl font-black font-mono mb-1"
              style={{ color: healthColor }}
            >
              {healthIndex}%
            </motion.div>
            <div className="bg-[#1a1a1a] rounded-full h-1.5 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthIndex}%` }}
                transition={{ duration: 0.5 }}
                className="h-1.5 rounded-full"
                style={{ background: healthColor }}
              />
            </div>
            {healthIndex < 40 && (
              <p className="text-[#FF003C] text-xs font-mono font-bold animate-pulse">⚠ CRITICAL STATE</p>
            )}
          </div>

          {/* Risk Overview */}
          <div className="p-4 border-b border-[#1a1a1a]">
            <p className="text-xs uppercase tracking-widest text-[#555] mb-3 font-mono">RISK OVERVIEW</p>
            <div className="text-5xl font-black mb-1 font-mono" style={{ color: overallColor }}>
              {currentAnalysis.overallRiskScore.toFixed(1)}
            </div>
            <div className="text-xs font-bold uppercase px-2 py-0.5 rounded inline-block mb-3 font-mono"
              style={{ background: overallColor + "22", color: overallColor }}>
              {currentAnalysis.overallRiskScore >= 9 ? "CRITICAL" : currentAnalysis.overallRiskScore >= 7 ? "HIGH" : "MEDIUM"}
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <div className="text-xl font-bold text-white">{currentAnalysis.summary.totalComponents}</div>
                <div className="text-[#555] text-xs">COMPONENTS</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{currentAnalysis.summary.totalCVEs}</div>
                <div className="text-[#555] text-xs">CVES</div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="p-4 border-b border-[#1a1a1a]">
            <p className="text-xs uppercase tracking-widest text-[#555] mb-3 font-mono">FILTER BY RISK</p>
            {[
              { label: "Critical", count: currentAnalysis.summary.criticalCount, color: "#FF003C" },
              { label: "High", count: currentAnalysis.summary.highCount, color: "#ff8800" },
              { label: "Medium", count: currentAnalysis.summary.mediumCount, color: "#ffcc00" },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between py-1.5 font-mono text-sm">
                <span className="text-white">{f.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#555]">{f.count}</span>
                  <div className="w-2 h-2 rounded-full" style={{ background: f.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Flagged */}
          <div className="p-4 flex-1">
            <p className="text-xs uppercase tracking-widest text-[#555] mb-3 font-mono">
              FLAGGED ({criticalComponents.length})
            </p>
            <div className="space-y-2">
              {criticalComponents.map((comp) => (
                <FlaggedItem key={comp.id} component={comp} onClick={() => setSelectedComponent(comp)} />
              ))}
            </div>
          </div>

          {/* Help text */}
          <div className="p-4 border-t border-[#1a1a1a]">
            <p className="text-[#555] text-xs font-mono leading-relaxed">
              💡 <span className="text-[#00FF41]">TIP:</span> Press <kbd className="bg-[#1a1a1a] px-1 rounded">Ctrl+\</kbd> for command console
            </p>
          </div>
        </aside>

        {/* Main 3D Canvas */}
        <main className="flex-1 relative">
          <Scene3D />

          {/* 3D Controls Overlay */}
          <div className="absolute top-4 left-4 glass rounded-lg p-3 text-xs font-mono z-10">
            <p className="text-[#555] mb-1">🖱️ DRAG to rotate</p>
            <p className="text-[#555] mb-1">⚙️ SCROLL to zoom</p>
            <p className="text-[#555]">🖱️ RIGHT-CLICK to pan</p>
          </div>

          {/* Status indicator */}
          {isBlastSimulating && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#FF003C] text-white px-6 py-3 rounded-lg font-mono font-bold shadow-[0_0_30px_#FF003C]"
            >
              ⚠ BREACH IN PROGRESS — CASCADE FAILURE IMMINENT
            </motion.div>
          )}

          <DetailPanel />
        </main>
      </div>

      {/* Live Feed Ticker */}
      <div className="h-8 bg-black border-t border-[#1a1a1a] overflow-hidden flex items-center flex-shrink-0">
        <div className="text-[#555] text-xs px-3 border-r border-[#1a1a1a] flex-shrink-0 font-mono font-bold">
          ● LIVE FEED
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-content flex gap-8 whitespace-nowrap text-xs py-2 font-mono">
            {currentAnalysis.components
              .filter((c) => c.cves.length > 0)
              .slice(0, 10)
              .flatMap((c) =>
                c.cves.slice(0, 2).map((cve) => ({
                  text: `${cve.id} ${c.name} ${cve.severity} (${cve.score})`,
                  color: cve.severity === "CRITICAL" ? "#FF003C" :
                         cve.severity === "HIGH" ? "#ff8800" : "#ffcc00",
                }))
              )
              .map((item, i) => (
                <span key={i} style={{ color: item.color }} className="flex-shrink-0">
                  ● {item.text} · VULNERABILITY ALERT
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Command Console */}
      <CommandConsole />

      {/* ROI Dashboard Modal */}
      <ROIDashboard />
    </div>
  );
}

function FlaggedItem({ component, onClick }: { component: Component; onClick: () => void }) {
  const color = component.status === "CRITICAL" ? "#FF003C" :
                component.status === "HIGH" ? "#ff8800" : "#ffcc00";
  const topCVE = component.cves[0];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="w-full text-left glass border border-[#1a1a1a] rounded-lg p-2 hover:border-[#00FF41]/30 transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-white text-xs font-medium font-mono truncate">
          {component.name} v{component.version}
        </span>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      </div>
      {topCVE && (
        <p className="text-[#555] text-xs mt-0.5 font-mono truncate">{topCVE.id}</p>
      )}
    </motion.button>
  );
}