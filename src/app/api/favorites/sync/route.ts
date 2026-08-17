import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

/** Merges locally-stored guest favorites into the account after login. */
export async function POST(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const productIds: string[] = Array.isArray(body?.productIds) ? body.productIds : [];
  if (productIds.length === 0) return NextResponse.json({ ok: true });

  await prisma.favorite.createMany({
    data: productIds.map((productId) => ({ userId: user!.id, productId })),
    skipDuplicates: true,
  });

  const favorites = await prisma.favorite.findMany({
    where: { userId: user!.id },
    select: { productId: true },
  });

  return NextResponse.json({ productIds: favorites.map((f) => f.productId) });
}
