import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;

  const favorites = await prisma.favorite.findMany({
    where: { userId: user!.id },
    select: { productId: true },
  });

  return NextResponse.json({ productIds: favorites.map((f) => f.productId) });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  if (!body?.productId) {
    return NextResponse.json({ error: "productId é obrigatório." }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: user!.id, productId: body.productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({ data: { userId: user!.id, productId: body.productId } });
  return NextResponse.json({ favorited: true });
}
