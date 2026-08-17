import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const products = await prisma.product.findMany({
    include: { variants: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.category || !body?.price) {
    return NextResponse.json({ error: "Preencha os campos obrigatórios." }, { status: 400 });
  }

  const slug = body.slug?.trim() || slugify(body.name);
  const sku = body.sku?.trim() || `LV-${Date.now()}`;

  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) {
    return NextResponse.json({ error: "Já existe um produto com esse slug." }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      sku,
      category: body.category,
      description: body.description ?? "",
      composition: body.composition ?? "",
      care: body.care ?? "",
      price: Number(body.price),
      promoPrice: body.promoPrice ? Number(body.promoPrice) : null,
      featured: !!body.featured,
      bestseller: !!body.bestseller,
      newArrival: !!body.newArrival,
      images: {
        create: (body.images ?? []).map((img: { url: string; alt?: string; type?: string }, i: number) => ({
          url: img.url,
          alt: img.alt ?? body.name,
          type: img.type ?? (i === 0 ? "front" : "detail"),
          order: i,
        })),
      },
      variants: {
        create: (body.variants ?? []).map(
          (v: { color: string; colorHex?: string; size: string; stock: number }, i: number) => ({
            color: v.color,
            colorHex: v.colorHex ?? "#111111",
            size: v.size,
            stock: Number(v.stock) || 0,
            sku: `${sku}-V${i}`,
          })
        ),
      },
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
