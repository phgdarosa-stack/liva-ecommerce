"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Boxes,
  LogOut,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/cupons", label: "Cupons", icon: Tag },
  { href: "/admin/estoque", label: "Estoque", icon: Boxes },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <span className="font-semibold tracking-wide text-sm">LIVA ADMIN</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5" aria-label="Navegação administrativa">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors",
                active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <link.icon size={16} strokeWidth={1.75} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
        >
          <Store size={16} strokeWidth={1.75} />
          Ver loja
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100 w-full text-left"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Sair
        </button>
      </div>
    </aside>
  );
}
