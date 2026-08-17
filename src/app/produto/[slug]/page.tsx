import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { formatInstallments } from "@/lib/utils";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartForm from "@/components/product/AddToCartForm";
import FavoriteButton from "@/components/product/FavoriteButton";
import Rating from "@/components/ui/Rating";
import Badge from "@/components/ui/Badge";
import ProductAccordion from "@/components/product/ProductAccordion";
import ReviewsSection from "@/components/product/ReviewsSection";
import RelatedProducts from "@/components/product/RelatedProducts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — LIVA`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id, 4);
  const unitPrice = product.promoPrice ?? product.price;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-14">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="max-w-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.newArrival && <Badge tone="black">Novo</Badge>}
                {product.bestseller && <Badge tone="olive">Mais vendido</Badge>}
              </div>
              <h1 className="font-serif-editorial text-3xl md:text-4xl mb-2">{product.name}</h1>
              <Rating value={product.rating} count={product.reviewCount} />
            </div>
            <FavoriteButton
              productId={product.id}
              className="shrink-0 border border-black/10"
            />
          </div>

          <p className="text-xs text-black/50 mt-4">
            {formatInstallments(unitPrice)}
          </p>

          <p className="text-xs text-black/50 mt-1">
            {totalStock > 0 ? "Em estoque" : "Produto indisponível no momento"}
          </p>

          <div className="mt-6">
            <AddToCartForm product={product} />
          </div>

          <div className="mt-8">
            <ProductAccordion
              description={product.description}
              composition={product.composition}
              care={product.care}
              price={unitPrice}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-black/10">
        <ReviewsSection
          productId={product.id}
          rating={product.rating}
          reviewCount={product.reviewCount}
          reviews={product.reviews ?? []}
        />
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
