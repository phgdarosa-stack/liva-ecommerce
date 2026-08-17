import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Criar conta — LIVA" };

export default async function CriarContaPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <RegisterForm callbackUrl={callbackUrl || "/conta"} />;
}
