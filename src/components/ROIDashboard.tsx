"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysisStore } from "@/store/analysisStore";
import { calculateROI, formatCurrency } from "@/lib/roiCalculator";

export function ROIDashboard() {
  const { showROIDashboard, toggleROIDashboard, currentAnalysis } = useAnalysisStore();

  if (!currentAnalysis) return null;
  const roi = calculateROI(currentAnalysis);

  return (
    <AnimatePresence>
      {showROIDashboard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90] flex items-center justify-center p-8"
          onClick={toggleROIDashboard}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-[#00FF41]/20"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[#00FF41] text-xs uppercase tracking-widest font-mono mb-1">
                  ENTERPRISE ROI METRICS
                </p>
                <h2 className="text-3xl font-black">Financial Impact Analysis</h2>
              </div>
              <button onClick={toggleROIDashboard} className="text-[#888] hover:text-white text-3xl">×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <ROICard
                label="Estimated Breach Liability"
                value={formatCurrency(roi.estimatedBreachCost)}
                color="#FF003C"
                desc="Total potential cost if all critical CVEs are exploited"
                icon="💰"
              />
              <ROICard
                label="Potential Regulatory Fines"
                value={formatCurrency(roi.potentialFineAmount)}
                color="#ff8800"
                desc="GDPR/HIPAA exposure based on critical vulnerabilities"
                icon="⚖️"
              />
              <ROICard
                label="Annual Savings with risk-LENS"
                value={formatCurrency(roi.annualSavings)}
                color="#00FF41"
                desc="Cost saved through automated vulnerability detection"
                icon="📈"
              />
              <ROICard
                label="Risk Reduction"
                value={`${roi.riskReductionPercentage}%`}
                color="#00FF41"
                desc="Decrease in breach likelihood after remediation"
                icon="🛡️"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard label="Compliance Hours Saved" value={`${roi.complianceHoursSaved}h`} />
              <StatCard label="Mean Time To Detect" value={`${roi.meanTimeToDetect}d`} />
              <StatCard label="Components Audited" value={currentAnalysis.summary.totalComponents.toString()} />
            </div>

            {/* Breakdown chart */}
            <div className="glass-red rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4 font-mono uppercase text-sm tracking-wider">Cost Breakdown by Severity</h3>
              <div className="space-y-3">
                <BreakdownBar
                  label="Critical Vulnerabilities"
                  count={currentAnalysis.summary.criticalCount}
                  cost={currentAnalysis.summary.criticalCount * 250_000}
                  color="#FF003C"
                />
                <BreakdownBar
                  label="High Vulnerabilities"
                  count={currentAnalysis.summary.highCount}
                  cost={currentAnalysis.summary.highCount * 100_000}
                  color="#ff8800"
                />
                <BreakdownBar
                  label="Medium Vulnerabilities"
                  count={currentAnalysis.summary.mediumCount}
                  cost={currentAnalysis.summary.mediumCount * 25_000}
                  color="#ffcc00"
                />
              </div>
            </div>

            <div className="bg-[#001a0d] border border-[#00FF41]/30 rounded-xl p-6 text-center">
              <p className="text-[#00FF41] text-sm font-mono mb-2">EXECUTIVE SUMMARY</p>
              <p className="text-2xl font-bold mb-2">
                Investing in risk-LENS saves your organization{" "}
                <span className="text-[#00FF41]">{formatCurrency(roi.annualSavings)}</span> annually
              </p>
              <p className="text-[#888]">
                while reducing breach liability by{" "}
                <span className="text-[#00FF41] font-bold">{roi.riskReductionPercentage}%</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ROICard({ label, value, color, desc, icon }: { label: string; value: string; color: string; desc: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-xl p-6 border"
      style={{ borderColor: color + "33" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[#555] text-xs uppercase tracking-wider font-mono mb-1">{label}</p>
          <p className="text-3xl font-black font-mono" style={{ color }}>{value}</p>
        </div>
        <span className="text-3xl opacity-50">{icon}</span>
      </div>
      <p className="text-[#888] text-xs">{desc}</p>
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <p className="text-2xl font-black text-white font-mono">{value}</p>
      <p className="text-[#555] text-xs uppercase tracking-wider font-mono mt-1">{label}</p>
    </div>
  );
}

function BreakdownBar({ label, count, cost, color }: { label: string; count: number; cost: number; color: string }) {
  const max = 5_000_000;
  const pct = Math.min((cost / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1 font-mono">
        <span className="text-[#888]">{label} ({count})</span>
        <span style={{ color }}>{formatCurrency(cost)}</span>
      </div>
      <div className="bg-[#1a1a1a] rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-2 rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}