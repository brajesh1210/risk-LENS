"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES } from "@/lib/templates";
import { parsePackageJson, parseSBOM } from "@/lib/gemini";
import { useAnalysisStore } from "@/store/analysisStore";
import { Package } from "@/types";

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manualInput, setManualInput] = useState("");
  const [manualTags, setManualTags] = useState<Package[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [parsedPackages, setParsedPackages] = useState<Package[]>([]);
  const [stackName, setStackName] = useState("my-stack");

  const { setAnalyzing, setProgress, setError, setAnalysis, isAnalyzing, analysisProgress } = useAnalysisStore();

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadedFile(file.name);
      let packages: Package[] = parsePackageJson(content);
      if (packages.length === 0) packages = parseSBOM(content);
      setParsedPackages(packages);
      setStackName(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsText(file);
  }, []);

  const handleManualKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = manualInput.trim().replace(",", "");
      if (trimmed) {
        const [name, version = "latest"] = trimmed.split("@");
        setManualTags((p) => [...p, { name, version, ecosystem: "npm" }]);
        setManualInput("");
      }
    }
  };

  const handleUseTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (t) { setParsedPackages(t.packages); setUploadedFile(null); setStackName(t.name); }
  };

  const allPackages = [...parsedPackages, ...manualTags];

  const handleAnalyze = async () => {
    if (allPackages.length === 0) return;
    setAnalyzing(true); setError(null); setProgress(10);

    const interval = setInterval(() => {
      setProgress(Math.min(useAnalysisStore.getState().analysisProgress + 7, 90));
    }, 300);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packages: allPackages, stackName }),
      });
      if (!res.ok) throw new Error("Failed");
      const result = await res.json();
      clearInterval(interval);
      setProgress(100);
      setAnalysis(result);
      setTimeout(() => { setAnalyzing(false); setProgress(0); router.push("/graph"); }, 500);
    } catch {
      clearInterval(interval);
      setAnalyzing(false); setProgress(0); setError("Analysis failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
        <Link href="/" className="text-[#888] hover:text-white text-sm">← Back</Link>
        <h1 className="font-bold text-lg font-mono">NEW ANALYSIS</h1>
        <button onClick={() => document.getElementById("manual")?.scrollIntoView({ behavior: "smooth" })} className="text-[#888] hover:text-[#00FF41] text-sm">
          SKIP TO MANUAL ENTRY
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
            isDragOver ? "border-[#00FF41] bg-[#00FF41]/5" : "border-[#333] hover:border-[#555]"
          } ${uploadedFile ? "border-[#00FF41]/50 bg-[#001a08]" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          {uploadedFile ? (
            <>
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-[#00FF41] mb-2 font-mono">{uploadedFile}</h2>
              <p className="text-[#888]">{parsedPackages.length} packages detected</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📁</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Drop your JSON or SBOM file here</h2>
              <p className="text-[#00FF41] mb-6 font-mono text-sm">Supports CycloneDX · SPDX · custom JSON</p>
              <button className="border border-[#333] text-white px-6 py-3 rounded-lg hover:border-[#00FF41]">Browse Files</button>
            </>
          )}
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="text-[#555] text-xs uppercase tracking-widest font-mono">Or start from a template</span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-[#888] font-mono mb-3">Popular Stacks</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 flex flex-col gap-3 hover:border-[#00FF41]/30"
              >
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-lg">{t.icon}</div>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-[#555] text-xs">{t.description}</p>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-[#555]">Packages:</span><span>{t.stats.packages}</span></div>
                  <div className="flex justify-between"><span className="text-[#555]">Vulns:</span>
                    <span style={{ color: t.stats.riskScore >= 9 ? "#FF003C" : t.stats.riskScore >= 7 ? "#ff8800" : "#00FF41" }}>
                      {t.stats.vulnerabilities} found
                    </span>
                  </div>
                  <div className="flex justify-between"><span className="text-[#555]">Risk:</span>
                    <span style={{ color: t.stats.riskScore >= 9 ? "#FF003C" : t.stats.riskScore >= 7 ? "#ff8800" : "#00FF41" }}>
                      {t.stats.riskScore}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleUseTemplate(t.id)} className="w-full border border-[#333] text-xs py-2 rounded-lg hover:border-[#00FF41] hover:text-[#00FF41]">
                  Use Template
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div id="manual">
          <h3 className="text-xs uppercase tracking-widest text-[#888] font-mono mb-3">Manual Entry</h3>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {manualTags.map((tag, i) => (
                <span key={i} className="bg-[#1a1a1a] border border-[#333] text-sm px-3 py-1 rounded-full flex items-center gap-2 font-mono">
                  {tag.name}{tag.version !== "latest" && <span className="text-[#555]">@{tag.version}</span>}
                  <button onClick={() => setManualTags((p) => p.filter((_, idx) => idx !== i))} className="text-[#555] hover:text-[#FF003C]">×</button>
                </span>
              ))}
            </div>
            <input type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)} onKeyDown={handleManualKeyDown}
              placeholder="Type package@version and press Enter..."
              className="w-full bg-transparent text-sm outline-none placeholder-[#444] font-mono" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 p-4 bg-black border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          {allPackages.length > 0 && <p className="text-center text-[#555] text-sm mb-3 font-mono">{allPackages.length} packages ready</p>}
          <button
            onClick={handleAnalyze}
            disabled={allPackages.length === 0}
            className={`w-full font-bold py-5 rounded-xl text-lg transition-all ${
              allPackages.length > 0 ? "bg-[#00FF41] text-black hover:shadow-[0_0_40px_rgba(0,255,65,0.5)]" : "bg-[#1a1a1a] text-[#555]"
            }`}
          >
            ANALYZE STACK →
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2 font-mono">SCANNING DEPENDENCIES</h3>
              <p className="text-[#888] mb-6 font-mono text-sm">Querying OSV database...</p>
              <div className="bg-[#1a1a1a] rounded-full h-2 mb-2">
                <div className="bg-[#00FF41] h-2 rounded-full transition-all" style={{ width: `${analysisProgress}%` }} />
              </div>
              <p className="text-[#555] text-sm font-mono">{analysisProgress}%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}