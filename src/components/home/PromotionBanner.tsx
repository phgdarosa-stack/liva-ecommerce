import Image from "next/image";
import Button from "@/components/ui/Button";

export default function PromotionBanner() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="relative h-[420px] md:h-[480px] overflow-hidden bg-black">
        <Image
          src="/images/campaign/promo-banner.jpg"
          alt="Promoções LIVA"
          fill
          sizes="100vw"
          className="object-cover object-[30%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/10 to-transparent" />
        <div className="relative h-full flex items-center justify-end px-6 md:px-16">
          <div className="max-w-sm text-white text-right">
            <h2 className="font-serif-editorial text-4xl md:text-5xl leading-tight mb-4">
              Seu novo favorito está aqui.
            </h2>
            <p className="text-sm text-white/85 mb-6">
              Peças selecionadas com condições especiais por tempo limitado.
            </p>
            <Button href="/promocoes" size="lg" className="bg-white text-black hover:bg-white/90">
              Ver promoções
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
