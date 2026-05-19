import { NextRequest, NextResponse } from "next/server";
import { analyzeStack } from "@/lib/graphBuilder";
import { Package } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { packages, stackName } = (await request.json()) as { packages: Package[]; stackName: string };
    if (!packages || packages.length === 0) {
      return NextResponse.json({ error: "No packages provided" }, { status: 400 });
    }
    const result = await analyzeStack(packages.slice(0, 20), stackName);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}