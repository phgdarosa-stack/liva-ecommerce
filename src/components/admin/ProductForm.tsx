"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { COLOR_HEX } from "@/lib/colors";

interface VariantRow {
  color: string;
  colorHex: string;
  size: string;
  stock: number;
}

interface ImageRow {
  url: string;
  type: string;
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug?: string;
  sku: string;
  category: string;
  description: string;
  composition: string;
  care: string;
  price: number;
  promoPrice: number | null;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  variants: VariantRow[];
  images: ImageRow[];
}

export default function ProductForm({ initial }: { initial: ProductFormData }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const isEdit = !!initial.id;

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));
  }

  function addVariant() {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { color: "Preto", colorHex: COLOR_HEX["Preto"], size: "M", stock: 10 }],
    }));
  }

  function removeVariant(index: number) {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));
  }

  function updateImage(index: number, url: string) {
    setForm((f) => ({ ...f, images: f.images.map((img, i) => (i === index ? { ...img, url } : img)) }));
  }

  function addImage() {
    setForm((f) => ({ ...f, images: [...f.images, { url: "", type: f.images.length === 0 ? "front" : "detail" }] }));
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/products/${initial.id}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(isEdit ? "Produto atualizado." : "Produto criado.");
      router.push("/admin/produtos");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit) return;
    if (!confirm("Remover este produto permanentemente?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/products/${initial.id}`, { method: "DELETE" });
      toast.success("Produto removido.");
      router.push("/admin/produtos");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <section className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-medium">Informações gerais</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} required />
          </Field>
          <Field label="SKU">
            <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputClass} required />
          </Field>
          <Field label="Categoria">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Preço (R$)">
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Preço promocional (R$, opcional)">
            <input
              type="number"
              step="0.01"
              value={form.promoPrice ?? ""}
              onChange={(e) => set("promoPrice", e.target.value ? Number(e.target.value) : null)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Descrição">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Composição">
            <input value={form.composition} onChange={(e) => set("composition", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Cuidados">
            <input value={form.care} onChange={(e) => set("care", e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="flex gap-6 pt-2">
          <Checkbox label="Destaque" checked={form.featured} onChange={(v) => set("featured", v)} />
          <Checkbox label="Mais vendido" checked={form.bestseller} onChange={(v) => set("bestseller", v)} />
          <Checkbox label="Novidade" checked={form.newArrival} onChange={(v) => set("newArrival", v)} />
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Imagens</h2>
          <button type="button" onClick={addImage} className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <Plus size={13} /> Adicionar
          </button>
        </div>
        {form.images.map((img, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={img.url}
              onChange={(e) => updateImage(i, e.target.value)}
              placeholder="/images/campaign/tops-model.jpg"
              className={inputClass}
            />
            <button type="button" onClick={() => removeImage(i)} className="p-2 text-gray-400 hover:text-red-600 shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Variações (cor, tamanho, estoque)</h2>
          <button type="button" onClick={addVariant} className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <Plus size={13} /> Adicionar
          </button>
        </div>
        {form.variants.map((v, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
            <select
              value={v.color}
              onChange={(e) => updateVariant(i, { color: e.target.value, colorHex: COLOR_HEX[e.target.value] })}
              className={inputClass}
            >
              {Object.keys(COLOR_HEX).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input value={v.size} onChange={(e) => updateVariant(i, { size: e.target.value })} className={inputClass} placeholder="Tamanho" />
            <input
              type="number"
              value={v.stock}
              onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
              className={inputClass}
              placeholder="Estoque"
            />
            <button type="button" onClick={() => removeVariant(i)} className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar produto"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 px-5 py-2.5 rounded-md hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Removendo..." : "Remover produto"}
          </button>
        )}
      </div>
    </form>
  );
}

const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-900";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4" />
      {label}
    </label>
  );
}
