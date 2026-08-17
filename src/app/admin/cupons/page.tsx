import { prisma } from "@/lib/db";
import CouponsManager from "@/components/admin/CouponsManager";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <CouponsManager
      initial={coupons.map((c) => ({
        ...c,
        expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
      }))}
    />
  );
}
