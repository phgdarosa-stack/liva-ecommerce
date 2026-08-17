import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { number } = await params;
  const order = await prisma.order.findUnique({
    where: { number },
    include: { items: true, coupon: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }
  if (order.userId !== user!.id && user!.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso restrito." }, { status: 403 });
  }

  return NextResponse.json({ order });
}
