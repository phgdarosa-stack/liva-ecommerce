export type SearchParamsInput = Record<string, string | string[] | undefined>;

export function parseCatalogParams(searchParams: SearchParamsInput, category?: string) {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const sizes = get("tamanho")?.split(",").filter(Boolean) ?? [];
  const colors = get("cor")?.split(",").filter(Boolean) ?? [];
  const minPrice = get("min") ? Number(get("min")) : undefined;
  const maxPrice = get("max") ? Number(get("max")) : undefined;
  const promo = get("promo") === "1";
  const bestseller = get("bestseller") === "1";
  const newArrival = get("novidade") === "1";
  const sort = (get("ordenar") as "novidade" | "preco-asc" | "preco-desc" | "mais-vendido" | undefined) ?? "relevancia";
  const q = get("q");

  return {
    filterValues: { category, sizes, colors, minPrice, maxPrice, promo, bestseller, newArrival },
    catalogFilters: {
      category,
      sizes,
      colors,
      minPrice,
      maxPrice,
      promo,
      bestseller,
      newArrival,
      sort,
      q,
    },
    sort,
  };
}
