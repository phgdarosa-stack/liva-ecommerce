"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import Stepper from "@/components/checkout/Stepper";
import DeliveryStep from "@/components/checkout/DeliveryStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";
import EmptyState from "@/components/ui/EmptyState";
import { useCartStore } from "@/store/cart";
import { computeCartTotals } from "@/lib/cart-calculations";

export interface CheckoutData {
  customerName: string;
  customerCpf: string;
  customerEmail: string;
  customerPhone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: "pix" | "credit_card" | "boleto";
}

interface SavedAddress {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
}

export default function CheckoutFlow({
  defaultData,
  savedAddresses,
}: {
  defaultData: CheckoutData;
  savedAddresses: SavedAddress[];
}) {
  const [step, setStep] = useState<"entrega" | "pagamento" | "revisao">("entrega");
  const [data, setData] = useState<CheckoutData>(defaultData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const clearCart = useCartStore((s) => s.clear);
  const totals = computeCartTotals(items, coupon, data.cep || null);

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

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          couponCode: coupon?.code,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "Algo deu errado. Tente novamente.");
        return;
      }
      clearCart();
      router.push(`/checkout/confirmacao/${result.number}`);
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
      <h1 className="font-serif-editorial text-3xl md:text-4xl mb-2">Finalizar compra</h1>
      <p className="text-sm text-black/50 mb-8">Total: {items.reduce((s, i) => s + i.quantity, 0)} itens</p>

      <Stepper current={step} />

      {step === "entrega" && (
        <DeliveryStep
          data={data}
          savedAddresses={savedAddresses}
          onNext={(next) => {
            setData((d) => ({ ...d, ...next }));
            setStep("pagamento");
          }}
        />
      )}

      {step === "pagamento" && (
        <PaymentStep
          data={data}
          total={totals.total}
          onBack={() => setStep("entrega")}
          onNext={(next) => {
            setData((d) => ({ ...d, ...next }));
            setStep("revisao");
          }}
        />
      )}

      {step === "revisao" && (
        <ReviewStep
          data={data}
          onBack={() => setStep("pagamento")}
          onConfirm={handleConfirm}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
}
