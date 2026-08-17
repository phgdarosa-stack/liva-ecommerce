import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, images: { orderBy: { order: "asc" } } },
  });
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar produto</h1>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          category: product.category,
          description: product.description,
          composition: product.composition,
          care: product.care,
          price: product.price,
          promoPrice: product.promoPrice,
          featured: product.featured,
          bestseller: product.bestseller,
          newArrival: product.newArrival,
          variants: product.variants.map((v) => ({
            color: v.color,
            colorHex: v.colorHex,
            size: v.size,
            stock: v.stock,
          })),
          images: product.images.map((img) => ({ url: img.url, type: img.type })),
        }}
      />
    </div>
  );
}
