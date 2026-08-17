"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useFavoritesStore } from "@/store/favorites";
import { cn } from "@/lib/utils";

export default function FavoriteButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { data: session } = useSession();
  const isFavorite = useFavoritesStore((s) => s.productIds.includes(productId));
  const toggle = useFavoritesStore((s) => s.toggle);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);

    if (session?.user) {
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } catch {
        // best-effort sync; local state already reflects the toggle
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={cn(
        "p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-sm",
        className
      )}
    >
      <Heart
        size={17}
        strokeWidth={1.5}
        className={isFavorite ? "fill-black text-black" : "fill-none text-black/70"}
      />
    </button>
  );
}
