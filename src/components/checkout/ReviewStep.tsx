"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { computeCartTotals } from "@/lib/cart-calculations";
import type { CheckoutData } from "@/components/checkout/CheckoutFlow";

const METHOD_LABEL: Record<CheckoutData["paymentMethod"], string> = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
  boleto: "Boleto",
};

export default function ReviewStep({
  data,
  onBack,
  onConfirm,
  submitting,
  error,
}: {
  data: CheckoutData;
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const totals = computeCartTotals(items, coupon, data.cep);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h2 className="text-sm font-medium mb-3">Itens do pedido</h2>
        <div className="border border-black/10 divide-y divide-black/10">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 p-4">
              <div className="relative w-16 h-20 bg-warm-gray/40 shrink-0 overflow-hidden">
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-black/55">
                  {item.color} · Tam. {item.size} · Qtd. {item.quantity}
                </p>
              </div>
              <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-medium mb-2">Entrega</h2>
          <p className="text-sm text-black/65">
            {data.customerName}
            <br />
            {data.street}, {data.number}
            {data.complement && ` — ${data.complement}`}
            <br />
            {data.neighborhood && `${data.neighborhood}, `}
            {data.city}/{data.state} · {data.cep}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium mb-2">Pagamento</h2>
          <p className="text-sm text-black/65">{METHOD_LABEL[data.paymentMethod]}</p>
        </div>
      </div>

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

      <label className="flex items-start gap-2.5 text-xs text-black/60 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-black"
        />
        Revisei meus dados e confirmo que estão corretos. Este é um ambiente de demonstração — nenhum
        pagamento real será processado.
      </label>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>
          Voltar
        </Button>
        <Button type="button" onClick={onConfirm} disabled={!agreed || submitting}>
          {submitting ? "Confirmando..." : "Confirmar pedido"}
        </Button>
      </div>
    </div>
  );
}
