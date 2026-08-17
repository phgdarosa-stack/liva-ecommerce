import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);

  const order = await prisma.order.update({
    where: { id },
    data: {
      paymentStatus: body?.paymentStatus,
      fulfillmentStatus: body?.fulfillmentStatus,
    },
  });

  return NextResponse.json({ order });
}
