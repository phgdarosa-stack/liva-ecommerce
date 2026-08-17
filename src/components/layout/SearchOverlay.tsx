"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import Image from "next/image";
import { X, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/types";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  function goToResults() {
    if (!query.trim()) return;
    onClose();
    router.push(`/busca?q=${encodeURIComponent(query)}`);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-0 left-0 right-0 bg-ivory z-50 shadow-lg animate-slide-up">
          <Dialog.Title className="sr-only">Buscar produtos</Dialog.Title>
          <div className="mx-auto max-w-2xl px-5 py-8">
            <div className="flex items-center gap-3 border-b border-black pb-3">
              <Search size={20} strokeWidth={1.5} className="text-black/50" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goToResults()}
                placeholder="Buscar por camiseta, vestido, linho, preto..."
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-black/40"
              />
              <Dialog.Close asChild>
                <button aria-label="Fechar busca" className="p-1">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </Dialog.Close>
            </div>

            {query.trim() && (
              <div className="mt-6">
                {loading && <p className="text-sm text-black/50">Buscando...</p>}
                {!loading && results.length === 0 && (
                  <p className="text-sm text-black/50">
                    Nenhum resultado para &ldquo;{query}&rdquo;. Tente outro termo.
                  </p>
                )}
                {!loading && results.length > 0 && (
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/produto/${p.slug}`}
                          onClick={onClose}
                          className="flex flex-col gap-2 group"
                        >
                          <div className="relative aspect-[3/4] bg-warm-gray/40 overflow-hidden">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="150px"
                              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-medium">{p.name}</p>
                            <p className="text-xs text-black/60">
                              {formatPrice(p.promoPrice ?? p.price)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {results.length > 0 && (
                  <button
                    onClick={goToResults}
                    className="mt-6 text-sm underline underline-offset-4 hover:text-olive"
                  >
                    Ver todos os resultados para &ldquo;{query}&rdquo;
                  </button>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
