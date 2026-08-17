"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function NewsletterForm({
  compact = false,
  onDark = false,
}: {
  compact?: boolean;
  onDark?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      toast.success("Cadastro confirmado. Bem-vinda à LIVA.");
      setEmail("");
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex", compact ? "flex-col gap-3" : "gap-3")}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu e-mail"
        className={cn(
          "bg-transparent border-b outline-none py-2 text-sm",
          onDark
            ? "border-white/30 focus:border-white placeholder:text-white/40 text-white"
            : "border-black/30 focus:border-black placeholder:text-black/40",
          compact ? "w-full" : "flex-1 min-w-0"
        )}
      />
      <Button
        type="submit"
        size={compact ? "sm" : "md"}
        disabled={loading}
        className={cn(compact && "self-start", onDark && "bg-white text-black hover:bg-white/85")}
      >
        {loading ? "Enviando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
