"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAnalysisStore } from "@/store/analysisStore";

export default function SettingsPage() {
  const [layout, setLayout] = useState<"ORGANIC" | "HIERARCHICAL" | "RADIAL">("ORGANIC");
  const [animations, setAnimations] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [osvEnabled, setOsvEnabled] = useState(true);
  const [cleared, setCleared] = useState(false);
  const [activeTab, setActiveTab] = useState("Appearance");
  const { clearAnalysis } = useAnalysisStore();

  const handleClearCache = () => {
    clearAnalysis();
    if (typeof window !== "undefined") localStorage.clear();
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] glass">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <span className="font-bold text-sm font-mono">
              risk<span className="text-[#00FF41]">LENS</span>
            </span>
          </Link>
          <div className="text-[#444]">|</div>
          <h1 className="text-xl font-bold font-mono">Settings</h1>
        </div>
        <div className="w-8 h-8 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-xs font-bold text-[#00FF41] font-mono">
          JD
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 min-h-screen border-r border-[#1a1a1a] p-6 glass">
          <nav className="space-y-1 font-mono">
            {["Appearance", "Data Sources", "Export Defaults", "Notifications"].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  activeTab === item ? "bg-[#1a1a1a] text-[#00FF41]" : "text-[#888] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
            <div className="pt-4 border-t border-[#1a1a1a] mt-4">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#888] hover:text-white">
                About risk-LENS
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8 max-w-3xl">
          {/* Appearance */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-1 font-mono">Appearance</h2>
            <p className="text-[#888] text-sm mb-6">Customize how you visualize your supply chain risk.</p>

            <div className="glass border border-[#1a1a1a] rounded-2xl divide-y divide-[#1a1a1a]">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Graph Layout Default</h3>
                  <p className="text-[#555] text-sm">Select default force simulation.</p>
                </div>
                <div className="flex rounded-lg overflow-hidden border border-[#333]">
                  {(["ORGANIC", "HIERARCHICAL", "RADIAL"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLayout(l)}
                      className={`px-3 py-2 text-xs font-semibold font-mono transition-all ${
                        layout === l ? "bg-[#1a1a1a] text-white" : "text-[#555] hover:text-white"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Animations</h3>
                  <p className="text-[#555] text-sm">Enable pulsing nodes and flowing edges.</p>
                </div>
                <Toggle value={animations} onChange={setAnimations} />
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Reduced Motion</h3>
                  <p className="text-[#555] text-sm">Disable non-essential animations.</p>
                </div>
                <Toggle value={reducedMotion} onChange={setReducedMotion} />
              </div>
            </div>
          </motion.section>

          {/* Data Sources */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-1 font-mono">Data Sources</h2>
            <p className="text-[#00FF41] text-sm mb-6 font-mono">Manage vulnerability databases.</p>

            <div className="glass border border-[#1a1a1a] rounded-2xl divide-y divide-[#1a1a1a]">
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-lg">🔐</div>
                <div className="flex-1">
                  <h3 className="font-semibold">National Vulnerability Database (NVD)</h3>
                  <p className="text-[#00FF41] text-xs font-mono">API STATUS: CONNECTED</p>
                </div>
                <button className="border border-[#333] text-white text-xs px-3 py-2 rounded-lg hover:border-[#00FF41] font-mono">
                  CONFIGURE API KEY
                </button>
              </div>

              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-lg">🛡️</div>
                <div className="flex-1">
                  <h3 className="font-semibold">Open Source Vulnerabilities (OSV)</h3>
                  <p className="text-[#00FF41] text-xs font-mono">API STATUS: CONNECTED</p>
                </div>
                <Toggle value={osvEnabled} onChange={setOsvEnabled} />
              </div>

              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-lg">🤖</div>
                <div className="flex-1">
                  <h3 className="font-semibold">Gemini AI Remediation</h3>
                  <p className="text-[#00FF41] text-xs font-mono">API STATUS: CONNECTED</p>
                </div>
                <Toggle value={true} onChange={() => {}} />
              </div>
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-[#FF003C] mb-1 font-mono">Danger Zone</h2>
            <p className="text-[#888] text-sm mb-6">Irreversible actions.</p>

            <div className="glass-red rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#FF003C] font-mono">Clear Analysis Cache</h3>
                <p className="text-[#555] text-sm">Delete all cached vulnerability data.</p>
              </div>
              <button
                onClick={handleClearCache}
                className="border border-[#FF003C] text-[#FF003C] text-xs px-4 py-2 rounded-lg hover:bg-[#FF003C]/10 font-mono font-bold"
              >
                {cleared ? "✓ CLEARED" : "CLEAR CACHE"}
              </button>
            </div>
          </motion.section>
        </main>
      </div>

      <footer className="border-t border-[#1a1a1a] py-4 px-6 flex items-center justify-between font-mono">
        <p className="text-[#555] text-xs">RISK-LENS V1.4.2-STABLE</p>
        <div className="flex gap-6 text-[#555] text-xs">
          <a href="#" className="hover:text-white">DOCUMENTATION</a>
          <a href="#" className="hover:text-white">SUPPORT</a>
          <a href="#" className="hover:text-white">API REFERENCE</a>
        </div>
      </footer>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all ${value ? "bg-[#00FF41]" : "bg-[#333]"}`}
    >
      <motion.div
        animate={{ left: value ? 28 : 4 }}
        transition={{ type: "spring", damping: 20 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white"
      />
    </button>
  );
}