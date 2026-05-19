"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysisStore } from "@/store/analysisStore";

interface LogEntry {
  type: "input" | "success" | "error" | "info";
  text: string;
  timestamp: string;
}

export function CommandConsole() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "info", text: "risk-LENS Terminal v1.4.2", timestamp: getTime() },
    { type: "info", text: 'Type "/help" for commands', timestamp: getTime() },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const { consoleOpen, toggleConsole, setScanActive, isolateNode, restoreNode, currentAnalysis, healthIndex } = useAnalysisStore();

  // Keyboard shortcut Ctrl+\
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "\\") {
        e.preventDefault();
        toggleConsole();
      }
      if (e.key === "Escape" && consoleOpen) {
        toggleConsole();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [consoleOpen]);

  useEffect(() => {
    if (consoleOpen) inputRef.current?.focus();
  }, [consoleOpen]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  function getTime() {
    return new Date().toTimeString().split(" ")[0];
  }

  const addLog = (type: LogEntry["type"], text: string) => {
    setLogs((prev) => [...prev, { type, text, timestamp: getTime() }]);
  };

  const executeCommand = (cmd: string) => {
    addLog("input", `> ${cmd}`);
    const [command, ...args] = cmd.trim().split(" ");

    switch (command.toLowerCase()) {
      case "/help":
        addLog("info", "Available commands:");
        addLog("info", "  /scan              - Run vulnerability radar scan");
        addLog("info", "  /isolate [vendor]  - Quarantine a compromised vendor");
        addLog("info", "  /restore [vendor]  - Restore an isolated vendor");
        addLog("info", "  /status            - Show infrastructure health");
        addLog("info", "  /list              - List all components");
        addLog("info", "  /clear             - Clear terminal");
        addLog("info", "  /exit              - Close terminal");
        break;

      case "/scan":
        addLog("success", "🔍 Initiating radar scan...");
        setScanActive(true);
        setTimeout(() => addLog("success", "✓ Scan complete. Dependencies mapped."), 2000);
        break;

      case "/isolate":
        if (!args[0]) { addLog("error", "Usage: /isolate [vendor-name]"); break; }
        if (!currentAnalysis) { addLog("error", "No analysis loaded"); break; }
        const target = currentAnalysis.components.find(
          (c) => c.name.toLowerCase().includes(args[0].toLowerCase())
        );
        if (target) {
          isolateNode(target.id);
          addLog("success", `⚡ Isolating ${target.name}...`);
          addLog("success", `✓ Connection severed. Health +20%`);
        } else {
          addLog("error", `Vendor "${args[0]}" not found`);
        }
        break;

      case "/restore":
        if (!args[0]) { addLog("error", "Usage: /restore [vendor-name]"); break; }
        if (!currentAnalysis) { addLog("error", "No analysis loaded"); break; }
        const restoreTarget = currentAnalysis.components.find(
          (c) => c.name.toLowerCase().includes(args[0].toLowerCase())
        );
        if (restoreTarget) {
          restoreNode(restoreTarget.id);
          addLog("success", `✓ ${restoreTarget.name} restored`);
        } else {
          addLog("error", `Vendor "${args[0]}" not found`);
        }
        break;

      case "/status":
        addLog("info", `Infrastructure Health Index: ${healthIndex}%`);
        if (currentAnalysis) {
          addLog("info", `Total Components: ${currentAnalysis.summary.totalComponents}`);
          addLog("info", `Total CVEs: ${currentAnalysis.summary.totalCVEs}`);
          addLog("info", `Critical Risks: ${currentAnalysis.summary.criticalCount}`);
        }
        break;

      case "/list":
        if (!currentAnalysis) { addLog("error", "No analysis loaded"); break; }
        currentAnalysis.components.slice(0, 10).forEach((c) => {
          addLog("info", `  ${c.name}@${c.version} [${c.status}] - ${c.cves.length} CVE(s)`);
        });
        break;

      case "/clear":
        setLogs([{ type: "info", text: "Terminal cleared", timestamp: getTime() }]);
        break;

      case "/exit":
        toggleConsole();
        break;

      default:
        addLog("error", `Unknown command: ${command}. Type /help`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput("");
    }
  };

  return (
    <>
      {/* Scan line overlay */}
      <AnimatePresence>
        {useAnalysisStore.getState().scanActive && (
          <div className="scan-line" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {consoleOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 left-0 right-0 z-[100] glass border-b-2 border-[#00FF41]"
            style={{ height: "400px" }}
          >
            <div className="h-full flex flex-col font-mono">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF003C]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffcc00]" />
                  <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
                  <span className="text-[#888] text-sm ml-3">risk-LENS Terminal — Ctrl+\ to toggle</span>
                </div>
                <button onClick={toggleConsole} className="text-[#888] hover:text-white text-xl">×</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-black/40 text-sm">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 mb-1">
                    <span className="text-[#444] text-xs shrink-0">{log.timestamp}</span>
                    <span style={{
                      color: log.type === "success" ? "#00FF41" :
                             log.type === "error" ? "#FF003C" :
                             log.type === "input" ? "#fff" : "#888"
                    }}>{log.text}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="border-t border-[#1a1a1a] p-3 flex items-center gap-2 bg-black/60">
                <span className="text-[#00FF41] font-bold">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent text-white outline-none placeholder-[#444]"
                />
                <span className="text-[#00FF41] animate-pulse">_</span>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}