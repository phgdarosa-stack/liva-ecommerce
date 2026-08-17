import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toProductCardData } from "@/lib/products";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
  if (ids.length === 0) return NextResponse.json({ products: [] });

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: { orderBy: { order: "asc" } }, variants: true },
  });

  return NextResponse.json({ products: products.map(toProductCardData) });
}
