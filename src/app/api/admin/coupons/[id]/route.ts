import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      active: body?.active,
      value: body?.value !== undefined ? Number(body.value) : undefined,
      minOrder: body?.minOrder !== undefined ? Number(body.minOrder) : undefined,
      usageLimit: body?.usageLimit !== undefined ? (body.usageLimit === null ? null : Number(body.usageLimit)) : undefined,
      expiresAt: body?.expiresAt !== undefined ? (body.expiresAt ? new Date(body.expiresAt) : null) : undefined,
    },
  });

  return NextResponse.json({ coupon });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
