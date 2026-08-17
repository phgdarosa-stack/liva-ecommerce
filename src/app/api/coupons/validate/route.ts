import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.code || typeof body.subtotal !== "number") {
    return NextResponse.json({ valid: false, message: "Requisição inválida." }, { status: 400 });
  }

  const result = await validateCoupon(body.code, body.subtotal);
  return NextResponse.json(result);
}
