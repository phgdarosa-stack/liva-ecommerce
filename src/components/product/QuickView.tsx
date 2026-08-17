"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import AddToCartForm from "@/components/product/AddToCartForm";
import Rating from "@/components/ui/Rating";
import type { ProductDTO } from "@/types";

export default function QuickView({
  slug,
  open,
  onClose,
}: {
  slug: string;
  open: boolean;
  onClose: () => void;
}) {
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.product))
      .finally(() => setLoading(false));
  }, [open, slug]);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[94vw] max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
          <Dialog.Close asChild>
            <button aria-label="Fechar" className="absolute top-4 right-4 z-10 p-1.5 bg-white rounded-full shadow">
              <X size={18} strokeWidth={1.5} />
            </button>
          </Dialog.Close>

          {loading && (
            <div className="p-16 text-center text-sm text-black/50">Carregando...</div>
          )}

          {!loading && product && (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[3/4] bg-warm-gray/30">
                {product.images[0] && (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col">
                <Dialog.Title className="font-serif-editorial text-2xl mb-2">
                  {product.name}
                </Dialog.Title>
                <Rating value={product.rating} count={product.reviewCount} className="mb-4" />
                <AddToCartForm product={product} compact />
                <Link
                  href={`/produto/${product.slug}`}
                  onClick={onClose}
                  className="text-xs underline underline-offset-4 mt-6 hover:text-olive"
                >
                  Ver detalhes completos do produto
                </Link>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
