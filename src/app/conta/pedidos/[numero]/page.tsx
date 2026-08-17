import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import OrderTracking from "@/components/account/OrderTracking";

const PAYMENT_LABEL: Record<string, string> = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
  boleto: "Boleto",
};

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { number: numero },
    include: { items: true },
  });

  if (!order || order.userId !== session!.user.id) notFound();

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-medium">{order.number}</h2>
          <p className="text-sm text-black/50">
            Feito em {new Date(order.createdAt).toLocaleDateString("pt-BR")} ·{" "}
            {PAYMENT_LABEL[order.paymentMethod]}
          </p>
        </div>
        <p className="text-lg font-medium">{formatPrice(order.total)}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-black/50 mb-4">
          Status do pedido
        </h3>
        <OrderTracking status={order.fulfillmentStatus} />
      </div>

      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-black/50 mb-4">Itens</h3>
        <div className="border border-black/10 divide-y divide-black/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4">
              <div className="relative w-16 h-20 bg-warm-gray/40 shrink-0 overflow-hidden">
                <Image src={item.image} alt={item.productName} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-black/55">
                  {item.color} · Tam. {item.size} · Qtd. {item.quantity}
                </p>
              </div>
              <p className="text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-black/50 mb-2">Entrega</h3>
          <p className="text-sm text-black/65">
            {order.street}, {order.number_}
            {order.complement && ` — ${order.complement}`}
            <br />
            {order.neighborhood && `${order.neighborhood}, `}
            {order.city}/{order.state} · {order.cep}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-black/50 mb-2">Resumo</h3>
          <div className="text-sm text-black/65 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span>Descontos</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frete</span>
              <span>{order.shipping === 0 ? "Grátis" : formatPrice(order.shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
