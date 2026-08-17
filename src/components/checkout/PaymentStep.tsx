"use client";

import { useState } from "react";
import { QrCode, CreditCard, Barcode } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";
import type { CheckoutData } from "@/components/checkout/CheckoutFlow";

const METHODS = [
  { value: "pix", label: "Pix", icon: QrCode, hint: "Aprovação imediata" },
  { value: "credit_card", label: "Cartão de crédito", icon: CreditCard, hint: "Em até 3x sem juros" },
  { value: "boleto", label: "Boleto", icon: Barcode, hint: "Aprovação em até 2 dias úteis" },
] as const;

export default function PaymentStep({
  data,
  total,
  onNext,
  onBack,
}: {
  data: CheckoutData;
  total: number;
  onNext: (data: Partial<CheckoutData>) => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<CheckoutData["paymentMethod"]>(data.paymentMethod);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({ paymentMethod: method });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
      <div>
        <h2 className="text-sm font-medium mb-3">Forma de pagamento</h2>
        <div className="flex flex-col gap-2">
          {METHODS.map((m) => (
            <button
              type="button"
              key={m.value}
              onClick={() => setMethod(m.value)}
              className={cn(
                "flex items-center gap-3 text-left border px-4 py-3.5 transition-colors",
                method === m.value ? "border-black" : "border-black/15 hover:border-black/40"
              )}
            >
              <m.icon size={20} strokeWidth={1.5} className="text-olive shrink-0" />
              <span>
                <span className="block text-sm font-medium">{m.label}</span>
                <span className="block text-xs text-black/50">{m.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {method === "credit_card" && (
        <div className="grid sm:grid-cols-2 gap-4 border border-black/10 p-4">
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">
              Número do cartão
            </label>
            <input
              value={card.number}
              onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
              placeholder="0000 0000 0000 0000"
              className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">
              Nome impresso no cartão
            </label>
            <input
              value={card.name}
              onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
              className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">Validade</label>
            <input
              value={card.expiry}
              onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
              placeholder="MM/AA"
              className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">CVV</label>
            <input
              value={card.cvv}
              onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
              placeholder="000"
              className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
          <p className="sm:col-span-2 text-xs text-black/40">
            Ambiente de demonstração — nenhum dado de cartão é processado ou armazenado.
          </p>
        </div>
      )}

      {method === "pix" && (
        <p className="text-sm text-black/60 border border-black/10 p-4">
          O QR Code Pix é gerado na etapa de confirmação. Pagamento simulado para fins de demonstração —
          total de {formatPrice(total)}.
        </p>
      )}

      {method === "boleto" && (
        <p className="text-sm text-black/60 border border-black/10 p-4">
          O boleto é gerado na etapa de confirmação, com vencimento em 2 dias úteis. Pagamento simulado
          para fins de demonstração.
        </p>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit">Revisar pedido</Button>
      </div>
    </form>
  );
}
