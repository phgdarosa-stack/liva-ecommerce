"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useFavoritesStore } from "@/store/favorites";

export default function LoginForm({ callbackUrl, gated }: { callbackUrl: string; gated: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const favoriteIds = useFavoritesStore((s) => s.productIds);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    if (favoriteIds.length > 0) {
      try {
        await fetch("/api/favorites/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: favoriteIds }),
        });
      } catch {
        // best effort
      }
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 md:py-24">
      <h1 className="font-serif-editorial text-3xl mb-2">Entrar</h1>
      <p className="text-sm text-black/60 mb-8">
        {gated ? "Entre ou crie sua conta para continuar." : "Acesse sua conta LIVA."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <label htmlFor="password" className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        {error && <p className="text-xs text-error">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="w-full mt-2">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="text-sm text-black/60 mt-6">
        Ainda não tem conta?{" "}
        <Link
          href={`/criar-conta?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="underline underline-offset-4 hover:text-olive"
        >
          Criar conta
        </Link>
      </p>

      <div className="mt-10 border-t border-black/10 pt-6">
        <p className="text-xs text-black/40 mb-2">Conta de demonstração</p>
        <p className="text-xs text-black/50">cliente@liva.com.br · Liva@Cliente123</p>
      </div>
    </div>
  );
}
