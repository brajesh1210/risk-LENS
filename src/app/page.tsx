"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden font-sans">
      {/* Dynamic Cursor Spotlight Tracker */}
      <div
        className="fixed pointer-events-none z-0 w-96 h-96 rounded-full opacity-[0.07] blur-3xl hidden md:block"
        style={{
          background: "radial-gradient(circle, #00FF41 0%, transparent 70%)",
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          transition: "left 0.1s ease-out, top 0.1s ease-out",
        }}
      />

      {/* Navigation Header HUD */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-[#000000]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_10px_#00FF41]" />
            <span className="font-mono font-bold text-xl tracking-tight uppercase">
              risk<span className="text-[#00FF41]">LENS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-mono text-neutral-400">
            <a href="#features" className="hover:text-[#00FF41] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#00FF41] transition-colors">How It Works</a>
            <Link href="/settings" className="hover:text-[#00FF41] transition-colors">Settings</Link>
          </div>
          <Link href="/analyze">
            <button className="bg-[#00FF41] text-black font-mono font-bold px-5 h-10 rounded-md text-xs uppercase tracking-wider hover:bg-[#00CC33] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all duration-300">
              Analyze Stack →
            </button>
          </Link>
        </div>
      </nav>

      {/* Tactical Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 lg:pt-0">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/[0.05]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse" />
              <span className="text-[#00FF41] text-xs font-mono uppercase tracking-widest">
                Supply Chain Threat Intelligence
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
              Your vendors <br />
              are your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF41] to-[#00CC33] filter drop-shadow-[0_0_30px_rgba(0,255,65,0.2)]">
                BIGGEST THREAT
              </span>
            </h1>

            <p className="text-neutral-400 text-base md:text-lg max-w-xl leading-relaxed">
              risk-LENS models your complete dependency infrastructure, ingests real-time CVE alerts, and visually exposes multi-tier system vulnerabilities before they cascade into a corporate data breach.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/analyze">
                <button className="bg-[#00FF41] text-black font-mono font-bold px-8 py-4 rounded-lg text-sm uppercase tracking-wider hover:bg-[#00CC33] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all duration-300 w-full sm:w-auto">
                  Launch Visualizer
                </button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <button className="border border-neutral-800 text-neutral-300 font-mono text-sm uppercase tracking-wider px-8 py-4 rounded-lg hover:border-[#00FF41] hover:text-white transition-all duration-300 w-full">
                  System Blueprint
                </button>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 text-neutral-500 font-mono text-xs border-t border-white/[0.03]">
              <span>[✓] Dynamic SBOM Ingestion</span>
              <span>[✓] Live OSV / NVD Sync</span>
              <span>[✓] Autonomous Remediation</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block w-full">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900/50 to-neutral-950/50 border border-white/[0.05] backdrop-blur-sm shadow-2xl shadow-emerald-950/10">
              <HeroGraph />
            </div>
          </div>
        </div>

        {/* Real-Time Operational Telemetry Stats */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.05] bg-[#000000]/80 backdrop-blur-md hidden md:block">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-4">
            {[
              { value: "480,000+", label: "Vulnerabilities Indexed" },
              { value: "99.4%", label: "Detection Precision" },
              { value: "Instantaneous", label: "Blast Radius Mapping" },
              { value: "Zero-Trust", label: "Architecture Model" },
            ].map((stat) => (
              <div key={stat.label} className="text-center border-r last:border-r-0 border-white/[0.05]">
                <div className="text-xl font-bold font-mono text-white tracking-tight">{stat.value}</div>
                <div className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modular Pipeline Architecture Execution Section */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.03] bg-gradient-to-b from-black to-neutral-950/40 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">System Triage Engine</h2>
            <p className="text-neutral-400 text-sm font-mono">// From raw package configuration files to mitigation workflows in 3 ticks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Infrastructure Ingestion", desc: "Upload package.json matrices or Software Bill of Materials (SBOM). Fully compatible with CycloneDX, SPDX schemas, or custom JSON stack files.", color: "#00FF41" },
              { step: "02", title: "Cascade Topology Assessment", desc: "Cross-references global OSV registries. Computes geometric spatial layers and concentric trust rings based on direct and transitive dependency depths.", color: "#8b5cf6" },
              { step: "03", title: "Targeted Countermeasures", desc: "Exposes clear prioritized CVE maps, launches Gemini AI patch commands, isolates system risk loops, and compiles enterprise risk data reports.", color: "#FF003C" },
            ].map((item) => (
              <div key={item.step} className="bg-neutral-900/30 border border-white/[0.03] rounded-2xl p-8 hover:border-neutral-800 transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-6xl font-black opacity-5 font-mono select-none group-hover:opacity-10 transition-opacity duration-300" style={{ color: item.color }}>
                  {item.step}
                </div>
                <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center border border-white/[0.05] font-mono text-xs font-bold mb-6" style={{ color: item.color }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-3 tracking-tight">{item.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Security Controls Grid */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.05] bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📡", title: "Live CVE Sweep", desc: "Real-time automated sync with NVD and Google OSV database structures." },
              { icon: "🛡️", title: "Cascade Visualizer", desc: "Simulate threat propagation routes along dependency trust lines." },
              { icon: "🤖", title: "AI-Powered Remediation", desc: "Gemini architecture isolates infected scopes and delivers clean upgrades." },
              { icon: "📋", title: "Telemetry Audits", desc: "Compile complete vulnerability maps and business impact logs seamlessly." },
            ].map((f) => (
              <div key={f.title} className="bg-neutral-950 border border-white/[0.03] rounded-xl p-6 hover:border-[#00FF41]/20 transition-all duration-300">
                <div className="text-2xl mb-4 bg-neutral-900 w-10 h-10 rounded-lg border border-white/[0.05] flex items-center justify-center">{f.icon}</div>
                <h3 className="font-bold mb-2 tracking-tight text-white">{f.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Defensive Call to Action Container */}
      <section className="py-28 px-6 border-t border-white/[0.03] relative overflow-hidden bg-gradient-to-b from-neutral-950 to-black">
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Map out your structural vulnerabilities <span className="text-[#00FF41]">clearly.</span>
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Verify supply chain configurations instantaneously. Free open platform. No authentication keys required.
          </p>
          <div className="pt-4">
            <Link href="/analyze">
              <button className="bg-[#00FF41] text-black font-mono font-bold px-10 py-4 rounded-lg text-sm uppercase tracking-wider hover:bg-[#00CC33] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)] transition-all duration-300">
                Execute Security Scan
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Interface Wrapper */}
      <footer className="border-t border-white/[0.05] py-8 px-6 bg-black font-mono text-neutral-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
            <span className="font-bold text-neutral-400 text-sm tracking-tight uppercase">
              risk<span className="text-[#00FF41]">LENS</span>
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-center sm:text-right">
            © {new Date().getFullYear()} risk-LENS. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-wider text-neutral-500">
            Secure Engine // OSV Core · Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeroGraph() {
  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      <svg className="w-full h-full max-w-[420px]" viewBox="0 0 500 400">
        <line x1="250" y1="200" x2="100" y2="100" stroke="#00FF41" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
        <line x1="250" y1="200" x2="400" y2="120" stroke="#FF003C" strokeWidth="2" opacity="0.5" />
        <line x1="250" y1="200" x2="380" y2="310" stroke="#ff8800" strokeWidth="1.5" opacity="0.4" />
        <line x1="250" y1="200" x2="120" y2="320" stroke="#333333" strokeWidth="1" opacity="0.3" />

        <circle cx="250" cy="200" r="32" fill="#000000" stroke="#00FF41" strokeWidth="2" filter="drop-shadow(0 0 10px rgba(0,255,65,0.2))" />
        <text x="250" y="203" textAnchor="middle" fill="#00FF41" fontSize="9" fontFamily="monospace" fontWeight="bold">CORE_ORG</text>

        <circle cx="100" cy="100" r="24" fill="#000000" stroke="#00FF41" strokeWidth="1.5" className="animate-pulse" />
        <text x="100" y="140" textAnchor="middle" fill="#666" fontSize="10" fontFamily="monospace">AWS_SDK</text>

        <circle cx="400" cy="120" r="28" fill="#000000" stroke="#FF003C" strokeWidth="2" filter="drop-shadow(0 0 15px rgba(255,0,60,0.3))" />
        <text x="400" y="160" textAnchor="middle" fill="#FF003C" fontSize="10" fontFamily="monospace" fontWeight="bold">log4j_core</text>
        <text x="400" y="124" textAnchor="middle" fill="white" fontSize="11" fontFamily="monospace" fontWeight="black">10.0</text>

        <circle cx="380" cy="310" r="22" fill="#000000" stroke="#ff8800" strokeWidth="1.5" />
        <text x="380" y="348" textAnchor="middle" fill="#ff8800" fontSize="10" fontFamily="monospace">lodash</text>

        <circle cx="120" cy="320" r="18" fill="#000000" stroke="#333333" strokeWidth="1" />
        <text x="120" y="356" textAnchor="middle" fill="#555" fontSize="10" fontFamily="monospace">prisma</text>
      </svg>
    </div>
  );
}