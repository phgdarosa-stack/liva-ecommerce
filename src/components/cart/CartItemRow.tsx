"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { CartItem } from "@/types";

export default function CartItemRow({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-4 border-b border-black/10">
      <Link
        href={`/produto/${item.slug}`}
        className="relative shrink-0 bg-warm-gray/40 overflow-hidden"
        style={{ width: compact ? 72 : 96, height: compact ? 96 : 128 }}
      >
        <Image src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/produto/${item.slug}`} className="text-sm font-medium hover:text-olive line-clamp-2">
              {item.name}
            </Link>
            <p className="text-xs text-black/55 mt-1">
              {item.color} · Tam. {item.size}
            </p>
          </div>
          <button
            aria-label="Remover item"
            onClick={() => removeItem(item.variantId)}
            className="p-1 text-black/40 hover:text-black shrink-0"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center border border-black/20">
            <button
              aria-label="Diminuir quantidade"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="p-1.5 hover:bg-black/5"
            >
              <Minus size={12} />
            </button>
            <span className="w-7 text-center text-xs">{item.quantity}</span>
            <button
              aria-label="Aumentar quantidade"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="p-1.5 hover:bg-black/5 disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>
          <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
}
