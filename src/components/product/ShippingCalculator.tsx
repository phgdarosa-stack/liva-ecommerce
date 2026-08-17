"use client";

import { useState } from "react";
import { calculateShipping, formatCep, formatPrice, isValidCep } from "@/lib/utils";
import type { ShippingQuote } from "@/lib/utils";

export default function ShippingCalculator({ subtotal }: { subtotal: number }) {
  const [cep, setCep] = useState("");
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidCep(cep)) {
      setError("Informe um CEP válido.");
      setQuote(null);
      return;
    }
    setError(null);
    setQuote(calculateShipping(cep, subtotal));
  }

  return (
    <div>
      <form onSubmit={handleCalculate} className="flex gap-2">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          placeholder="Seu CEP"
          maxLength={9}
          className="flex-1 min-w-0 border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
        <button
          type="submit"
          className="px-4 text-xs uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-colors"
        >
          Calcular
        </button>
      </form>
      {error && <p className="text-xs text-error mt-2">{error}</p>}
      {quote && (
        <p className="text-sm mt-3">
          {quote.freeShipping ? (
            <span className="text-success font-medium">Frete grátis</span>
          ) : (
            <span>{formatPrice(quote.price)}</span>
          )}{" "}
          <span className="text-black/55">
            · chega em {quote.minDays} a {quote.maxDays} dias úteis
          </span>
        </p>
      )}
    </div>
  );
}
