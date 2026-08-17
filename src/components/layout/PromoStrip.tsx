"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Frete grátis nas compras acima de R$299",
  "15% OFF na primeira compra — BEMVINDALIVA",
  "2 camisetas por R$149,90",
];

export default function PromoStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white text-center py-2.5 px-4 text-xs tracking-wide" role="status">
      <span key={index} className="animate-fade-in inline-block">
        {MESSAGES[index]}
      </span>
    </div>
  );
}
