"use client";

import { cn } from "@/lib/utils";
import { COLOR_HEX } from "@/lib/colors";
import { CATEGORIES } from "@/lib/constants";

const ALL_SIZES = ["PP", "P", "M", "G", "GG", "34", "36", "38", "40", "42"];

export interface FilterValues {
  category?: string;
  sizes: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  promo: boolean;
  bestseller: boolean;
  newArrival: boolean;
}

export default function CatalogFilters({
  values,
  onChange,
  showCategory = true,
}: {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  showCategory?: boolean;
}) {
  function toggleArrayValue(key: "sizes" | "colors", value: string) {
    const current = values[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...values, [key]: next });
  }

  return (
    <div className="flex flex-col gap-8">
      {showCategory && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-black/50 mb-3">Categoria</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onChange({ ...values, category: undefined })}
              className={cn(
                "text-left text-sm py-0.5",
                !values.category ? "font-medium text-olive" : "text-black/70 hover:text-black"
              )}
            >
              Todas
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => onChange({ ...values, category: c.slug })}
                className={cn(
                  "text-left text-sm py-0.5",
                  values.category === c.slug ? "font-medium text-olive" : "text-black/70 hover:text-black"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs uppercase tracking-widest text-black/50 mb-3">Tamanho</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleArrayValue("sizes", size)}
              aria-pressed={values.sizes.includes(size)}
              className={cn(
                "min-w-9 h-9 px-2 border text-xs transition-colors",
                values.sizes.includes(size)
                  ? "border-black bg-black text-white"
                  : "border-black/25 hover:border-black"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-widest text-black/50 mb-3">Cor</h3>
        <div className="flex flex-wrap gap-2.5">
          {Object.entries(COLOR_HEX).map(([name, hex]) => (
            <button
              key={name}
              onClick={() => toggleArrayValue("colors", name)}
              aria-pressed={values.colors.includes(name)}
              title={name}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                values.colors.includes(name) ? "border-olive" : "border-transparent hover:border-black/30"
              )}
              style={{ backgroundColor: hex }}
            >
              <span className="sr-only">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-widest text-black/50 mb-3">Preço</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Mín."
            value={values.minPrice ?? ""}
            onChange={(e) =>
              onChange({ ...values, minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full border border-black/25 px-2.5 py-2 text-sm outline-none focus:border-black"
          />
          <span className="text-black/40">–</span>
          <input
            type="number"
            min={0}
            placeholder="Máx."
            value={values.maxPrice ?? ""}
            onChange={(e) =>
              onChange({ ...values, maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full border border-black/25 px-2.5 py-2 text-sm outline-none focus:border-black"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-widest text-black/50 mb-3">Outros</h3>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={values.promo}
              onChange={(e) => onChange({ ...values, promo: e.target.checked })}
              className="w-4 h-4 accent-black"
            />
            Em promoção
          </label>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={values.bestseller}
              onChange={(e) => onChange({ ...values, bestseller: e.target.checked })}
              className="w-4 h-4 accent-black"
            />
            Mais vendidos
          </label>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={values.newArrival}
              onChange={(e) => onChange({ ...values, newArrival: e.target.checked })}
              className="w-4 h-4 accent-black"
            />
            Novidades
          </label>
        </div>
      </div>
    </div>
  );
}
