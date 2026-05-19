"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, Monitor, Key, Database, ArrowLeft, CheckCircle2, ShieldAlert, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("visuals");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [graphLayer, setGraphLayer] = useState("3d");
  const [osvKey, setOsvKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedAnim = localStorage.getItem("riskLens_animations");
    if (savedAnim !== null) setAnimationsEnabled(savedAnim === "true");
    const savedLayer = localStorage.getItem("riskLens_graphLayer");
    if (savedLayer) setGraphLayer(savedLayer);
  }, []);

  const handleSave = () => {
    localStorage.setItem("riskLens_animations", animationsEnabled.toString());
    localStorage.setItem("riskLens_graphLayer", graphLayer);

    // Trigger success feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const tabs = [
    { id: "visuals", label: "Visuals & Engine", icon: Monitor },
    { id: "api", label: "API & Authentication", icon: Key },
    { id: "system", label: "System Preferences", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-[#000000]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-neutral-900 rounded-lg transition-colors border border-transparent hover:border-white/[0.05]">
              <ArrowLeft className="w-5 h-5 text-neutral-400 hover:text-white" />
            </Link>
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[#00FF41]" />
              <span className="font-mono font-bold text-lg tracking-tight uppercase">
                Configuration <span className="text-neutral-500">// settings.sh</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-3 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all duration-300 ${isActive
                    ? "bg-neutral-900 border border-[#00FF41]/30 text-[#00FF41]"
                    : "bg-transparent border border-transparent text-neutral-400 hover:bg-neutral-950 hover:text-white"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#00FF41]" : "text-neutral-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-9">
          <div className="bg-neutral-950/50 border border-white/[0.05] rounded-2xl p-8 backdrop-blur-sm min-h-[500px] flex flex-col justify-between">

            <div className="flex-1">
              {activeTab === "visuals" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Viewport & Graphics</h2>
                    <p className="text-neutral-400 text-sm">Configure the performance and rendering outputs of the 3D topology matrix.</p>
                  </div>
                  <div className="space-y-4">
                    <label className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Default Graph Topology Layer</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setGraphLayer("3d")}
                        className={`flex flex-col items-start p-5 rounded-xl border transition-all duration-300 ${graphLayer === "3d" ? "bg-neutral-900 border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.1)]" : "bg-black border-white/[0.05] hover:border-neutral-700"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <span className={`font-bold ${graphLayer === "3d" ? "text-white" : "text-neutral-400"}`}>3D Orbital Matrix</span>
                          {graphLayer === "3d" && <CheckCircle2 className="w-5 h-5 text-[#00FF41]" />}
                        </div>
                        <p className="text-xs text-neutral-500 text-left">Hardware-accelerated WebGL spatial rendering with trust-chain depth axes.</p>
                      </button>
                      <button
                        onClick={() => setGraphLayer("2d")}
                        className={`flex flex-col items-start p-5 rounded-xl border transition-all duration-300 ${graphLayer === "2d" ? "bg-neutral-900 border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.1)]" : "bg-black border-white/[0.05] hover:border-neutral-700"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <span className={`font-bold ${graphLayer === "2d" ? "text-white" : "text-neutral-400"}`}>2D Flat Tree</span>
                          {graphLayer === "2d" && <CheckCircle2 className="w-5 h-5 text-[#00FF41]" />}
                        </div>
                        <p className="text-xs text-neutral-500 text-left">Optimized hierarchical node map for lower-end hardware compatibility.</p>
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-px bg-white/[0.05]" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="font-mono text-sm text-white">Enable Threat Animations</label>
                      <p className="text-xs text-neutral-500">Allow shader glitches and pulse shockwaves during simulated breaches.</p>
                    </div>
                    <button
                      onClick={() => setAnimationsEnabled(!animationsEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${animationsEnabled ? "bg-[#00FF41]" : "bg-neutral-700"
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition duration-200 ease-in-out ${animationsEnabled ? "translate-x-6" : "translate-x-1"
                        }`} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "api" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">External Integrations</h2>
                    <p className="text-neutral-400 text-sm">Manage API keys for live database querying and AI remediation tools.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Google OSV API Key (Optional)</label>
                      <input type="password" value={osvKey} onChange={(e) => setOsvKey(e.target.value)} placeholder="Leave blank for public unauthenticated queries..." className="w-full bg-black border border-white/[0.1] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00FF41] transition-colors text-white font-mono placeholder:text-neutral-700" />
                    </div>
                    <div className="space-y-3">
                      <label className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Google Gemini Agent Key</label>
                      <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIzaSyB..." className="w-full bg-black border border-white/[0.1] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00FF41] transition-colors text-white font-mono placeholder:text-neutral-700" />
                      <p className="text-xs text-[#FF003C] flex items-center gap-1 mt-2">
                        <ShieldAlert className="w-3 h-3" /> Note: Keys are stored entirely in local browser memory.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "system" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Data Ingestion</h2>
                    <p className="text-neutral-400 text-sm">Configure how risk-LENS handles uploaded tech-stack files.</p>
                  </div>
                  <div className="bg-neutral-900 border border-white/[0.05] rounded-xl p-5">
                    <p className="text-sm text-neutral-400 mb-4">
                      Strict File Parsing is currently enabled. The system will reject SBOMs that do not conform strictly to CycloneDX or SPDX standards.
                    </p>
                    <button className="border border-neutral-700 text-white font-mono text-xs px-4 py-2 rounded hover:border-white transition-colors">
                      Disable Strict Mode
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Global Save Button */}
            <div className="mt-12 pt-6 border-t border-white/[0.05] flex justify-end">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 font-mono font-bold px-6 py-3 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${isSaved
                    ? "bg-[#00FF41] text-black border-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                    : "bg-white text-black hover:bg-neutral-300"
                  }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Settings Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save System Preferences
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}