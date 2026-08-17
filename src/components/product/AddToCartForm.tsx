"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Price from "@/components/ui/Price";
import SizeGuide from "@/components/product/SizeGuide";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import type { ProductDTO } from "@/types";

export default function AddToCartForm({
  product,
  compact = false,
}: {
  product: ProductDTO;
  compact?: boolean;
}) {
  const colors = useMemo(() => {
    const seen = new Map<string, string>();
    for (const v of product.variants) if (!seen.has(v.color)) seen.set(v.color, v.colorHex);
    return Array.from(seen, ([color, colorHex]) => ({ color, colorHex }));
  }, [product.variants]);

  const sizesOrder = useMemo(() => {
    const seen: string[] = [];
    for (const v of product.variants) if (!seen.includes(v.size)) seen.push(v.size);
    return seen;
  }, [product.variants]);

  const [color, setColor] = useState(colors[0]?.color ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const variantsForColor = product.variants.filter((v) => v.color === color);
  const selectedVariant = product.variants.find((v) => v.color === color && v.size === size);
  const unitPrice = product.promoPrice ?? product.price;
  const inStock = (selectedVariant?.stock ?? 0) > 0;
  const image = product.images.find((i) => i.type === "front")?.url ?? product.images[0]?.url;

  function handleColorChange(newColor: string) {
    setColor(newColor);
    setSize(null);
  }

  function addToCart(): boolean {
    if (!size) {
      toast.error("Selecione um tamanho.");
      return false;
    }
    if (!selectedVariant || selectedVariant.stock < 1) {
      toast.error("Essa variação está indisponível no momento.");
      return false;
    }
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant.id,
        slug: product.slug,
        name: product.name,
        image: image ?? "",
        color,
        size,
        price: unitPrice,
        maxStock: selectedVariant.stock,
      },
      quantity
    );
    toast.success(`${product.name} adicionado ao carrinho.`);
    return true;
  }

  function handleBuyNow() {
    if (addToCart()) router.push("/checkout");
  }

  return (
    <div className={cn("flex flex-col gap-6", compact && "gap-4")}>
      {!compact && <Price price={product.price} promoPrice={product.promoPrice} size="lg" />}

      <div>
        <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
          Cor{color ? `: ${color}` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.color}
              onClick={() => handleColorChange(c.color)}
              aria-label={c.color}
              aria-pressed={color === c.color}
              className={cn(
                "w-9 h-9 rounded-full border-2 transition-all",
                color === c.color ? "border-black" : "border-transparent hover:border-black/30"
              )}
              style={{ backgroundColor: c.colorHex }}
              type="button"
            >
              <span className="sr-only">{c.color}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wider text-black/50">Tamanho</p>
          <SizeGuide />
        </div>
        <div className="flex flex-wrap gap-2">
          {sizesOrder.map((s) => {
            const variant = variantsForColor.find((v) => v.size === s);
            const disabled = !variant || variant.stock < 1;
            return (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "min-w-11 h-11 px-3 border text-sm transition-colors",
                  size === s ? "border-black bg-black text-white" : "border-black/25 hover:border-black",
                  disabled && "opacity-30 line-through pointer-events-none"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        {size && !inStock && (
          <p className="text-xs text-error mt-2">Esgotado nesse tamanho.</p>
        )}
        {size && inStock && selectedVariant && selectedVariant.stock <= 3 && (
          <p className="text-xs text-error mt-2">Últimas {selectedVariant.stock} unidades.</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <p className="text-xs uppercase tracking-wider text-black/50">Quantidade</p>
        <div className="flex items-center border border-black/25">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2.5 hover:bg-black/5"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQuantity((q) => Math.min(q + 1, selectedVariant?.stock ?? 10))}
            className="p-2.5 hover:bg-black/5"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <Button
          type="button"
          size="lg"
          onClick={addToCart}
          className="w-full"
        >
          Adicionar ao carrinho
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={handleBuyNow} className="w-full">
          Comprar agora
        </Button>
      </div>
    </div>
  );
}
