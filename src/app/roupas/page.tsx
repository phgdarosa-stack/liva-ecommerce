import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getCatalog } from "@/lib/products";
import { parseCatalogParams, type SearchParamsInput } from "@/lib/parse-catalog-params";

export const metadata: Metadata = { title: "Roupas — LIVA" };

export default async function RoupasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const { filterValues, catalogFilters, sort } = parseCatalogParams(params);
  const products = await getCatalog(catalogFilters);

  return (
    <CatalogView
      title="Roupas"
      products={products}
      initialFilters={{ ...filterValues, sort }}
      categoryNavigable
    />
  );
}
