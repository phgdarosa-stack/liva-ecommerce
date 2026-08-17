import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/types";

export default function ProductSection({
  title,
  viewAllHref,
  viewAllLabel = "Ver tudo",
  products,
}: {
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-24">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-serif-editorial text-3xl md:text-4xl">{title}</h2>
        <Link href={viewAllHref} className="text-sm underline underline-offset-4 hover:text-olive">
          {viewAllLabel}
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
