"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { formatCep, formatCpf, formatPhone, isValidCep, isValidCpf } from "@/lib/utils";
import type { CheckoutData } from "@/components/checkout/CheckoutFlow";

const STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

interface SavedAddress {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
}

export default function DeliveryStep({
  data,
  savedAddresses,
  onNext,
}: {
  data: CheckoutData;
  savedAddresses: SavedAddress[];
  onNext: (data: Partial<CheckoutData>) => void;
}) {
  const [form, setForm] = useState(data);
  const [selectedSaved, setSelectedSaved] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof CheckoutData>(key: K, value: CheckoutData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function useSavedAddress(addr: SavedAddress) {
    setSelectedSaved(addr.id);
    setForm((f) => ({
      ...f,
      cep: addr.cep,
      street: addr.street,
      number: addr.number,
      complement: addr.complement ?? "",
      neighborhood: addr.neighborhood ?? "",
      city: addr.city,
      state: addr.state,
    }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (form.customerName.trim().length < 2) next.customerName = "Informe o nome completo.";
    if (!isValidCpf(form.customerCpf)) next.customerCpf = "CPF inválido.";
    if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) next.customerEmail = "E-mail inválido.";
    if (form.customerPhone.replace(/\D/g, "").length < 10) next.customerPhone = "Telefone inválido.";
    if (!isValidCep(form.cep)) next.cep = "CEP inválido.";
    if (!form.street.trim()) next.street = "Informe a rua.";
    if (!form.number.trim()) next.number = "Informe o número.";
    if (!form.city.trim()) next.city = "Informe a cidade.";
    if (!form.state || form.state.length !== 2) next.state = "Selecione o estado.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-xl">
      {savedAddresses.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-3">Endereços salvos</h2>
          <div className="flex flex-col gap-2">
            {savedAddresses.map((addr) => (
              <button
                type="button"
                key={addr.id}
                onClick={() => useSavedAddress(addr)}
                className={`text-left border px-4 py-3 text-sm transition-colors ${
                  selectedSaved === addr.id ? "border-black" : "border-black/15 hover:border-black/40"
                }`}
              >
                <p className="font-medium">{addr.label}</p>
                <p className="text-black/60">
                  {addr.street}, {addr.number} — {addr.city}/{addr.state}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium mb-3">Seus dados</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome completo" error={errors.customerName} className="sm:col-span-2">
            <input
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="CPF" error={errors.customerCpf}>
            <input
              value={form.customerCpf}
              onChange={(e) => set("customerCpf", formatCpf(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Telefone" error={errors.customerPhone}>
            <input
              value={form.customerPhone}
              onChange={(e) => set("customerPhone", formatPhone(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="E-mail" error={errors.customerEmail} className="sm:col-span-2">
            <input
              type="email"
              value={form.customerEmail}
              onChange={(e) => set("customerEmail", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3">Endereço de entrega</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="CEP" error={errors.cep}>
            <input
              value={form.cep}
              onChange={(e) => set("cep", formatCep(e.target.value))}
              maxLength={9}
              className={inputClass}
            />
          </Field>
          <Field label="Cidade" error={errors.city}>
            <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Rua" error={errors.street} className="sm:col-span-2">
            <input value={form.street} onChange={(e) => set("street", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Número" error={errors.number}>
            <input value={form.number} onChange={(e) => set("number", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Complemento (opcional)">
            <input
              value={form.complement}
              onChange={(e) => set("complement", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Bairro">
            <input
              value={form.neighborhood}
              onChange={(e) => set("neighborhood", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Estado" error={errors.state}>
            <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inputClass}>
              <option value="">Selecione</option>
              {STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <Button type="submit" size="lg" className="self-start">
        Continuar para pagamento
      </Button>
    </form>
  );
}

const inputClass = "w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black";

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-wider text-black/50 block mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
