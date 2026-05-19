import { create } from "zustand";
import { AnalysisResult, Component } from "@/types";

interface AnalysisStore {
  currentAnalysis: AnalysisResult | null;
  selectedComponent: Component | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisError: string | null;
  
  // New features
  isBlastSimulating: boolean;
  blastSourceId: string | null;
  cameraTargetId: string | null;
  showROIDashboard: boolean;
  isolatedNodes: Set<string>;
  consoleOpen: boolean;
  scanActive: boolean;
  healthIndex: number;

  setAnalysis: (result: AnalysisResult) => void;
  setSelectedComponent: (component: Component | null) => void;
  setAnalyzing: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  clearAnalysis: () => void;
  
  // New actions
  triggerBlast: (sourceId: string) => void;
  stopBlast: () => void;
  setCameraTarget: (id: string | null) => void;
  toggleROIDashboard: () => void;
  isolateNode: (nodeId: string) => void;
  restoreNode: (nodeId: string) => void;
  toggleConsole: () => void;
  setScanActive: (active: boolean) => void;
  setHealthIndex: (value: number) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  currentAnalysis: null,
  selectedComponent: null,
  isAnalyzing: false,
  analysisProgress: 0,
  analysisError: null,
  
  isBlastSimulating: false,
  blastSourceId: null,
  cameraTargetId: null,
  showROIDashboard: false,
  isolatedNodes: new Set(),
  consoleOpen: false,
  scanActive: false,
  healthIndex: 100,

  setAnalysis: (result) => set({ currentAnalysis: result, analysisError: null, healthIndex: 100 - result.summary.exposurePercentage }),
  setSelectedComponent: (component) => set({ selectedComponent: component }),
  setAnalyzing: (loading) => set({ isAnalyzing: loading }),
  setProgress: (progress) => set({ analysisProgress: progress }),
  setError: (error) => set({ analysisError: error }),
  clearAnalysis: () => set({
    currentAnalysis: null, selectedComponent: null, analysisProgress: 0,
    analysisError: null, isolatedNodes: new Set(), healthIndex: 100,
  }),
  
  triggerBlast: (sourceId) => {
    set({ isBlastSimulating: true, blastSourceId: sourceId });
    setTimeout(() => {
      set({ healthIndex: 12 });
    }, 2000);
  },
  stopBlast: () => set({ isBlastSimulating: false, blastSourceId: null }),
  setCameraTarget: (id) => set({ cameraTargetId: id }),
  toggleROIDashboard: () => set((s) => ({ showROIDashboard: !s.showROIDashboard })),
  isolateNode: (nodeId) => {
    const newSet = new Set(get().isolatedNodes);
    newSet.add(nodeId);
    set({ isolatedNodes: newSet, healthIndex: Math.min(100, get().healthIndex + 20) });
  },
  restoreNode: (nodeId) => {
    const newSet = new Set(get().isolatedNodes);
    newSet.delete(nodeId);
    set({ isolatedNodes: newSet });
  },
  toggleConsole: () => set((s) => ({ consoleOpen: !s.consoleOpen })),
  setScanActive: (active) => set({ scanActive: active }),
  setHealthIndex: (value) => set({ healthIndex: value }),
}));