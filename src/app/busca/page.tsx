import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getCatalog } from "@/lib/products";
import { parseCatalogParams, type SearchParamsInput } from "@/lib/parse-catalog-params";

export const metadata: Metadata = { title: "Busca — LIVA" };

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const { filterValues, catalogFilters, sort } = parseCatalogParams(params);
  const q = typeof params.q === "string" ? params.q : "";
  const products = await getCatalog({ ...catalogFilters, q });

  return (
    <CatalogView
      title={q ? `Resultados para "${q}"` : "Busca"}
      products={products}
      initialFilters={{ ...filterValues, sort }}
      showCategory
      preserveParams={q ? { q } : undefined}
    />
  );
}
