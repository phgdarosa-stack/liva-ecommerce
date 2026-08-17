"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useCartStore, useCartCount } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import MobileNav from "./MobileNav";
import SearchOverlay from "./SearchOverlay";
import NavDropdown from "./NavDropdown";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartCount();
  const openCart = useCartStore((s) => s.openCart);
  const favoritesCount = useFavoritesStore((s) => s.productIds.length);

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm border-b border-black/10">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2 md:hidden">
            <button
              aria-label="Abrir menu"
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          <Link
            href="/"
            className="font-serif-editorial text-2xl md:text-3xl tracking-[0.15em] font-medium"
          >
            LIVA
          </Link>

          <nav className="hidden md:flex items-center gap-8 ml-12" aria-label="Navegação principal">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <NavDropdown key={link.label} label={link.label} href={link.href} items={link.children} />
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm tracking-wide hover:text-olive transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-1 md:gap-2">
            <button
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:text-olive transition-colors"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link
              href={session ? "/conta" : "/entrar"}
              aria-label="Minha conta"
              className="p-2 hover:text-olive transition-colors hidden sm:inline-flex"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link
              href="/favoritos"
              aria-label={`Favoritos${favoritesCount ? `, ${favoritesCount} itens` : ""}`}
              className="p-2 hover:text-olive transition-colors relative hidden sm:inline-flex"
            >
              <Heart size={20} strokeWidth={1.5} />
              {favoritesCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-olive text-white text-[10px] flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <button
              aria-label={`Carrinho${cartCount ? `, ${cartCount} itens` : ""}`}
              onClick={openCart}
              className="p-2 hover:text-olive transition-colors relative"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} session={session} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
