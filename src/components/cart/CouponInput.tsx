"use client";

import { useState } from "react";
import { X, Tag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CouponInput({ subtotal }: { subtotal: number }) {
  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!data.valid) {
        setError(data.message ?? "Cupom inválido.");
        return;
      }
      applyCoupon(data.coupon);
      setCode("");
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between bg-olive/10 border border-olive/30 px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2">
          <Tag size={14} strokeWidth={1.5} className="text-olive" />
          Cupom <strong>{coupon.code}</strong> aplicado
        </span>
        <button
          onClick={removeCoupon}
          aria-label="Remover cupom"
          className="text-black/50 hover:text-black"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Cupom de desconto"
          className="flex-1 min-w-0 border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black uppercase"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 text-xs uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Aplicar"}
        </button>
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </form>
  );
}
