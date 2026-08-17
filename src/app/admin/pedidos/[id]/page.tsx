import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import OrderStatusForm from "@/components/admin/OrderStatusForm";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true, coupon: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{order.number}</h1>
        <p className="text-sm text-gray-500">
          {order.user.name} · {order.user.email} ·{" "}
          {new Date(order.createdAt).toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4">
                  <div className="relative w-14 h-18 bg-gray-100 shrink-0 overflow-hidden rounded">
                    <Image src={item.image} alt={item.productName} fill sizes="60px" className="object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-500">
                      {item.color} · {item.size} · Qtd. {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 text-sm space-y-1 bg-gray-50">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Descontos {order.coupon ? `(${order.coupon.code})` : ""}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>{order.shipping === 0 ? "Grátis" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-medium pt-1">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-medium mb-2">Endereço de entrega</h2>
            <p className="text-sm text-gray-600">
              {order.street}, {order.number_}
              {order.complement && ` — ${order.complement}`}
              <br />
              {order.neighborhood && `${order.neighborhood}, `}
              {order.city}/{order.state} · {order.cep}
            </p>
          </div>
        </div>

        <OrderStatusForm
          orderId={order.id}
          paymentStatus={order.paymentStatus}
          fulfillmentStatus={order.fulfillmentStatus}
        />
      </div>
    </div>
  );
}
