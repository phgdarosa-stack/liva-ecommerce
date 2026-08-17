import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import type { ProductCardData } from "@/types";

export default function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto encontrado."
        description="Tente ajustar os filtros ou buscar por outro termo."
        ctaLabel="Ver todos os produtos"
        ctaHref="/roupas"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
