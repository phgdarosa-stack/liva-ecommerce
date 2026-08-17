import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromoStrip from "@/components/layout/PromoStrip";
import CartDrawer from "@/components/cart/CartDrawer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LIVA — New Season 01",
  description:
    "LIVA — moda feminina contemporânea. Vista o seu agora. Descubra a coleção New Season 01.",
  metadataBase: new URL("https://liva.com.br"),
  openGraph: {
    title: "LIVA — New Season 01",
    description: "Peças para acompanhar o seu agora.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-black">
        <Providers>
          <a
            href="#conteudo-principal"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:text-sm"
          >
            Pular para o conteúdo
          </a>
          <PromoStrip />
          <Header />
          <main id="conteudo-principal" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
