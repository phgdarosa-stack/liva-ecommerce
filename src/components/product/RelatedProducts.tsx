import ProductGrid from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/types";

export default function RelatedProducts({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="font-serif-editorial text-2xl mb-6">Você também vai gostar</h2>
      <ProductGrid products={products} />
    </section>
  );
}
