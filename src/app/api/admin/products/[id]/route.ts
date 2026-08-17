import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, images: { orderBy: { order: "asc" } } },
  });
  if (!product) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      category: body.category,
      description: body.description,
      composition: body.composition,
      care: body.care,
      price: body.price !== undefined ? Number(body.price) : undefined,
      promoPrice: body.promoPrice === "" || body.promoPrice === null ? null : body.promoPrice !== undefined ? Number(body.promoPrice) : undefined,
      sku: body.sku,
      featured: body.featured,
      bestseller: body.bestseller,
      newArrival: body.newArrival,
    },
  });

  if (Array.isArray(body.variants)) {
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productVariant.createMany({
      data: body.variants.map(
        (v: { color: string; colorHex?: string; size: string; stock: number }, i: number) => ({
          productId: id,
          color: v.color,
          colorHex: v.colorHex ?? "#111111",
          size: v.size,
          stock: Number(v.stock) || 0,
          sku: `${product.sku}-V${i}-${Date.now()}`,
        })
      ),
    });
  }

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
