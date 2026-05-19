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
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      <div
        className="fixed pointer-events-none z-0 w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #00ff88 0%, transparent 70%)",
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          transition: "left 0.1s, top 0.1s",
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="font-bold text-lg">
              risk<span className="text-[#00ff88]">LENS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#888]">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <Link href="/settings" className="hover:text-white">Settings</Link>
          </div>
          <Link href="/analyze">
            <button className="bg-[#00ff88] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#00cc6a] transition-all">
              Analyze Stack →
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-[#00ff88] text-sm font-mono uppercase tracking-widest">
                Supply Chain Intelligence
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black leading-none mb-6">
              <span className="text-white">Your vendors</span><br />
              <span className="text-white">are your</span><br />
              <span className="text-[#00ff88]">biggest</span><br />
              <span className="text-[#00ff88]">THREAT</span>
            </h1>

            <p className="text-[#888] text-lg mb-8 max-w-lg leading-relaxed">
              risk-LENS maps your dependency chain, cross-references live CVE databases, and shows you exactly where your supply chain breaks.
            </p>

            <div className="flex gap-4">
              <Link href="/analyze">
                <button className="bg-[#00ff88] text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-[#00cc6a] transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]">
                  Analyze Your Stack →
                </button>
              </Link>
              <button className="border border-[#333] text-white px-8 py-4 rounded-xl text-lg hover:border-[#00ff88] transition-all">
                View Demo
              </button>
            </div>

            <div className="flex items-center gap-6 mt-8 text-[#555] text-sm">
              <span>✓ No account required</span>
              <span>✓ Live CVE data</span>
              <span>✓ AI remediation</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <HeroGraph />
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-8">
            {[
              { value: "240,000+", label: "Packages Indexed" },
              { value: "95%", label: "Detection Rate" },
              { value: "4.2min", label: "Avg Analysis Time" },
              { value: "Zero", label: "False Negatives" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[#555] text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Three steps to ownership.</h2>
            <p className="text-[#888]">From ingestion to remediation in under 5 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Import Your Stack", desc: "Upload package.json, SBOM, or enter manually. We handle CycloneDX, SPDX, and custom JSON.", color: "#00ff88" },
              { step: "02", title: "We Map & Assess", desc: "Cross-references OSV global vulnerability database and calculates blast radius.", color: "#8b5cf6" },
              { step: "03", title: "Get Actionable Insights", desc: "Prioritized CVE alerts, AI-powered fix commands, and exportable reports.", color: "#ff4444" },
            ].map((item) => (
              <div key={item.step} className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 hover:border-[#333] transition-all">
                <div className="text-6xl font-black mb-6 opacity-20" style={{ color: item.color }}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#888] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🔍", title: "Live CVE Scanning", desc: "Real-time OSV & NVD queries" },
            { icon: "🕸️", title: "Trust Chain Mapping", desc: "Visualize dependency depth" },
            { icon: "🤖", title: "AI Remediation", desc: "Gemini-powered fix suggestions" },
            { icon: "📊", title: "Risk Reports", desc: "PDF/CSV/JSON exports" },
          ].map((f) => (
            <div key={f.title} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#00ff88]/30 transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-[#888] text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">
            Start seeing your risk <span className="text-[#00ff88]">clearly.</span>
          </h2>
          <p className="text-[#888] mb-10 text-lg">
            Free to use. No account required. Live CVE data included.
          </p>
          <Link href="/analyze">
            <button className="bg-[#00ff88] text-black font-bold px-12 py-5 rounded-xl text-xl hover:bg-[#00cc6a] transition-all hover:shadow-[0_0_40px_rgba(0,255,136,0.5)]">
              Analyze Your Stack — It's Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-bold text-[#888] text-sm">
            risk<span className="text-[#00ff88]">LENS</span>
          </span>
          <p className="text-[#555] text-xs">
            Built by Lorem Ipsum · Ansh, Atharv, Brajesh
          </p>
          <p className="text-[#555] text-xs">Data from OSV · Gemini AI</p>
        </div>
      </footer>
    </div>
  );
}

function HeroGraph() {
  return (
    <div className="relative w-full h-96">
      <svg className="w-full h-full" viewBox="0 0 500 400">
        <line x1="250" y1="200" x2="100" y2="100" stroke="#00ff88" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
        <line x1="250" y1="200" x2="400" y2="120" stroke="#ff4444" strokeWidth="2" opacity="0.6" />
        <line x1="250" y1="200" x2="380" y2="310" stroke="#ff8800" strokeWidth="1.5" opacity="0.5" />
        <line x1="250" y1="200" x2="120" y2="320" stroke="#333" strokeWidth="1" opacity="0.4" />

        <circle cx="250" cy="200" r="30" fill="#001a0d" stroke="#00ff88" strokeWidth="2" />
        <text x="250" y="204" textAnchor="middle" fill="#00ff88" fontSize="9" fontWeight="bold">YOUR ORG</text>

        <circle cx="100" cy="100" r="25" fill="#0a1a0a" stroke="#00ff88" strokeWidth="1.5" className="animate-pulse" />
        <text x="100" y="128" textAnchor="middle" fill="#888" fontSize="8">AWS SDK</text>

        <circle cx="400" cy="120" r="30" fill="#1a0000" stroke="#ff4444" strokeWidth="2" />
        <text x="400" y="148" textAnchor="middle" fill="#ff4444" fontSize="8">log4j</text>
        <text x="400" y="110" textAnchor="middle" fill="white" fontSize="7">9.8</text>

        <circle cx="380" cy="310" r="22" fill="#1a0800" stroke="#ff8800" strokeWidth="1.5" />
        <text x="380" y="338" textAnchor="middle" fill="#ff8800" fontSize="8">lodash</text>

        <circle cx="120" cy="320" r="20" fill="#0a0a1a" stroke="#444" strokeWidth="1" />
        <text x="120" y="346" textAnchor="middle" fill="#888" fontSize="8">prisma</text>
      </svg>
    </div>
  );
}
