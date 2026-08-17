import type { AppliedCoupon, CartItem } from "@/types";
import { FREE_SHIPPING_THRESHOLD } from "./constants";
import { calculateShipping } from "./utils";

// "2 camisetas por R$149,90" — automatic bundle applied at the cart level.
const BUNDLE_SLUGS = ["essential-tee", "soft-tee"];
const BUNDLE_PRICE_FOR_TWO = 149.9;

export function computeBundleDiscount(items: CartItem[]): number {
  const units: number[] = [];
  for (const item of items) {
    if (BUNDLE_SLUGS.includes(item.slug)) {
      for (let i = 0; i < item.quantity; i++) units.push(item.price);
    }
  }
  units.sort((a, b) => b - a);

  const pairs = Math.floor(units.length / 2);
  let discount = 0;
  for (let i = 0; i < pairs; i++) {
    const pairSum = units[i * 2] + units[i * 2 + 1];
    discount += Math.max(0, pairSum - BUNDLE_PRICE_FOR_TWO);
  }
  return Math.round(discount * 100) / 100;
}

export function computeCouponDiscount(
  subtotalAfterBundle: number,
  coupon: AppliedCoupon | null
): number {
  if (!coupon || coupon.type === "shipping") return 0;
  if (coupon.type === "percent") {
    return Math.round(subtotalAfterBundle * (coupon.value / 100) * 100) / 100;
  }
  return Math.min(coupon.value, subtotalAfterBundle);
}

export interface CartTotals {
  subtotal: number;
  bundleDiscount: number;
  couponDiscount: number;
  shipping: number;
  freeShipping: boolean;
  total: number;
  amountToFreeShipping: number;
}

export function computeCartTotals(
  items: CartItem[],
  coupon: AppliedCoupon | null,
  cep: string | null
): CartTotals {
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
  const bundleDiscount = computeBundleDiscount(items);
  const subtotalAfterBundle = Math.max(0, subtotal - bundleDiscount);
  const couponDiscount = computeCouponDiscount(subtotalAfterBundle, coupon);
  const netGoods = Math.max(0, subtotalAfterBundle - couponDiscount);

  const forcedFreeShipping = coupon?.type === "shipping";
  const quote = cep ? calculateShipping(cep, netGoods) : null;
  const freeShipping = forcedFreeShipping || netGoods >= FREE_SHIPPING_THRESHOLD || !quote;
  const shipping = freeShipping ? 0 : (quote?.price ?? 0);

  const total = Math.round((netGoods + shipping) * 100) / 100;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - netGoods);

  return {
    subtotal,
    bundleDiscount,
    couponDiscount,
    shipping,
    freeShipping,
    total,
    amountToFreeShipping,
  };
}
