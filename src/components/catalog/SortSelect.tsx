"use client";

const OPTIONS = [
  { value: "relevancia", label: "Relevância" },
  { value: "novidade", label: "Novidades" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "mais-vendido", label: "Mais vendidos" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-black/50 hidden sm:inline">Ordenar por</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-black/25 bg-transparent px-3 py-2 text-sm outline-none focus:border-black cursor-pointer"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
