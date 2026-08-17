import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { adminCouponSchema } from "@/lib/validators";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = adminCouponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const code = parsed.data.code.toUpperCase();
  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "Já existe um cupom com esse código." }, { status: 409 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code,
      type: parsed.data.type,
      value: parsed.data.value,
      minOrder: parsed.data.minOrder ?? 0,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      usageLimit: parsed.data.usageLimit ?? null,
      firstPurchaseOnly: parsed.data.firstPurchaseOnly ?? false,
      active: parsed.data.active ?? true,
    },
  });

  return NextResponse.json({ coupon }, { status: 201 });
}
