import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { orders: { select: { total: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Clientes</h1>
        <p className="text-sm text-gray-500">{customers.length} clientes cadastrados</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 font-normal">Nome</th>
              <th className="px-5 py-3 font-normal">E-mail</th>
              <th className="px-5 py-3 font-normal">Telefone</th>
              <th className="px-5 py-3 font-normal">Pedidos</th>
              <th className="px-5 py-3 font-normal">Total gasto</th>
              <th className="px-5 py-3 font-normal">Último pedido</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const totalSpent = c.orders.reduce((s, o) => s + o.total, 0);
              const lastOrder = c.orders.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
              )[0];
              return (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">{c.name}</td>
                  <td className="px-5 py-3 text-gray-600">{c.email}</td>
                  <td className="px-5 py-3 text-gray-600">{c.phone ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{c.orders.length}</td>
                  <td className="px-5 py-3 text-gray-600">{formatPrice(totalSpent)}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString("pt-BR") : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
