import Image from "next/image";
import Button from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";

export default function CollectionSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 md:gap-4 items-center">
        <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-warm-gray/40 order-2 md:order-1">
          <Image
            src="/images/campaign/collection-banner.jpg"
            alt={`Coleção ${BRAND.collection}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 md:order-2 md:pl-12 lg:pl-20">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50 mb-4">
            {BRAND.collection}
          </p>
          <h2 className="font-serif-editorial text-4xl md:text-5xl leading-tight mb-5">
            Uma coleção criada para combinar com o seu agora.
          </h2>
          <p className="text-sm md:text-base text-black/65 mb-8 max-w-md">
            Peças pensadas para o dia a dia real: tecidos confortáveis, caimento fácil de vestir
            e uma paleta que combina entre si — do café da manhã ao fim de noite.
          </p>
          <Button href="/roupas" size="lg">
            Explorar coleção
          </Button>
        </div>
      </div>
    </section>
  );
}
