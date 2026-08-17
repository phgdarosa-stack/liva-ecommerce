import { prisma } from "./db";
import { getSessionUser } from "./session";

export interface CouponValidationResult {
  valid: boolean;
  message?: string;
  coupon?: { code: string; type: string; value: number };
}

export async function validateCoupon(rawCode: string, subtotal: number): Promise<CouponValidationResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, message: "Informe um cupom." };

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) {
    return { valid: false, message: "Cupom inválido ou expirado." };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, message: "Esse cupom expirou." };
  }
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, message: "Esse cupom atingiu o limite de uso." };
  }
  if (coupon.minOrder > 0 && subtotal < coupon.minOrder) {
    return {
      valid: false,
      message: `Válido a partir de compras de R$${coupon.minOrder.toFixed(2).replace(".", ",")}.`,
    };
  }

  if (coupon.firstPurchaseOnly) {
    const user = await getSessionUser();
    if (user) {
      const previousOrders = await prisma.order.count({ where: { userId: user.id } });
      if (previousOrders > 0) {
        return { valid: false, message: "Esse cupom é válido apenas para a primeira compra." };
      }
    }
  }

  return {
    valid: true,
    coupon: { code: coupon.code, type: coupon.type, value: coupon.value },
  };
}
