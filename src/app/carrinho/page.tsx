"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { computeCartTotals } from "@/lib/cart-calculations";
import { formatPrice, isValidCep, formatCep } from "@/lib/utils";
import CartItemRow from "@/components/cart/CartItemRow";
import ShippingProgress from "@/components/cart/ShippingProgress";
import CouponInput from "@/components/cart/CouponInput";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function CarrinhoPage() {
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const cep = useCartStore((s) => s.cep);
  const setCep = useCartStore((s) => s.setCep);

  const totals = computeCartTotals(items, coupon, cep);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-16">
        <EmptyState
          icon={<ShoppingBag size={40} strokeWidth={1} />}
          title="Seu carrinho está esperando por você."
          ctaLabel="Explorar produtos"
          ctaHref="/roupas"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
      <h1 className="font-serif-editorial text-3xl md:text-4xl mb-8">Seu carrinho</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div>
          <div className="mb-6">
            <ShippingProgress subtotal={totals.subtotal - totals.bundleDiscount - totals.couponDiscount} />
          </div>
          {items.map((item) => (
            <CartItemRow key={item.variantId} item={item} />
          ))}
        </div>

        <div className="border border-black/10 p-6 h-fit space-y-5">
          <div>
            <label htmlFor="cep" className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">
              Calcular frete
            </label>
            <input
              id="cep"
              value={cep ?? ""}
              onChange={(e) => setCep(formatCep(e.target.value))}
              placeholder="Seu CEP"
              maxLength={9}
              className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
            {cep && !isValidCep(cep) && (
              <p className="text-xs text-error mt-1.5">CEP inválido.</p>
            )}
          </div>

          <CouponInput subtotal={totals.subtotal} />

          <div className="space-y-1.5 text-sm border-t border-black/10 pt-4">
            <div className="flex justify-between text-black/60">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            {totals.bundleDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>Promoção 2 camisetas</span>
                <span>-{formatPrice(totals.bundleDiscount)}</span>
              </div>
            )}
            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>Cupom {coupon?.code}</span>
                <span>-{formatPrice(totals.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-black/60">
              <span>Frete</span>
              <span>{totals.freeShipping ? "Grátis" : formatPrice(totals.shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-medium pt-2 border-t border-black/10">
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </div>

          <Button href="/checkout" size="lg" className="w-full">
            Finalizar compra
          </Button>
        </div>
      </div>
    </div>
  );
}
