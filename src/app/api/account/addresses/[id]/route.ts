import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { id } = await params;
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== user!.id) {
    return NextResponse.json({ error: "Endereço não encontrado." }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
