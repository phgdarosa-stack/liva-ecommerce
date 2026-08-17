import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ProfileForm from "@/components/account/ProfileForm";

export default async function DadosPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <ProfileForm
      initial={{ name: user?.name ?? "", phone: user?.phone ?? null, cpf: user?.cpf ?? null }}
      email={user?.email ?? ""}
    />
  );
}
