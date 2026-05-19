"use client";
import { useEffect, useState, useRef } from "react";
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
  const [graphMode, setGraphMode] = useState<"3d" | "2d">("3d");

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
    if (!currentAnalysis) {
      router.push("/analyze");
      return;
    }
    // Read the settings from local storage to determine the view mode
    const savedMode = localStorage.getItem("riskLens_graphLayer");
    if (savedMode === "2d") {
      setGraphMode("2d");
    }
  }, [currentAnalysis, router]);

  if (!currentAnalysis) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888] font-mono tracking-widest text-sm uppercase">Loading Data Matrix...</p>
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
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-[#050505] z-30 flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_8px_#00FF41]" />
            <span className="font-bold text-sm font-mono tracking-tight uppercase text-white">
              risk<span className="text-[#00FF41]">LENS</span>
            </span>
          </Link>
          <div className="text-[#444]">|</div>
          <span className="text-neutral-400 text-sm font-mono tracking-wide">📄 {currentAnalysis.name}.json</span>
          <div className="text-[#444]">|</div>
          <span className="text-[#00FF41] text-xs font-mono uppercase border border-[#00FF41]/30 bg-[#00FF41]/10 px-2 py-0.5 rounded">
            MODE: {graphMode.toUpperCase()}
          </span>
        </div>

        {/* Risk Score Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono"
          style={{ borderColor: overallColor + "44", background: overallColor + "11" }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: overallColor }} />
          <span className="font-bold tracking-wider text-xs" style={{ color: overallColor }}>
            SCORE: {currentAnalysis.overallRiskScore.toFixed(1)}{" "}
            {currentAnalysis.overallRiskScore >= 9 ? "CRITICAL" : currentAnalysis.overallRiskScore >= 7 ? "HIGH" : "MEDIUM"}
          </span>
        </motion.div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScanActive(true)}
            className="border border-[#333] text-white text-xs px-3 py-2 rounded-lg hover:border-[#00FF41] hover:bg-[#00FF41]/10 transition-colors font-mono tracking-wider"
          >
            🔍 SCAN
          </button>
          <button
            onClick={toggleConsole}
            className="border border-[#333] text-white text-xs px-3 py-2 rounded-lg hover:border-[#00FF41] hover:bg-[#00FF41]/10 transition-colors font-mono tracking-wider"
          >
            ▸ CONSOLE (Ctrl+\)
          </button>
          <button
            onClick={toggleROIDashboard}
            className="bg-purple-600/20 border border-purple-500 text-purple-400 text-xs px-3 py-2 rounded-lg hover:bg-purple-600/40 hover:text-white transition-colors font-mono font-bold tracking-wider"
          >
            💰 ROI METRICS
          </button>
          <Link href="/report">
            <button className="bg-[#00FF41] text-black text-xs px-4 py-2 rounded-lg font-bold hover:bg-[#00cc33] transition-colors hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] font-mono tracking-wider">
              EXPORT ↓
            </button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <aside className="w-72 bg-[#050505] border-r border-[#1a1a1a] flex flex-col overflow-y-auto flex-shrink-0 z-20 shadow-2xl">
          {/* Health Index Widget */}
          <div className="p-5 border-b border-[#1a1a1a]">
            <p className="text-[10px] uppercase tracking-widest text-[#555] mb-3 font-mono">
              INFRASTRUCTURE HEALTH
            </p>
            <motion.div
              key={healthIndex}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-5xl font-black font-mono mb-2 tracking-tighter"
              style={{ color: healthColor }}
            >
              {healthIndex}%
            </motion.div>
            <div className="bg-[#1a1a1a] rounded-full h-1.5 mb-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthIndex}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-1.5 rounded-full"
                style={{ background: healthColor, boxShadow: `0 0 10px ${healthColor}` }}
              />
            </div>
            {healthIndex < 40 && (
              <p className="text-[#FF003C] text-[10px] font-mono font-bold animate-pulse tracking-widest uppercase">⚠ CRITICAL SYSTEM STATE</p>
            )}
          </div>

          {/* Risk Overview */}
          <div className="p-5 border-b border-[#1a1a1a]">
            <p className="text-[10px] uppercase tracking-widest text-[#555] mb-3 font-mono">RISK OVERVIEW</p>
            <div className="text-5xl font-black mb-2 font-mono tracking-tighter" style={{ color: overallColor }}>
              {currentAnalysis.overallRiskScore.toFixed(1)}
            </div>
            <div className="text-[10px] font-bold uppercase px-2 py-1 rounded inline-block mb-4 font-mono tracking-widest"
              style={{ background: overallColor + "22", color: overallColor, border: `1px solid ${overallColor}44` }}>
              {currentAnalysis.overallRiskScore >= 9 ? "CRITICAL" : currentAnalysis.overallRiskScore >= 7 ? "HIGH" : "MEDIUM"}
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono border-t border-[#1a1a1a] pt-4 mt-2">
              <div>
                <div className="text-xl font-bold text-white tracking-tight">{currentAnalysis.summary.totalComponents}</div>
                <div className="text-[#555] text-[10px] tracking-widest mt-1">NODES</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white tracking-tight">{currentAnalysis.summary.totalCVEs}</div>
                <div className="text-[#555] text-[10px] tracking-widest mt-1">CVES</div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="p-5 border-b border-[#1a1a1a]">
            <p className="text-[10px] uppercase tracking-widest text-[#555] mb-3 font-mono">THREAT TOPOLOGY</p>
            <div className="space-y-2">
              {[
                { label: "Critical Level", count: currentAnalysis.summary.criticalCount, color: "#FF003C" },
                { label: "High Level", count: currentAnalysis.summary.highCount, color: "#ff8800" },
                { label: "Medium Level", count: currentAnalysis.summary.mediumCount, color: "#ffcc00" },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-white/[0.02] font-mono text-xs">
                  <span className="text-neutral-400">{f.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{f.count}</span>
                    <div className="w-2 h-2 rounded-full" style={{ background: f.color, boxShadow: `0 0 5px ${f.color}` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flagged */}
          <div className="p-5 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-[#555] mb-3 font-mono">
              PRIORITY TARGETS ({criticalComponents.length})
            </p>
            <div className="space-y-2">
              {criticalComponents.map((comp) => (
                <FlaggedItem key={comp.id} component={comp} onClick={() => setSelectedComponent(comp)} />
              ))}
            </div>
          </div>

          {/* Help text */}
          <div className="p-4 border-t border-[#1a1a1a] bg-black">
            <p className="text-[#555] text-[10px] font-mono leading-relaxed tracking-wider">
              <span className="text-[#00FF41]">_TIP:</span> Press <kbd className="bg-[#1a1a1a] px-1 py-0.5 rounded border border-[#333] text-neutral-300">Ctrl+\</kbd> for terminal overlay
            </p>
          </div>
        </aside>

        {/* Main Canvas Viewport (Handles 3D or 2D based on Settings) */}
        <main className="flex-1 relative bg-black">
          {graphMode === "3d" ? <Scene3D /> : <Scene2D />}

          {/* Viewport Overlay Controls indicator */}
          <div className="absolute top-4 left-4 bg-neutral-950/80 border border-white/[0.05] backdrop-blur-md rounded-lg p-3 text-[10px] uppercase tracking-widest font-mono z-10 space-y-1.5">
            {graphMode === "3d" ? (
              <>
                <p className="text-neutral-400"><span className="text-[#00FF41]">L-CLICK + DRAG</span> // Rotate</p>
                <p className="text-neutral-400"><span className="text-[#00FF41]">SCROLL</span> // Zoom Axis</p>
                <p className="text-neutral-400"><span className="text-[#00FF41]">R-CLICK + DRAG</span> // Pan Space</p>
              </>
            ) : (
              <>
                <p className="text-neutral-400"><span className="text-[#00FF41]">SCROLL</span> // Pan Canvas</p>
                <p className="text-neutral-400"><span className="text-[#00FF41]">CLICK</span> // Inspect Node</p>
              </>
            )}
          </div>

          {/* Emergency Alert indicator */}
          {isBlastSimulating && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#FF003C]/90 backdrop-blur-md border border-[#FF003C] text-white px-8 py-3 rounded-lg font-mono text-sm tracking-widest shadow-[0_0_40px_rgba(255,0,60,0.4)] z-50 uppercase font-black"
            >
              ⚠ SYSTEM BREACH — CASCADE FAILURE IMMINENT
            </motion.div>
          )}

          {/* Details Flyout */}
          <DetailPanel />
        </main>
      </div>

      {/* Live Feed Ticker Bottom Bar */}
      <div className="h-8 bg-[#050505] border-t border-[#1a1a1a] overflow-hidden flex items-center flex-shrink-0 z-30">
        <div className="text-[#00FF41] text-[10px] uppercase tracking-widest px-4 border-r border-[#1a1a1a] flex-shrink-0 font-mono font-bold flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse" />
          ACTIVE TELEMETRY
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="ticker-content flex gap-12 whitespace-nowrap text-xs py-2 font-mono">
            {currentAnalysis.components
              .filter((c) => c.cves.length > 0)
              .slice(0, 10)
              .flatMap((c) =>
                c.cves.slice(0, 2).map((cve) => ({
                  text: `[${cve.id}] in ${c.name} (CVSS: ${cve.score})`,
                  color: cve.severity === "CRITICAL" ? "#FF003C" :
                    cve.severity === "HIGH" ? "#ff8800" : "#ffcc00",
                }))
              )
              .map((item, i) => (
                <span key={i} style={{ color: item.color }} className="flex-shrink-0 tracking-wide">
                  <span className="opacity-50 mr-2">»</span>{item.text}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Overlays */}
      <CommandConsole />
      <ROIDashboard />
    </div>
  );
}

// ---------------------------------------------------------
// COMPONENT: Item in the sidebar flag list
// ---------------------------------------------------------
function FlaggedItem({ component, onClick }: { component: Component; onClick: () => void }) {
  const color = component.status === "CRITICAL" ? "#FF003C" :
    component.status === "HIGH" ? "#ff8800" : "#ffcc00";
  const topCVE = component.cves[0];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="w-full text-left bg-neutral-950 border border-[#1a1a1a] rounded-lg p-3 hover:border-[#00FF41]/40 transition-all group"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-white text-xs font-bold font-mono tracking-tight truncate group-hover:text-[#00FF41] transition-colors">
          {component.name}
        </span>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
      </div>
      <div className="text-neutral-500 text-[10px] font-mono tracking-widest uppercase mb-1">v{component.version}</div>
      {topCVE && (
        <p className="text-[#FF003C] text-[10px] font-mono tracking-widest truncate">{topCVE.id}</p>
      )}
    </motion.button>
  );
}

// ---------------------------------------------------------
// COMPONENT: The New 2D Flat Tree Renderer Fallback (WITH PERFECT SVG MATH)
// ---------------------------------------------------------
function Scene2D() {
  const { currentAnalysis, setSelectedComponent, isolatedNodes } = useAnalysisStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<{ id: string; d: string; color: string; opacity: number }[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!currentAnalysis) return;

    const drawEdges = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newEdges: any[] = [];

      currentAnalysis.edges.forEach((edge) => {
        const sourceEl = document.getElementById(`node-2d-${edge.source}`);
        const targetEl = document.getElementById(`node-2d-${edge.target}`);

        if (sourceEl && targetEl) {
          const sourceRect = sourceEl.getBoundingClientRect();
          const targetRect = targetEl.getBoundingClientRect();

          // Calculate precise center points relative to the scrolling canvas area
          const x1 = sourceRect.right - containerRect.left + container.scrollLeft;
          const y1 = sourceRect.top + (sourceRect.height / 2) - containerRect.top + container.scrollTop;

          const x2 = targetRect.left - containerRect.left + container.scrollLeft;
          const y2 = targetRect.top + (targetRect.height / 2) - containerRect.top + container.scrollTop;

          const targetNode = currentAnalysis.components.find((c) => c.id === edge.target);
          const color = targetNode?.status === "CRITICAL" ? "#FF003C" : targetNode?.status === "HIGH" ? "#ff8800" : "#00FF41";
          const isIsolated = isolatedNodes.has(edge.target) || isolatedNodes.has(edge.source);

          // Organic Bezier Curve path creation
          const curvature = 0.4;
          const hx1 = x1 + Math.abs(x2 - x1) * curvature;
          const hx2 = x2 - Math.abs(x2 - x1) * curvature;
          const d = `M ${x1} ${y1} C ${hx1} ${y1}, ${hx2} ${y2}, ${x2} ${y2}`;

          newEdges.push({
            id: `${edge.source}-${edge.target}`,
            d,
            color: isIsolated ? "#333333" : color,
            opacity: isIsolated ? 0.2 : 0.6,
          });
        }
      });

      setEdges(newEdges);
      setSvgSize({ w: container.scrollWidth, h: container.scrollHeight });
    };

    // Delay drawing slightly to ensure the DOM nodes are fully rendered before calculating positions
    const timer = setTimeout(drawEdges, 150);
    window.addEventListener("resize", drawEdges);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", drawEdges);
    };
  }, [currentAnalysis, isolatedNodes]);

  if (!currentAnalysis) return null;

  const orgComponent: Component = {
    id: "org-root",
    name: "CORE_ORG",
    version: "internal",
    type: "Organization",
    ecosystem: "",
    trustDepth: 0,
    cves: [],
    riskScore: 0,
    status: "SAFE",
    position3D: { x: 0, y: 0, z: 0 },
  };

  const allNodes = [orgComponent, ...currentAnalysis.components];
  const maxDepth = Math.max(...allNodes.map((n) => n.trustDepth || 0));
  const depthsArray = Array.from({ length: maxDepth + 1 }, (_, i) => i);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[#000000] overflow-auto p-12 flex items-center gap-32 z-0 relative">
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `radial-gradient(#00FF41 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

      {/* SVG Canvas for Connectors */}
      <svg className="absolute top-0 left-0 pointer-events-none z-0" width={svgSize.w || '100%'} height={svgSize.h || '100%'}>
        {edges.map((edge) => (
          <path
            key={edge.id}
            d={edge.d}
            stroke={edge.color}
            strokeWidth="2"
            fill="none"
            opacity={edge.opacity}
            strokeDasharray={edge.color === "#333333" ? "4 4" : "none"}
            className="transition-all duration-500"
          />
        ))}
      </svg>

      {/* Map Nodes */}
      {depthsArray.map((depth) => {
        const layerNodes = allNodes.filter((n) => (n.trustDepth || 0) === depth);
        if (layerNodes.length === 0) return null;

        return (
          <div key={`depth-${depth}`} className="flex flex-col gap-6 relative z-10 min-w-[240px]">
            <div className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest text-center border-b border-[#1a1a1a] pb-2 mb-2">
              {depth === 0 ? "INTERNAL PERIMETER" : `TRUST DEPTH LEVEL: ${depth}`}
            </div>

            {layerNodes.map((node) => {
              const isIsolated = isolatedNodes.has(node.id);
              const isVuln = node.status === "CRITICAL" || node.status === "HIGH";
              const color = node.status === "CRITICAL" ? "#FF003C" : node.status === "HIGH" ? "#ff8800" : "#00FF41";

              return (
                <motion.button
                  key={node.id}
                  id={`node-2d-${node.id}`}
                  onClick={() => setSelectedComponent(node)}
                  whileHover={{ scale: 1.05 }}
                  className={`relative p-4 rounded-xl border text-left transition-all backdrop-blur-md ${isIsolated ? "opacity-30 border-[#333] bg-black" : "bg-neutral-950/80"
                    }`}
                  style={{
                    borderColor: isIsolated ? "#333" : color + "55",
                    boxShadow: isVuln && !isIsolated ? `0 0 20px ${color}15, inset 0 0 10px ${color}10` : "none",
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono text-sm font-bold text-white truncate max-w-[160px] tracking-tight">
                      {node.name}
                    </div>
                    {!isIsolated && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                    )}
                  </div>

                  <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                    {node.type} {node.version && `// v${node.version}`}
                  </div>

                  {!isIsolated && node.cves.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.05] flex justify-between items-center">
                      <span className="text-[10px] font-mono tracking-widest font-bold" style={{ color }}>
                        {node.cves.length} EXPLOITS
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 font-bold">CVSS {Math.max(...node.cves.map(c => c.score || 0)).toFixed(1)}</span>
                    </div>
                  )}

                  {isIsolated && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl backdrop-blur-sm">
                      <span className="text-[#00FF41] font-mono text-xs font-bold uppercase tracking-widest border border-[#00FF41]/30 bg-[#00FF41]/10 px-3 py-1 rounded">
                        Isolated
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}