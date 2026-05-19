import { NextRequest, NextResponse } from "next/server";
import { getRemediationAdvice } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { packageName, version, cveId, cveDescription } = await request.json();
    const advice = await getRemediationAdvice(packageName, version, cveId, cveDescription);
    return NextResponse.json(advice);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}