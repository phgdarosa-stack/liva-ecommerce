import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { FULFILLMENT_STEPS } from "@/lib/constants";
import StatCard from "@/components/admin/StatCard";
import SalesChart from "@/components/admin/SalesChart";

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [orders, customersCount, lowStockVariants, recentOrders] = await Promise.all([
    prisma.order.findMany({ select: { total: true, createdAt: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: { select: { name: true, sku: true } } },
      orderBy: { stock: "asc" },
      take: 8,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const todaysSales = orders
    .filter((o) => o.createdAt >= startOfToday)
    .reduce((sum, o) => sum + o.total, 0);
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    const total = orders
      .filter((o) => o.createdAt >= day && o.createdAt < nextDay)
      .reduce((sum, o) => sum + o.total, 0);
    return { label: day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), total };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral da loja LIVA.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Vendas hoje" value={formatPrice(todaysSales)} />
        <StatCard label="Vendas totais" value={formatPrice(totalSales)} />
        <StatCard label="Pedidos" value={String(orders.length)} />
        <StatCard label="Clientes" value={String(customersCount)} />
        <StatCard label="Ticket médio" value={formatPrice(avgOrderValue)} />
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <SalesChart data={chartData} />

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">Estoque baixo</p>
            <Link href="/admin/estoque" className="text-xs text-gray-500 hover:text-gray-900 underline">
              Ver tudo
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockVariants.length === 0 && (
              <p className="text-sm text-gray-400">Nenhum produto com estoque baixo.</p>
            )}
            {lowStockVariants.map((v) => (
              <div key={v.id} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <p className="truncate">{v.product.name}</p>
                  <p className="text-xs text-gray-400">
                    {v.color} · {v.size}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    v.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {v.stock === 0 ? "Esgotado" : `${v.stock} un.`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-5 pb-0">
          <p className="text-xs uppercase tracking-wider text-gray-500">Pedidos recentes</p>
          <Link href="/admin/pedidos" className="text-xs text-gray-500 hover:text-gray-900 underline">
            Ver todos
          </Link>
        </div>
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="px-5 py-2 font-normal">Pedido</th>
              <th className="px-5 py-2 font-normal">Cliente</th>
              <th className="px-5 py-2 font-normal">Status</th>
              <th className="px-5 py-2 font-normal text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/pedidos/${order.id}`} className="hover:underline">
                    {order.number}
                  </Link>
                </td>
                <td className="px-5 py-3 text-gray-600">{order.user?.name}</td>
                <td className="px-5 py-3 text-gray-600">
                  {FULFILLMENT_STEPS.find((s) => s.key === order.fulfillmentStatus)?.label}
                </td>
                <td className="px-5 py-3 text-right">{formatPrice(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
