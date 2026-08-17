import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { FULFILLMENT_STEPS } from "@/lib/constants";

export default async function ContaOverviewPage() {
  const session = await auth();
  const user = session!.user;

  const [fullUser, recentOrders] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-black/50">Olá,</p>
        <p className="text-xl font-serif-editorial">{fullUser?.name}</p>
        <p className="text-sm text-black/50 mt-1">{fullUser?.email}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-black/50">Pedidos recentes</h2>
          <Link href="/conta/pedidos" className="text-xs underline underline-offset-4 hover:text-olive">
            Ver todos
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-black/50">Você ainda não fez nenhum pedido.</p>
        ) : (
          <div className="border border-black/10 divide-y divide-black/10">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/conta/pedidos/${order.number}`}
                className="flex items-center justify-between p-4 hover:bg-black/[0.02] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{order.number}</p>
                  <p className="text-xs text-black/50">
                    {FULFILLMENT_STEPS.find((s) => s.key === order.fulfillmentStatus)?.label}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(order.total)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
