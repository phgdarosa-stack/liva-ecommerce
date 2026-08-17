"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  usageLimit: number | null;
  usageCount: number;
  firstPurchaseOnly: boolean;
  active: boolean;
  expiresAt: string | null;
}

const emptyForm = {
  code: "",
  type: "percent",
  value: 10,
  minOrder: 0,
  usageLimit: "" as string | number,
  firstPurchaseOnly: false,
};

export default function CouponsManager({ initial }: { initial: Coupon[] }) {
  const [coupons, setCoupons] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoupons((prev) => [data.coupon, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Cupom criado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(coupon: Coupon) {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active }),
    });
    if (res.ok) {
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este cupom?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Cupons</h1>
          <p className="text-sm text-gray-500">{coupons.length} cupons cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <Plus size={15} /> Novo cupom
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-lg p-5 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Código</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-900"
            >
              <option value="percent">Percentual (%)</option>
              <option value="fixed">Valor fixo (R$)</option>
              <option value="shipping">Frete grátis</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Valor</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Pedido mínimo (R$)</label>
            <input
              type="number"
              value={form.minOrder}
              onChange={(e) => setForm((f) => ({ ...f, minOrder: Number(e.target.value) }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Limite de uso (opcional)</label>
            <input
              type="number"
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-900"
            />
          </div>
          <label className="flex items-center gap-2 text-sm self-end pb-2">
            <input
              type="checkbox"
              checked={form.firstPurchaseOnly}
              onChange={(e) => setForm((f) => ({ ...f, firstPurchaseOnly: e.target.checked }))}
              className="w-4 h-4"
            />
            Somente primeira compra
          </label>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Criar cupom"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 font-normal">Código</th>
              <th className="px-5 py-3 font-normal">Tipo</th>
              <th className="px-5 py-3 font-normal">Valor</th>
              <th className="px-5 py-3 font-normal">Uso</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3 font-medium">{c.code}</td>
                <td className="px-5 py-3 text-gray-600 capitalize">{c.type}</td>
                <td className="px-5 py-3 text-gray-600">
                  {c.type === "percent" ? `${c.value}%` : c.type === "fixed" ? `R$${c.value}` : "Frete grátis"}
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {c.usageCount}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.active ? "Ativo" : "Inativo"}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
