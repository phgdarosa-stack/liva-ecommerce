import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function PATCH(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user!.id },
    data: {
      name: body.name,
      phone: typeof body.phone === "string" ? body.phone : undefined,
      cpf: typeof body.cpf === "string" ? body.cpf : undefined,
    },
  });

  return NextResponse.json({
    user: { name: updated.name, phone: updated.phone, cpf: updated.cpf },
  });
}
