import Hero from "@/components/home/Hero";
import CategoryQuickAccess from "@/components/home/CategoryQuickAccess";
import ProductSection from "@/components/home/ProductSection";
import PromotionBanner from "@/components/home/PromotionBanner";
import CollectionSection from "@/components/home/CollectionSection";
import BrandBenefits from "@/components/home/BrandBenefits";
import Newsletter from "@/components/home/Newsletter";
import { getNewArrivals, getBestsellers } from "@/lib/products";

export default async function HomePage() {
  const [newArrivals, bestsellers] = await Promise.all([
    getNewArrivals(4),
    getBestsellers(4),
  ]);

  return (
    <>
      <Hero />
      <CategoryQuickAccess />
      <ProductSection title="Novidades" viewAllHref="/novidades" products={newArrivals} />
      <ProductSection title="Mais vendidos" viewAllHref="/roupas?ordenar=mais-vendido" products={bestsellers} />
      <PromotionBanner />
      <CollectionSection />
      <BrandBenefits />
      <Newsletter />
    </>
  );
}
