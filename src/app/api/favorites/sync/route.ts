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

  // SQLite has no ON CONFLICT DO NOTHING support in Prisma's createMany, so
  // duplicates are filtered client-side instead of relying on skipDuplicates.
  const existing = await prisma.favorite.findMany({
    where: { userId: user!.id, productId: { in: productIds } },
    select: { productId: true },
  });
  const existingIds = new Set(existing.map((f) => f.productId));
  const newIds = productIds.filter((id) => !existingIds.has(id));

  if (newIds.length > 0) {
    await prisma.favorite.createMany({
      data: newIds.map((productId) => ({ userId: user!.id, productId })),
    });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user!.id },
    select: { productId: true },
  });

  return NextResponse.json({ productIds: favorites.map((f) => f.productId) });
}
