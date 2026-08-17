import { formatPrice } from "@/lib/utils";

export default function SalesChart({ data }: { data: { label: string; total: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.total));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-5">Vendas — últimos 7 dias</p>
      <div className="flex items-end gap-3 h-40">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatPrice(d.total)}
            </span>
            <div
              className="w-full bg-gray-900 rounded-t-sm transition-all min-h-[2px]"
              style={{ height: `${Math.max(2, (d.total / max) * 100)}%` }}
            />
            <span className="text-[10px] text-gray-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
