import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { FULFILLMENT_STEPS } from "@/lib/constants";

const PAYMENT_LABEL: Record<string, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  recusado: "Recusado",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Pedidos</h1>
        <p className="text-sm text-gray-500">{orders.length} pedidos</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 font-normal">Pedido</th>
              <th className="px-5 py-3 font-normal">Cliente</th>
              <th className="px-5 py-3 font-normal">Data</th>
              <th className="px-5 py-3 font-normal">Pagamento</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-5 py-3">
                  <Link href={`/admin/pedidos/${order.id}`} className="hover:underline">
                    {order.number}
                  </Link>
                </td>
                <td className="px-5 py-3 text-gray-600">{order.user?.name}</td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-5 py-3 text-gray-600">{PAYMENT_LABEL[order.paymentStatus] ?? order.paymentStatus}</td>
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
