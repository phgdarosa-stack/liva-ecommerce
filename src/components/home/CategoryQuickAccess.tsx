import Link from "next/link";
import Image from "next/image";

const FEATURED_CATEGORIES = [
  { slug: "tops", label: "Tops", image: "/images/campaign/tops-model.jpg" },
  { slug: "blusas", label: "Blusas", image: "/images/campaign/blusas-model.jpg" },
  { slug: "calcas", label: "Calças", image: "/images/campaign/calcas-model.jpg" },
  { slug: "vestidos", label: "Vestidos", image: "/images/campaign/vestidos-model.jpg" },
  { slug: "conjuntos", label: "Conjuntos", image: "/images/campaign/conjuntos-model.jpg" },
];

export default function CategoryQuickAccess() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-24">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-serif-editorial text-3xl md:text-4xl">Categorias</h2>
        <Link href="/roupas" className="text-sm underline underline-offset-4 hover:text-olive">
          Ver tudo
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {FEATURED_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/roupas/${cat.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-warm-gray/40 block"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 text-white text-sm md:text-base tracking-wide">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
