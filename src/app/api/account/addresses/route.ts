import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { addressSchema } from "@/lib/validators";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;

  const addresses = await prisma.address.findMany({
    where: { userId: user!.id },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Endereço inválido." },
      { status: 400 }
    );
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: user!.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { ...parsed.data, userId: user!.id },
  });

  return NextResponse.json({ address }, { status: 201 });
}
