import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ variantId: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { variantId } = await params;
  const body = await req.json().catch(() => null);
  const stock = Number(body?.stock);
  if (Number.isNaN(stock) || stock < 0) {
    return NextResponse.json({ error: "Estoque inválido." }, { status: 400 });
  }

  const variant = await prisma.productVariant.update({
    where: { id: variantId },
    data: { stock },
  });

  return NextResponse.json({ variant });
}
