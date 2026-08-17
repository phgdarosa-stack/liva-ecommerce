"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { formatPhone } from "@/lib/utils";

export default function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Algo deu errado. Tente novamente.");
        return;
      }

      const signInRes = await signIn("credentials", { email, password, redirect: false });
      if (signInRes?.error) {
        setError("Conta criada, mas não foi possível entrar automaticamente. Tente fazer login.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 md:py-24">
      <h1 className="font-serif-editorial text-3xl mb-2">Criar conta</h1>
      <p className="text-sm text-black/60 mb-8">Rápido, simples, sem burocracia.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">
            Nome completo
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">
            Telefone
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        {error && <p className="text-xs text-error">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="w-full mt-2">
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="text-sm text-black/60 mt-6">
        Já tem conta?{" "}
        <Link
          href={`/entrar?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="underline underline-offset-4 hover:text-olive"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
