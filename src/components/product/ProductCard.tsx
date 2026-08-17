"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Price from "@/components/ui/Price";
import FavoriteButton from "@/components/product/FavoriteButton";
import QuickView from "@/components/product/QuickView";
import type { ProductCardData } from "@/types";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <>
      <div className="group flex flex-col">
        <div className="relative aspect-[3/4] bg-warm-gray/40 overflow-hidden">
          <Link href={`/produto/${product.slug}`} className="block w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            {product.hoverImage && (
              <Image
                src={product.hoverImage}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </Link>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.newArrival && <Badge tone="black">Novo</Badge>}
            {product.bestseller && <Badge tone="olive">Mais vendido</Badge>}
            {product.promoPrice && <Badge tone="error">Oferta</Badge>}
          </div>

          <FavoriteButton productId={product.id} className="absolute top-3 right-3" />

          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 px-4 py-2 text-xs
                       uppercase tracking-wider opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-300 hover:bg-black hover:text-white"
          >
            <Eye size={14} strokeWidth={1.5} />
            Ver rápido
          </button>
        </div>

        <Link href={`/produto/${product.slug}`} className="mt-3">
          <h3 className="text-sm line-clamp-2">{product.name}</h3>
        </Link>
        <div className="mt-1">
          <Price price={product.price} promoPrice={product.promoPrice} size="sm" />
        </div>
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.color}
                title={c.color}
                className="w-3.5 h-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: c.colorHex }}
              />
            ))}
          </div>
        )}
      </div>

      <QuickView slug={product.slug} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
