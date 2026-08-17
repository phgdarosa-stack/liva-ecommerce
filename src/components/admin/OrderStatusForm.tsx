"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FULFILLMENT_STEPS } from "@/lib/constants";

const PAYMENT_STATUSES = ["pendente", "aprovado", "recusado"];

export default function OrderStatusForm({
  orderId,
  paymentStatus,
  fulfillmentStatus,
}: {
  orderId: string;
  paymentStatus: string;
  fulfillmentStatus: string;
}) {
  const [payment, setPayment] = useState(paymentStatus);
  const [fulfillment, setFulfillment] = useState(fulfillmentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: payment, fulfillmentStatus: fulfillment }),
      });
      if (!res.ok) throw new Error();
      toast.success("Status atualizado.");
      router.refresh();
    } catch {
      toast.error("Algo deu errado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
      <h2 className="text-sm font-medium">Atualizar status</h2>
      <div>
        <label className="text-xs text-gray-500 block mb-1.5">Pagamento</label>
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-900"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1.5">Preparação / envio</label>
        <select
          value={fulfillment}
          onChange={(e) => setFulfillment(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-900"
        >
          {FULFILLMENT_STEPS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar status"}
      </button>
    </div>
  );
}
