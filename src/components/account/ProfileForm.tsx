"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { formatCpf, formatPhone } from "@/lib/utils";

export default function ProfileForm({
  initial,
  email,
}: {
  initial: { name: string; phone: string | null; cpf: string | null };
  email: string;
}) {
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [cpf, setCpf] = useState(initial.cpf ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, cpf }),
      });
      if (!res.ok) throw new Error();
      toast.success("Dados atualizados.");
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">Nome completo</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">E-mail</label>
        <input
          value={email}
          disabled
          className="w-full border border-black/15 bg-black/5 px-3 py-2.5 text-sm text-black/50"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">CPF</label>
        <input
          value={cpf}
          onChange={(e) => setCpf(formatCpf(e.target.value))}
          className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">Telefone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
      </div>
      <Button type="submit" disabled={loading} className="self-start mt-2">
        {loading ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
