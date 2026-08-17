import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getCatalog } from "@/lib/products";
import { parseCatalogParams, type SearchParamsInput } from "@/lib/parse-catalog-params";
import { CATEGORIES, categoryLabel } from "@/lib/constants";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  return { title: `${categoryLabel(categoria)} — LIVA` };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<SearchParamsInput>;
}) {
  const { categoria } = await params;
  if (!CATEGORIES.some((c) => c.slug === categoria)) notFound();

  const sp = await searchParams;
  const { filterValues, catalogFilters, sort } = parseCatalogParams(sp, categoria);
  const products = await getCatalog(catalogFilters);

  return (
    <CatalogView
      title={categoryLabel(categoria)}
      products={products}
      initialFilters={{ ...filterValues, sort }}
      showCategory
      categoryNavigable
    />
  );
}
