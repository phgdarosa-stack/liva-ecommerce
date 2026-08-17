"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatCep, isValidCep } from "@/lib/utils";

const STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

interface Address {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  isDefault: boolean;
}

const emptyForm = {
  label: "Casa",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  isDefault: false,
};

export default function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidCep(form.cep)) {
      toast.error("CEP inválido.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAddresses((prev) => [data.address, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Endereço adicionado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Endereço removido.");
  }

  return (
    <div>
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-black/50 mb-4">Você ainda não tem endereços salvos.</p>
      )}

      <div className="flex flex-col gap-3 mb-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="flex items-start justify-between border border-black/10 p-4">
            <div className="text-sm">
              <p className="font-medium">
                {addr.label} {addr.isDefault && <span className="text-olive text-xs">(padrão)</span>}
              </p>
              <p className="text-black/60">
                {addr.street}, {addr.number}
                {addr.complement && ` — ${addr.complement}`}
                <br />
                {addr.neighborhood && `${addr.neighborhood}, `}
                {addr.city}/{addr.state} · {addr.cep}
              </p>
            </div>
            <button
              onClick={() => handleDelete(addr.id)}
              aria-label="Remover endereço"
              className="p-1.5 text-black/40 hover:text-error"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          <Plus size={15} /> Adicionar endereço
        </Button>
      ) : (
        <form onSubmit={handleAdd} className="border border-black/10 p-5 max-w-md space-y-3">
          <input
            required
            placeholder="Nome do endereço (ex: Casa, Trabalho)"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
          <input
            required
            placeholder="CEP"
            value={form.cep}
            onChange={(e) => setForm((f) => ({ ...f, cep: formatCep(e.target.value) }))}
            maxLength={9}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
          <div className="flex gap-3">
            <input
              required
              placeholder="Rua"
              value={form.street}
              onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
              className="flex-1 border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
            <input
              required
              placeholder="Número"
              value={form.number}
              onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
              className="w-24 border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
          <input
            placeholder="Complemento (opcional)"
            value={form.complement}
            onChange={(e) => setForm((f) => ({ ...f, complement: e.target.value }))}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
          <input
            placeholder="Bairro"
            value={form.neighborhood}
            onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
          <div className="flex gap-3">
            <input
              required
              placeholder="Cidade"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="flex-1 border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
            <select
              required
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              className="w-24 border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black"
            >
              <option value="">UF</option>
              {STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
              className="w-4 h-4 accent-black"
            />
            Definir como endereço padrão
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar endereço"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
