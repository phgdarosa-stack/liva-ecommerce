import type { CatalogFilters } from "./products";

export type SearchParamsInput = Record<string, string | string[] | undefined>;

type SortValue = NonNullable<CatalogFilters["sort"]>;
const VALID_SORTS: SortValue[] = ["relevancia", "novidade", "preco-asc", "preco-desc", "mais-vendido"];

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
  const rawSort = get("ordenar");
  const sort: SortValue = VALID_SORTS.includes(rawSort as SortValue) ? (rawSort as SortValue) : "relevancia";
  const q = get("q");

  const catalogFilters: CatalogFilters = {
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
  };

  return {
    filterValues: { category, sizes, colors, minPrice, maxPrice, promo, bestseller, newArrival },
    catalogFilters,
    sort,
  };
}
