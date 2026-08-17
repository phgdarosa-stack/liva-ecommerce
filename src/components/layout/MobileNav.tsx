"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X, User, Heart } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { Session } from "next-auth";

export default function MobileNav({
  open,
  onClose,
  session,
}: {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 md:hidden animate-fade-in" />
        <Dialog.Content
          className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-ivory z-50 md:hidden flex flex-col
                     animate-slide-in-right"
          style={{ animationName: "slide-in-right" }}
        >
          <Dialog.Title className="sr-only">Menu de navegação</Dialog.Title>
          <div className="flex items-center justify-between px-5 h-16 border-b border-black/10">
            <span className="font-serif-editorial text-xl tracking-[0.15em]">LIVA</span>
            <Dialog.Close asChild>
              <button aria-label="Fechar menu" className="p-2 -mr-2">
                <X size={22} strokeWidth={1.5} />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Navegação mobile">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="border-b border-black/5 py-3">
                  <Link href={link.href} onClick={onClose} className="text-base font-medium">
                    {link.label}
                  </Link>
                  {link.children && (
                    <ul className="mt-2 pl-3 space-y-2">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className="text-sm text-black/70 hover:text-olive"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-4">
              <Link
                href={session ? "/conta" : "/entrar"}
                onClick={onClose}
                className="flex items-center gap-3 text-sm"
              >
                <User size={18} strokeWidth={1.5} />
                {session ? "Minha conta" : "Entrar ou criar conta"}
              </Link>
              <Link href="/favoritos" onClick={onClose} className="flex items-center gap-3 text-sm">
                <Heart size={18} strokeWidth={1.5} />
                Favoritos
              </Link>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
