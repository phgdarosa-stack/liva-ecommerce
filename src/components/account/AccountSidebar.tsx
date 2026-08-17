"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/conta", label: "Visão geral" },
  { href: "/conta/dados", label: "Meus dados" },
  { href: "/conta/enderecos", label: "Endereços" },
  { href: "/conta/pedidos", label: "Pedidos" },
  { href: "/favoritos", label: "Favoritos" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0" aria-label="Navegação da conta">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 text-sm whitespace-nowrap md:whitespace-normal",
              active ? "bg-black text-white" : "text-black/70 hover:bg-black/5"
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-3 py-2 text-sm text-left text-black/70 hover:bg-black/5 whitespace-nowrap md:whitespace-normal"
      >
        Sair
      </button>
    </nav>
  );
}
