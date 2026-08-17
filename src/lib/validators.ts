import { z } from "zod";
import { isValidCep, isValidCpf } from "./utils";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  phone: z.string().optional(),
});

export const addressSchema = z.object({
  label: z.string().min(1).default("Endereço"),
  cep: z.string().refine(isValidCep, "CEP inválido."),
  street: z.string().min(2, "Informe a rua."),
  number: z.string().min(1, "Informe o número."),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().length(2, "Use a sigla do estado (ex: SP)."),
  isDefault: z.boolean().optional(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Informe o nome completo."),
  customerCpf: z.string().refine(isValidCpf, "CPF inválido."),
  customerEmail: z.string().email("E-mail inválido."),
  customerPhone: z.string().min(10, "Telefone inválido."),
  cep: z.string().refine(isValidCep, "CEP inválido."),
  street: z.string().min(2, "Informe a rua."),
  number: z.string().min(1, "Informe o número."),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().length(2, "Use a sigla do estado."),
  paymentMethod: z.enum(["pix", "credit_card", "boleto"]),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Seu carrinho está vazio."),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(80).optional(),
  comment: z.string().min(5, "Conte um pouco mais sobre sua experiência.").max(500),
});

export const newsletterSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

export const adminProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(5),
  composition: z.string().min(2),
  care: z.string().min(2),
  price: z.number().positive(),
  promoPrice: z.number().positive().nullable().optional(),
  featured: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  newArrival: z.boolean().optional(),
});

export const adminCouponSchema = z.object({
  code: z.string().min(3),
  type: z.enum(["percent", "fixed", "shipping"]),
  value: z.number().positive(),
  minOrder: z.number().min(0).optional(),
  expiresAt: z.string().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  firstPurchaseOnly: z.boolean().optional(),
  active: z.boolean().optional(),
});
