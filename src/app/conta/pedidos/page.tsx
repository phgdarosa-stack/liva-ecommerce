import Link from "next/link";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { FULFILLMENT_STEPS } from "@/lib/constants";
import EmptyState from "@/components/ui/EmptyState";

export default async function PedidosPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package size={40} strokeWidth={1} />}
        title="Você ainda não fez nenhum pedido."
        ctaLabel="Explorar produtos"
        ctaHref="/roupas"
      />
    );
  }

  return (
    <div className="border border-black/10 divide-y divide-black/10">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/conta/pedidos/${order.number}`}
          className="flex items-center justify-between p-4 hover:bg-black/[0.02] transition-colors flex-wrap gap-2"
        >
          <div>
            <p className="text-sm font-medium">{order.number}</p>
            <p className="text-xs text-black/50">
              {new Date(order.createdAt).toLocaleDateString("pt-BR")} ·{" "}
              {FULFILLMENT_STEPS.find((s) => s.key === order.fulfillmentStatus)?.label}
            </p>
          </div>
          <p className="text-sm">{formatPrice(order.total)}</p>
        </Link>
      ))}
    </div>
  );
}
