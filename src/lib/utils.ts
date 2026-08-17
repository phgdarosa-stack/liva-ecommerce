import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FREE_SHIPPING_THRESHOLD } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatInstallments(value: number, maxInstallments = 3): string {
  const installment = value / maxInstallments;
  return `${maxInstallments}x de ${formatPrice(installment)} sem juros`;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LIVA${year}${rand}`;
}

export interface ShippingQuote {
  cep: string;
  price: number;
  freeShipping: boolean;
  minDays: number;
  maxDays: number;
}

/**
 * Simulated shipping calculation. Deterministic based on CEP digits so the
 * same CEP always quotes the same price/estimate within a session.
 */
export function calculateShipping(cep: string, subtotal: number): ShippingQuote {
  const digits = cep.replace(/\D/g, "");
  const region = Number(digits.slice(0, 1)) || 0;

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { cep, price: 0, freeShipping: true, minDays: 3, maxDays: 7 };
  }

  const base = 14.9 + region * 2.3;
  const price = Math.round(base * 100) / 100;
  const minDays = 3 + Math.floor(region / 3);
  const maxDays = minDays + 4;

  return { cep, price, freeShipping: false, minDays, maxDays };
}

export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function isValidCep(cep: string): boolean {
  return /^\d{5}-?\d{3}$/.test(cep.trim());
}

export function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(digits[i]) * (len + 1 - i);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  return calc(9) === Number(digits[9]) && calc(10) === Number(digits[10]);
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
