"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Row {
  variantId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
}

export default function InventoryTable({ rows: initialRows }: { rows: Row[] }) {
  const [rows, setRows] = useState(initialRows);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateStock(variantId: string, stock: number) {
    setSavingId(variantId);
    try {
      const res = await fetch(`/api/admin/inventory/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      if (!res.ok) throw new Error();
      setRows((prev) => prev.map((r) => (r.variantId === variantId ? { ...r, stock } : r)));
      toast.success("Estoque atualizado.");
    } catch {
      toast.error("Algo deu errado.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
            <th className="px-5 py-3 font-normal">Produto</th>
            <th className="px-5 py-3 font-normal">SKU</th>
            <th className="px-5 py-3 font-normal">Variação</th>
            <th className="px-5 py-3 font-normal">Estoque</th>
            <th className="px-5 py-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.variantId} className="border-b border-gray-50 last:border-0">
              <td className="px-5 py-3">{row.productName}</td>
              <td className="px-5 py-3 text-gray-500">{row.sku}</td>
              <td className="px-5 py-3 text-gray-600">
                {row.color} · {row.size}
              </td>
              <td className="px-5 py-3">
                <input
                  type="number"
                  min={0}
                  defaultValue={row.stock}
                  disabled={savingId === row.variantId}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value !== row.stock) updateStock(row.variantId, value);
                  }}
                  className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm outline-none focus:border-gray-900"
                />
              </td>
              <td className="px-5 py-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    row.stock === 0
                      ? "bg-red-100 text-red-700"
                      : row.stock <= 5
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {row.stock === 0 ? "Esgotado" : row.stock <= 5 ? "Estoque baixo" : "Disponível"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
