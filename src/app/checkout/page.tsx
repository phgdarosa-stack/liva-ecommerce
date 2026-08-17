import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = { title: "Finalizar compra — LIVA" };

export default async function CheckoutPage() {
  const session = await auth();
  const user = session!.user;

  const [addresses, fullUser] = await Promise.all([
    prisma.address.findMany({ where: { userId: user.id }, orderBy: { isDefault: "desc" } }),
    prisma.user.findUnique({ where: { id: user.id } }),
  ]);

  const defaultAddress = addresses[0];

  return (
    <CheckoutFlow
      defaultData={{
        customerName: fullUser?.name ?? "",
        customerCpf: fullUser?.cpf ?? "",
        customerEmail: fullUser?.email ?? "",
        customerPhone: fullUser?.phone ?? "",
        cep: defaultAddress?.cep ?? "",
        street: defaultAddress?.street ?? "",
        number: defaultAddress?.number ?? "",
        complement: defaultAddress?.complement ?? "",
        neighborhood: defaultAddress?.neighborhood ?? "",
        city: defaultAddress?.city ?? "",
        state: defaultAddress?.state ?? "",
        paymentMethod: "pix",
      }}
      savedAddresses={addresses}
    />
  );
}
