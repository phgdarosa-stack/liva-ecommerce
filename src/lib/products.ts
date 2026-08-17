import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import type { ProductCardData, ProductDTO } from "@/types";

const cardInclude = {
  images: { orderBy: { order: "asc" as const } },
  variants: true,
};

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

export function toProductCardData(product: ProductWithRelations): ProductCardData {
  const front = product.images.find((i) => i.type === "front") ?? product.images[0];
  const detail = product.images.find((i) => i.type !== "front") ?? product.images[1];

  const seenColors = new Map<string, string>();
  for (const v of product.variants) {
    if (!seenColors.has(v.color)) seenColors.set(v.color, v.colorHex);
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    promoPrice: product.promoPrice,
    bestseller: product.bestseller,
    newArrival: product.newArrival,
    image: front?.url ?? "",
    hoverImage: detail?.url,
    colors: Array.from(seenColors, ([color, colorHex]) => ({ color, colorHex })),
  };
}

export async function toProductDTO(product: ProductWithRelations & {
  reviews?: { id: string; authorName: string; rating: number; title: string | null; comment: string; createdAt: Date }[];
}): Promise<ProductDTO> {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.description,
    composition: product.composition,
    care: product.care,
    price: product.price,
    promoPrice: product.promoPrice,
    sku: product.sku,
    featured: product.featured,
    bestseller: product.bestseller,
    newArrival: product.newArrival,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images: product.images.map((i) => ({
      id: i.id,
      url: i.url,
      alt: i.alt,
      type: i.type as ProductDTO["images"][number]["type"],
      order: i.order,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      color: v.color,
      colorHex: v.colorHex,
      size: v.size,
      stock: v.stock,
      sku: v.sku,
    })),
    reviews: product.reviews?.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) return null;
  return toProductDTO(product);
}

export async function getNewArrivals(limit = 4) {
  const products = await prisma.product.findMany({
    where: { newArrival: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductCardData);
}

export async function getBestsellers(limit = 4) {
  const products = await prisma.product.findMany({
    where: { bestseller: true },
    include: cardInclude,
    orderBy: { rating: "desc" },
    take: limit,
  });
  return products.map(toProductCardData);
}

export async function getPromotions(limit = 8) {
  const products = await prisma.product.findMany({
    where: { promoPrice: { not: null } },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductCardData);
}

export async function getFeatured(limit = 4) {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: cardInclude,
    take: limit,
  });
  return products.map(toProductCardData);
}

export async function getRelatedProducts(category: string, excludeId: string, limit = 4) {
  const products = await prisma.product.findMany({
    where: { category, id: { not: excludeId } },
    include: cardInclude,
    take: limit,
  });
  return products.map(toProductCardData);
}

export interface CatalogFilters {
  category?: string;
  q?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  promo?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  sort?: "relevancia" | "novidade" | "preco-asc" | "preco-desc" | "mais-vendido";
}

export async function getCatalog(filters: CatalogFilters) {
  const where: Prisma.ProductWhereInput = {};

  if (filters.category) where.category = filters.category;
  if (filters.promo) where.promoPrice = { not: null };
  if (filters.bestseller) where.bestseller = true;
  if (filters.newArrival) where.newArrival = true;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }
  // SQLite's default collation is case-sensitive and Prisma's `insensitive`
  // filter mode isn't supported on this connector, so free-text search is
  // matched in JS below instead of pushed into the WHERE clause.
  if (filters.sizes?.length || filters.colors?.length) {
    where.variants = {
      some: {
        ...(filters.sizes?.length ? { size: { in: filters.sizes } } : {}),
        ...(filters.colors?.length ? { color: { in: filters.colors } } : {}),
      },
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "preco-asc"
      ? { price: "asc" }
      : filters.sort === "preco-desc"
      ? { price: "desc" }
      : filters.sort === "novidade"
      ? { createdAt: "desc" }
      : filters.sort === "mais-vendido"
      ? { rating: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: cardInclude,
    orderBy,
  });

  let cards = products.map(toProductCardData);

  if (filters.q?.trim()) {
    const needle = filters.q.trim().toLowerCase();
    cards = cards.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.category.toLowerCase().includes(needle) ||
        c.colors.some((col) => col.color.toLowerCase().includes(needle))
    );
  }

  return cards;
}

export async function searchSuggestions(q: string, limit = 6) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];

  const products = await prisma.product.findMany({ include: cardInclude });
  const cards = products.map(toProductCardData);

  return cards
    .filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.category.toLowerCase().includes(needle) ||
        c.colors.some((col) => col.color.toLowerCase().includes(needle))
    )
    .slice(0, limit);
}
