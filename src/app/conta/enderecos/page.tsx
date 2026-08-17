import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AddressManager from "@/components/account/AddressManager";

export default async function EnderecosPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: { isDefault: "desc" },
  });

  return <AddressManager initialAddresses={addresses} />;
}
