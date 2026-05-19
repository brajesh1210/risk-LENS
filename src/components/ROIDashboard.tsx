"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysisStore } from "@/store/analysisStore";
import { X, TrendingDown, Clock, ShieldCheck, AlertTriangle } from "lucide-react";

export function ROIDashboard() {
  const { showROIDashboard, toggleROIDashboard, currentAnalysis } = useAnalysisStore();

  if (!currentAnalysis) return null;

  // Extract dynamic values from the parsed JSON
  const totalComponents = currentAnalysis.summary.totalComponents || 0;
  const criticalCount = currentAnalysis.summary.criticalCount || 0;
  const highCount = currentAnalysis.summary.highCount || 0;
  const mediumCount = currentAnalysis.summary.mediumCount || 0;

  // Cost of manual audit: ~$150/hr, takes ~2 hours per component to manually map
  const manualAuditHours = totalComponents * 2;
  const manualAuditCost = manualAuditHours * 150;

  // Dynamic liability calculation so it never evaluates to 0.0M
  // Includes a base risk factor + severity multipliers
  const potentialLiability = 50000 + (criticalCount * 250000) + (highCount * 100000) + (mediumCount * 25000);

  // Formatter to scale between K and M beautifully
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val}`;
  };

  return (
    <AnimatePresence>
      {showROIDashboard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // THE FIX: Inline high z-index and thick 95% black background to nuke graph bleed-through
          style={{ zIndex: 999999 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            style={{ zIndex: 1000000 }}
            className="w-full max-w-5xl bg-[#0a0a0a] border border-white/[0.15] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh] relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.1] bg-[#050505]">
              <div>
                <h2 className="text-2xl font-black font-mono tracking-tight text-white flex items-center gap-3">
                  <span className="text-purple-500">💰</span> ENTERPRISE ROI METRICS
                </h2>
                <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mt-1">
                  Financial telemetry & risk liability projections
                </p>
              </div>
              <button
                onClick={toggleROIDashboard}
                className="p-2 bg-neutral-900 hover:bg-[#FF003C] hover:text-white text-neutral-400 rounded-lg transition-colors border border-white/[0.1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 bg-[#0a0a0a]">

              {/* Top Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Restored Pink/Red Box styling */}
                <div className="bg-[#111111] border border-[#FF003C]/40 rounded-xl p-6 relative overflow-hidden group hover:border-[#FF003C] transition-colors shadow-[0_0_20px_rgba(255,0,60,0.08)]">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertTriangle className="w-24 h-24 text-[#FF003C]" />
                  </div>
                  <p className="text-[#FF003C] font-mono text-[10px] uppercase tracking-widest mb-2 font-bold">Estimated Breach Liability</p>
                  <div className="text-4xl font-black font-mono text-[#FF003C] tracking-tighter">
                    {formatCurrency(potentialLiability)}
                  </div>
                  <p className="text-neutral-400 text-xs mt-2 font-mono">Based on {criticalCount} critical, {highCount} high CVEs</p>
                </div>

                <div className="bg-[#111111] border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.05)]">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-24 h-24 text-purple-500" />
                  </div>
                  <p className="text-purple-500 font-mono text-[10px] uppercase tracking-widest mb-2 font-bold">Compliance Hours Saved</p>
                  <div className="text-4xl font-black font-mono text-purple-500 tracking-tighter">
                    {manualAuditHours}<span className="text-2xl">hrs</span>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2 font-mono">Automated vs manual dependency mapping</p>
                </div>

                <div className="bg-[#111111] border border-[#00FF41]/30 rounded-xl p-6 relative overflow-hidden group hover:border-[#00FF41] transition-colors shadow-[0_0_20px_rgba(0,255,65,0.05)]">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingDown className="w-24 h-24 text-[#00FF41]" />
                  </div>
                  <p className="text-[#00FF41] font-mono text-[10px] uppercase tracking-widest mb-2 font-bold">Audit Capital Saved</p>
                  <div className="text-4xl font-black font-mono text-[#00FF41] tracking-tighter">
                    ${(manualAuditCost / 1000).toFixed(1)}k
                  </div>
                  <p className="text-neutral-400 text-xs mt-2 font-mono">In saved security consulting fees</p>
                </div>
              </div>

              {/* Chart / Detailed Breakdown area */}
              <div className="border border-white/[0.1] bg-[#111111] rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-white/[0.1] bg-[#050505]">
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">Operational Cost Analysis</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-mono text-sm text-white">Manual Security Audit (Legacy)</div>
                        <div className="font-mono text-xs text-neutral-500">Traditional consulting approach mapping {totalComponents} nodes</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg font-bold text-neutral-400">${manualAuditCost.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="w-full h-px bg-white/[0.1]" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-mono text-sm text-[#00FF41] flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" /> risk-LENS Autonomous Audit
                        </div>
                        <div className="font-mono text-xs text-neutral-500">Real-time OSV mapping & AI patching integration</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg font-bold text-[#00FF41]">$0.00</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#00FF41]/10 border-t border-[#00FF41]/30">
                  <p className="text-[#00FF41] font-mono text-xs text-center uppercase tracking-widest font-bold">
                    Immediate ROI: 100% Capital Efficiency
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}