import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Pedido confirmado — LIVA" };

export default async function ConfirmacaoPage({
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

  if (!order || order.userId !== session?.user.id) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:py-24 text-center">
      <CheckCircle2 size={48} strokeWidth={1} className="mx-auto text-olive mb-6" />
      <h1 className="font-serif-editorial text-3xl md:text-4xl mb-3">Pedido confirmado.</h1>
      <p className="text-sm text-black/60 mb-1">
        Número do pedido: <strong className="text-black">{order.number}</strong>
      </p>
      <p className="text-sm text-black/60 mb-10">
        Enviamos os detalhes para {order.customerEmail}. Você pode acompanhar o status a qualquer
        momento em Minha Conta.
      </p>

      <div className="border border-black/10 text-left p-6 mb-10">
        <div className="divide-y divide-black/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 text-sm">
              <span>
                {item.productName} ({item.color}, {item.size}) × {item.quantity}
              </span>
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4 mt-2 border-t border-black/10 text-base font-medium">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button href={`/conta/pedidos/${order.number}`} variant="outline">
          Ver pedido
        </Button>
        <Button href="/roupas">Continuar comprando</Button>
      </div>
    </div>
  );
}
