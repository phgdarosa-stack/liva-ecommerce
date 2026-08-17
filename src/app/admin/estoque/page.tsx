import { prisma } from "@/lib/db";
import InventoryTable from "@/components/admin/InventoryTable";

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { stock: "asc" },
  });

  const rows = variants.map((v) => ({
    variantId: v.id,
    productName: v.product.name,
    sku: v.sku,
    color: v.color,
    size: v.size,
    stock: v.stock,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Estoque</h1>
        <p className="text-sm text-gray-500">{rows.length} variações cadastradas</p>
      </div>
      <InventoryTable rows={rows} />
    </div>
  );
}
