"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import CatalogFilters, { type FilterValues } from "@/components/catalog/CatalogFilters";
import FilterBottomSheet from "@/components/catalog/FilterBottomSheet";
import SortSelect from "@/components/catalog/SortSelect";
import ProductGrid from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/types";

export default function CatalogView({
  title,
  products,
  initialFilters,
  showCategory = true,
  categoryNavigable = false,
  preserveParams,
}: {
  title: string;
  products: ProductCardData[];
  initialFilters: FilterValues & { sort: string };
  showCategory?: boolean;
  /** Only /roupas pages re-route to /roupas/{categoria} on category change. */
  categoryNavigable?: boolean;
  /** Extra query params (e.g. ?q=) carried through on every filter change. */
  preserveParams?: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { sort, ...filterValues } = initialFilters;

  function navigate(next: FilterValues, nextSort = sort) {
    const params = new URLSearchParams();
    if (preserveParams) {
      for (const [key, value] of Object.entries(preserveParams)) params.set(key, value);
    }
    if (next.sizes.length) params.set("tamanho", next.sizes.join(","));
    if (next.colors.length) params.set("cor", next.colors.join(","));
    if (next.minPrice !== undefined) params.set("min", String(next.minPrice));
    if (next.maxPrice !== undefined) params.set("max", String(next.maxPrice));
    if (next.promo) params.set("promo", "1");
    if (next.bestseller) params.set("bestseller", "1");
    if (next.newArrival) params.set("novidade", "1");
    if (nextSort && nextSort !== "relevancia") params.set("ordenar", nextSort);

    const basePath = categoryNavigable ? (next.category ? `/roupas/${next.category}` : "/roupas") : pathname;
    const query = params.toString();

    startTransition(() => {
      router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
    });
  }

  function handleClear() {
    navigate({ sizes: [], colors: [], promo: false, bestseller: false, newArrival: false }, "relevancia");
  }

  const activeCount =
    filterValues.sizes.length +
    filterValues.colors.length +
    (filterValues.promo ? 1 : 0) +
    (filterValues.bestseller ? 1 : 0) +
    (filterValues.newArrival ? 1 : 0) +
    (filterValues.minPrice !== undefined ? 1 : 0) +
    (filterValues.maxPrice !== undefined ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif-editorial text-3xl md:text-4xl">{title}</h1>
          <p className="text-sm text-black/50 mt-1">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 border border-black/25 px-3 py-2 text-sm"
          >
            <SlidersHorizontal size={15} strokeWidth={1.5} />
            Filtros {activeCount > 0 && `(${activeCount})`}
          </button>
          <SortSelect value={sort} onChange={(v) => navigate(filterValues, v)} />
        </div>
      </div>

      <div className="flex gap-10">
        <aside className="hidden md:block w-56 shrink-0">
          <CatalogFilters values={filterValues} onChange={navigate} showCategory={showCategory} />
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid products={products} />
        </div>
      </div>

      <FilterBottomSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        values={filterValues}
        onChange={navigate}
        onClear={handleClear}
        resultCount={products.length}
        showCategory={showCategory}
      />
    </div>
  );
}
