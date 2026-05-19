"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Component, CVE } from "@/types";
import { useAnalysisStore } from "@/store/analysisStore";

export function DetailPanel() {
  const { selectedComponent, setSelectedComponent, triggerBlast, isolateNode, isolatedNodes } = useAnalysisStore();
  const [remediation, setRemediation] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  if (!selectedComponent) return null;
  const comp = selectedComponent;
  const isIsolated = isolatedNodes.has(comp.id);

  const statusColor = comp.status === "CRITICAL" ? "#FF003C" :
                      comp.status === "HIGH" ? "#ff8800" :
                      comp.status === "MEDIUM" ? "#ffcc00" : "#00FF41";

  const handleGetRemediation = async () => {
    if (comp.cves.length === 0) return;
    const cve = comp.cves[0];
    setLoading(true);
    try {
      const res = await fetch("/api/remediate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: comp.name, version: comp.version,
          cveId: cve.id, cveDescription: cve.description,
        }),
      });
      const data = await res.json();
      setRemediation(data);
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="absolute top-0 right-0 w-96 h-full glass border-l border-[#1a1a1a] flex flex-col overflow-y-auto z-20"
      >
        <div className="p-4 border-b border-[#1a1a1a] flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg font-mono">{comp.name}</h3>
            <p className="text-[#555] text-sm font-mono">v{comp.version}</p>
          </div>
          <button onClick={() => { setSelectedComponent(null); setRemediation(null); }}
            className="text-[#555] hover:text-white text-2xl">×</button>
        </div>

        <div className="p-4 border-b border-[#1a1a1a]">
          <div className="rounded-xl p-4 text-center"
            style={{ background: statusColor + "11", border: `1px solid ${statusColor}33` }}>
            <div className="text-5xl font-black font-mono" style={{ color: statusColor }}>
              {comp.riskScore.toFixed(1)}
            </div>
            <div className="text-xs font-bold uppercase mt-1 px-3 py-1 rounded-full inline-block font-mono"
              style={{ background: statusColor + "22", color: statusColor }}>
              {comp.status}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-[#555] mb-1 font-mono">
                <span>EXPOSURE</span><span>{Math.round(comp.riskScore * 10)}%</span>
              </div>
              <div className="bg-[#1a1a1a] rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all"
                  style={{ width: `${comp.riskScore * 10}%`, background: statusColor }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-[#1a1a1a] grid grid-cols-2 gap-4 font-mono">
          <div>
            <p className="text-[#555] text-xs uppercase mb-1">Type</p>
            <p className="text-sm">{comp.type}</p>
          </div>
          <div>
            <p className="text-[#555] text-xs uppercase mb-1">Trust Depth</p>
            <p className="text-sm">{comp.trustDepth} hops</p>
          </div>
          <div>
            <p className="text-[#555] text-xs uppercase mb-1">Ecosystem</p>
            <p className="text-sm">{comp.ecosystem}</p>
          </div>
          <div>
            <p className="text-[#555] text-xs uppercase mb-1">License</p>
            <p className="text-sm">{comp.license || "Unknown"}</p>
          </div>
        </div>

        <div className="p-4 border-b border-[#1a1a1a]">
          <h4 className="text-xs uppercase tracking-wider text-[#888] mb-3 font-mono">
            CVES DETECTED ({comp.cves.length})
          </h4>
          {comp.cves.length === 0 ? (
            <p className="text-[#00FF41] text-sm text-center py-4 font-mono">✅ No vulnerabilities</p>
          ) : (
            <div className="space-y-3">
              {comp.cves.slice(0, 3).map((cve) => <CVECard key={cve.id} cve={cve} />)}
            </div>
          )}
        </div>

        {comp.cves.length > 0 && (
          <div className="p-4 space-y-3">
            {/* BLAST RADIUS BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => triggerBlast(comp.id)}
              className="w-full py-3 rounded-xl font-bold text-sm pulse-red text-white font-mono uppercase tracking-wider"
              style={{ background: "linear-gradient(90deg, #FF003C, #cc0030)" }}
            >
              ⚠️ SIMULATE CASCADE BREACH
            </motion.button>

            {/* AI REMEDIATION */}
            {!remediation ? (
              <button onClick={handleGetRemediation} disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm font-mono"
                style={{ background: loading ? "#1a1a1a" : "#8b5cf6", color: "white" }}>
                {loading ? "🤖 ANALYZING..." : "⊕ GET AI REMEDIATION"}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass border border-purple-500/30 rounded-xl p-4 space-y-3">
                <h4 className="text-purple-400 font-semibold text-sm font-mono">🤖 AI REMEDIATION</h4>
                <p className="text-[#aaa] text-xs leading-relaxed">{remediation.explanation}</p>
                <div>
                  <p className="text-[#555] text-xs mb-1 font-mono">SAFE ALTERNATIVE:</p>
                  <p className="text-[#00FF41] text-xs font-mono">{remediation.safeAlternative}</p>
                </div>
                <div>
                  <p className="text-[#555] text-xs mb-1 font-mono">PATCH COMMAND:</p>
                  <code className="bg-black text-[#00FF41] text-xs p-2 rounded block font-mono">
                    $ {remediation.patchCommand}
                  </code>
                </div>
              </motion.div>
            )}

            {/* ISOLATE BUTTON */}
            <button
              onClick={() => isolateNode(comp.id)}
              disabled={isIsolated}
              className="w-full border border-[#333] text-[#888] py-3 rounded-xl text-sm hover:border-[#00FF41] hover:text-[#00FF41] disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase"
            >
              {isIsolated ? "✓ ISOLATED" : "⚡ ISOLATE NODE"}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function CVECard({ cve }: { cve: CVE }) {
  const color = cve.severity === "CRITICAL" ? "#FF003C" :
                cve.severity === "HIGH" ? "#ff8800" : "#ffcc00";
  return (
    <div className="rounded-lg p-3 border" style={{ borderColor: color + "33", background: color + "08" }}>
      <div className="flex items-center justify-between mb-1">
        <a href={cve.url} target="_blank" rel="noopener noreferrer"
          className="font-mono text-sm font-bold hover:underline" style={{ color }}>
          {cve.id}
        </a>
        <span className="text-xs font-bold px-2 py-0.5 rounded font-mono"
          style={{ background: color + "22", color }}>{cve.score}</span>
      </div>
      <p className="text-[#888] text-xs">{cve.description}</p>
    </div>
  );
}