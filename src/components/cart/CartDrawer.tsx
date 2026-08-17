"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { computeCartTotals } from "@/lib/cart-calculations";
import { formatPrice } from "@/lib/utils";
import CartItemRow from "@/components/cart/CartItemRow";
import ShippingProgress from "@/components/cart/ShippingProgress";
import CouponInput from "@/components/cart/CouponInput";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const cep = useCartStore((s) => s.cep);

  const totals = computeCartTotals(items, coupon, cep);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(v) => !v && closeCart()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-fade-in" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-ivory z-50 flex flex-col"
          style={{ animationName: "slide-in-right", animationDuration: "0.3s", animationFillMode: "forwards" }}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-black/10 shrink-0">
            <Dialog.Title className="text-sm font-medium uppercase tracking-wider">
              Seu carrinho {items.length > 0 && `(${items.reduce((s, i) => s + i.quantity, 0)})`}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Fechar carrinho" className="p-2 -mr-2">
                <X size={20} strokeWidth={1.5} />
              </button>
            </Dialog.Close>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<ShoppingBag size={40} strokeWidth={1} />}
                title="Seu carrinho está esperando por você."
                ctaLabel="Explorar produtos"
                ctaHref="/roupas"
              />
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-black/10 shrink-0">
                <ShippingProgress subtotal={totals.subtotal - totals.bundleDiscount - totals.couponDiscount} />
              </div>

              <div className="flex-1 overflow-y-auto px-5">
                {items.map((item) => (
                  <CartItemRow key={item.variantId} item={item} compact />
                ))}
              </div>

              <div className="shrink-0 border-t border-black/10 px-5 py-5 space-y-4">
                <CouponInput subtotal={totals.subtotal} />

                <div className="space-y-1.5 text-sm">
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
                      <span>Cupom</span>
                      <span>-{formatPrice(totals.couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-black/60">
                    <span>Frete estimado</span>
                    <span>{totals.freeShipping ? "Grátis" : formatPrice(totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium pt-2 border-t border-black/10">
                    <span>Total</span>
                    <span>{formatPrice(totals.total)}</span>
                  </div>
                </div>

                <Button href="/checkout" size="lg" className="w-full" onClick={closeCart}>
                  Finalizar compra
                </Button>
                <Button href="/carrinho" variant="link" size="sm" onClick={closeCart} className="w-full text-center justify-center">
                  Ver carrinho completo
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
