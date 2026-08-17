"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImageDTO } from "@/types";

export default function ProductGallery({ images, productName }: { images: ProductImageDTO[]; productName: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            aria-label={`Ver imagem ${i + 1}`}
            aria-current={active === i}
            className={cn(
              "relative shrink-0 w-16 h-20 md:w-20 md:h-24 bg-warm-gray/40 overflow-hidden border-2 transition-colors",
              active === i ? "border-black" : "border-transparent hover:border-black/25"
            )}
          >
            <Image src={img.url} alt={img.alt} fill sizes="100px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative flex-1 aspect-[3/4] bg-warm-gray/40 overflow-hidden">
        {current && (
          <Image
            key={current.id}
            src={current.url}
            alt={current.alt || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover animate-fade-in"
          />
        )}
      </div>
    </div>
  );
}
