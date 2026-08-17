import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants";
import NewsletterForm from "@/components/home/NewsletterForm";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M15 3c0 2.5 2 4.5 4.5 4.5" />
    </svg>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-black/50 mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm hover:text-olive transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 mt-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif-editorial text-2xl tracking-[0.15em]">LIVA</span>
            <p className="text-sm text-black/60 mt-3 max-w-[220px]">Vista o seu agora.</p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LIVA no Instagram"
                className="p-2 border border-black/15 hover:border-olive hover:text-olive transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LIVA no TikTok"
                className="p-2 border border-black/15 hover:border-olive hover:text-olive transition-colors"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          <FooterColumn title="Atendimento" links={FOOTER_LINKS.atendimento} />
          <FooterColumn title="Comprar" links={FOOTER_LINKS.comprar} />
          <FooterColumn title="Institucional" links={FOOTER_LINKS.institucional} />

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs uppercase tracking-widest text-black/50 mb-4">Fique por dentro</h3>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-black/50">
            © {new Date().getFullYear()} LIVA. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3 text-xs text-black/50">
            <span className="uppercase tracking-wider text-black/40">Pagamento</span>
            <span>Pix</span>
            <span aria-hidden="true">·</span>
            <span>Cartão</span>
            <span aria-hidden="true">·</span>
            <span>Boleto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
