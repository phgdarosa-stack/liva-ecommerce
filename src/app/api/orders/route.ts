import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { checkoutSchema } from "@/lib/validators";
import { validateCoupon } from "@/lib/coupons";
import { computeBundleDiscount, computeCouponDiscount } from "@/lib/cart-calculations";
import { calculateShipping, generateOrderNumber } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import type { AppliedCoupon, CartItem } from "@/types";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;

  const orders = await prisma.order.findMany({
    where: { userId: user!.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados de checkout inválidos." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Recompute everything from the database — never trust client-sent prices.
  const variantIds = data.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: { include: { images: { orderBy: { order: "asc" } } } } },
  });

  const cartItems: (CartItem & { variantRecordId: string })[] = [];
  for (const line of data.items) {
    const variant = variants.find((v) => v.id === line.variantId);
    if (!variant) {
      return NextResponse.json({ error: "Um dos itens não está mais disponível." }, { status: 400 });
    }
    if (variant.stock < line.quantity) {
      return NextResponse.json(
        { error: `Estoque insuficiente para ${variant.product.name} (${variant.color}, ${variant.size}).` },
        { status: 409 }
      );
    }
    const unitPrice = variant.product.promoPrice ?? variant.product.price;
    cartItems.push({
      productId: variant.productId,
      variantId: variant.id,
      variantRecordId: variant.id,
      slug: variant.product.slug,
      name: variant.product.name,
      image: variant.product.images[0]?.url ?? "",
      color: variant.color,
      size: variant.size,
      price: unitPrice,
      quantity: line.quantity,
      maxStock: variant.stock,
    });
  }

  const subtotal = Math.round(cartItems.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
  const bundleDiscount = computeBundleDiscount(cartItems);
  const subtotalAfterBundle = Math.max(0, subtotal - bundleDiscount);

  let couponDiscount = 0;
  let couponRecordId: string | null = null;
  let shippingForced = false;
  if (data.couponCode) {
    const result = await validateCoupon(data.couponCode, subtotalAfterBundle);
    if (!result.valid || !result.coupon) {
      return NextResponse.json({ error: result.message ?? "Cupom inválido." }, { status: 400 });
    }
    const appliedCoupon = result.coupon as AppliedCoupon;
    couponDiscount = computeCouponDiscount(subtotalAfterBundle, appliedCoupon);
    shippingForced = appliedCoupon.type === "shipping";
    const couponRecord = await prisma.coupon.findUnique({ where: { code: result.coupon.code } });
    couponRecordId = couponRecord?.id ?? null;
  }

  const netGoods = Math.max(0, subtotalAfterBundle - couponDiscount);
  const freeShipping = shippingForced || netGoods >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : calculateShipping(data.cep, netGoods).price;
  const total = Math.round((netGoods + shipping) * 100) / 100;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          number: generateOrderNumber(),
          userId: user!.id,
          subtotal,
          shipping,
          discount: bundleDiscount + couponDiscount,
          total,
          couponId: couponRecordId,
          paymentMethod: data.paymentMethod,
          paymentStatus: "aprovado",
          fulfillmentStatus: "pagamento_aprovado",
          customerName: data.customerName,
          customerCpf: data.customerCpf,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          cep: data.cep,
          street: data.street,
          number_: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          items: {
            create: cartItems.map((i) => ({
              productId: i.productId,
              variantId: i.variantRecordId,
              productName: i.name,
              color: i.color,
              size: i.size,
              quantity: i.quantity,
              unitPrice: i.price,
              image: i.image,
            })),
          },
        },
      });

      for (const item of cartItems) {
        await tx.productVariant.update({
          where: { id: item.variantRecordId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (couponRecordId) {
        await tx.coupon.update({
          where: { id: couponRecordId },
          data: { usageCount: { increment: 1 } },
        });
      }

      return created;
    });

    return NextResponse.json({ number: order.number }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Algo deu errado. Tente novamente." }, { status: 500 });
  }
}
