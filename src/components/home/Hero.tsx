import Image from "next/image";
import Button from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[560px] max-h-[900px] w-full overflow-hidden bg-black">
      <Image
        src="/images/campaign/hero.jpg"
        alt="Campanha LIVA New Season 01"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />

      <div className="relative h-full mx-auto max-w-[1440px] px-6 md:px-14 flex items-center">
        <div className="max-w-md text-white animate-fade-in">
          <p className="text-xs uppercase tracking-[0.25em] mb-4 text-white/80">
            {BRAND.collection}
          </p>
          <h1 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-5">
            {BRAND.headline}
          </h1>
          <p className="text-sm md:text-base text-white/85 mb-8 max-w-xs">{BRAND.supporting}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/roupas" size="lg" className="bg-white text-black hover:bg-white/90">
              Explorar coleção
            </Button>
            <Button
              href="/novidades"
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Ver novidades
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
