"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useFavoritesStore } from "@/store/favorites";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import type { ProductCardData } from "@/types";

export default function FavoritosPage() {
  const { status } = useSession();
  const productIds = useFavoritesStore((s) => s.productIds);
  const setAll = useFavoritesStore((s) => s.setAll);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => setAll(data.productIds ?? []));
    }
  }, [status, setAll]);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/products/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: productIds }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [productIds]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
      <h1 className="font-serif-editorial text-3xl md:text-4xl mb-8">Favoritos</h1>

      {loading ? (
        <p className="text-sm text-black/50 py-16 text-center">Carregando...</p>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Heart size={40} strokeWidth={1} />}
          title="Ainda não tem favoritos."
          ctaLabel="Descobrir novidades"
          ctaHref="/novidades"
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
