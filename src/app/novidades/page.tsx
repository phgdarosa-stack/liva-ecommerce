import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getCatalog } from "@/lib/products";
import { parseCatalogParams, type SearchParamsInput } from "@/lib/parse-catalog-params";

export const metadata: Metadata = { title: "Novidades — LIVA" };

export default async function NovidadesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const { filterValues, catalogFilters, sort } = parseCatalogParams(params);
  const products = await getCatalog({ ...catalogFilters, newArrival: true });

  return (
    <CatalogView
      title="Novidades"
      products={products}
      initialFilters={{ ...filterValues, newArrival: true, sort }}
      showCategory={false}
    />
  );
}
