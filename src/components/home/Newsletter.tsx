import NewsletterForm from "@/components/home/NewsletterForm";

export default function Newsletter() {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-20 text-center">
        <h2 className="font-serif-editorial text-3xl md:text-4xl mb-3">Fique por dentro.</h2>
        <p className="text-sm text-white/70 mb-8 max-w-md mx-auto">
          Receba novidades, lançamentos e condições especiais da LIVA.
        </p>
        <div className="max-w-sm mx-auto">
          <NewsletterForm onDark />
        </div>
      </div>
    </section>
  );
}
