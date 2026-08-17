import { NextRequest, NextResponse } from "next/server";
import { searchSuggestions } from "@/lib/products";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const results = await searchSuggestions(q, 8);
  return NextResponse.json({ results });
}
