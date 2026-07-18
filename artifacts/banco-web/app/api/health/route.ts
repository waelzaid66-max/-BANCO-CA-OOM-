import { NextResponse } from "next/server";
import { webPlugStatus } from "../../../lib/web-plug-config";

/**
 * Liveness for CDN/container probes.
 * Stays HTTP 200 even when the plug is OFF so ops can distinguish
 * "process up + site unplugged" from "process down".
 */
export function GET() {
  const plug = webPlugStatus();
  return NextResponse.json({
    status: "ok",
    surface: "banco-web",
    plug,
    wave: "phase6-plug",
    ts: new Date().toISOString(),
  });
}
