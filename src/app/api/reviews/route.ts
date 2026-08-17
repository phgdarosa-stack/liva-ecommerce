import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { reviewSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const { productId, rating, title, comment } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: user!.id,
      authorName: user!.name ?? "Cliente LIVA",
      rating,
      title,
      comment,
    },
  });

  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Math.round((agg._avg.rating ?? rating) * 10) / 10,
      reviewCount: agg._count,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
