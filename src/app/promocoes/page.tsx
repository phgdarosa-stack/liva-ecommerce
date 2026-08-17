import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getCatalog } from "@/lib/products";
import { parseCatalogParams, type SearchParamsInput } from "@/lib/parse-catalog-params";

export const metadata: Metadata = { title: "Promoções — LIVA" };

export default async function PromocoesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const { filterValues, catalogFilters, sort } = parseCatalogParams(params);
  const products = await getCatalog({ ...catalogFilters, promo: true });

  return (
    <div>
      <div className="bg-black text-white text-center py-3 text-xs tracking-wide">
        2 camisetas por R$149,90 · Cupom LIVA10 · Cupom FRETEGRATIS
      </div>
      <CatalogView
        title="Promoções"
        products={products}
        initialFilters={{ ...filterValues, promo: true, sort }}
        showCategory={false}
      />
    </div>
  );
}
