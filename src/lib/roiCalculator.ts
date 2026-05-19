import { AnalysisResult, ROIMetrics } from "@/types";

const AVG_BREACH_COST = 4_450_000;
const COST_PER_CRITICAL = 250_000;
const COMPLIANCE_HOURS_PER_VULN = 8;
const ANALYST_HOURLY_RATE = 150;
const GDPR_FINE_BASE = 20_000_000;

export function calculateROI(analysis: AnalysisResult): ROIMetrics {
  const { summary } = analysis;

  const estimatedBreachCost =
    summary.criticalCount * COST_PER_CRITICAL +
    summary.highCount * (COST_PER_CRITICAL * 0.4) +
    AVG_BREACH_COST * (summary.exposurePercentage / 100);

  const potentialFineAmount = summary.criticalCount > 0
    ? Math.min(GDPR_FINE_BASE, summary.criticalCount * 5_000_000)
    : summary.highCount * 1_000_000;

  const complianceHoursSaved = summary.totalCVEs * COMPLIANCE_HOURS_PER_VULN;
  const riskReductionPercentage = Math.min(95, summary.exposurePercentage * 1.2);
  const annualSavings = complianceHoursSaved * ANALYST_HOURLY_RATE * 12;
  const meanTimeToDetect = Math.max(1, 287 - (summary.totalComponents * 2));

  return {
    estimatedBreachCost: Math.round(estimatedBreachCost),
    potentialFineAmount: Math.round(potentialFineAmount),
    complianceHoursSaved,
    riskReductionPercentage: Math.round(riskReductionPercentage),
    annualSavings: Math.round(annualSavings),
    meanTimeToDetect,
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}