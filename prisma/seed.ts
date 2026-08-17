import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCTS, CATEGORY_IMAGES } from "../src/data/products-data";
import { colorHex } from "../src/lib/colors";
import { generateOrderNumber } from "../src/lib/utils";

const prisma = new PrismaClient();

const REVIEW_AUTHORS = [
  "Ana Beatriz",
  "Camila Souza",
  "Juliana Alves",
  "Mariana Costa",
  "Larissa Ferreira",
  "Beatriz Lima",
  "Fernanda Rocha",
  "Gabriela Martins",
  "Isabela Cardoso",
  "Rafaela Nunes",
];

const REVIEW_TEXTS = [
  { rating: 5, title: "Amei", comment: "Caimento perfeito e o tecido é ainda melhor pessoalmente. Já quero em outra cor." },
  { rating: 5, title: "Virou básico", comment: "Comprei achando que era só mais uma peça e virou item favorito do guarda-roupa." },
  { rating: 4, title: "Muito bom", comment: "Gostei bastante, só achei que o P veio um pouco justo. Recomendo pegar um tamanho acima." },
  { rating: 5, title: "Qualidade surpreendeu", comment: "Tecido grosso, boa costura, não desbotou depois de lavar. Vale o preço." },
  { rating: 5, title: "Chegou rápido e é lindo", comment: "Entrega rápida e a peça é ainda mais bonita ao vivo. Já pedi em outra cor." },
  { rating: 4, title: "Recomendo", comment: "Ficou como esperado pelas fotos. Modelagem confortável para o dia todo." },
];

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

async function main() {
  console.log("Limpando banco...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("Criando usuários...");
  const adminPassword = await bcrypt.hash("Liva@Admin123", 10);
  const customerPassword = await bcrypt.hash("Liva@Cliente123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Equipe LIVA",
      email: "admin@liva.com.br",
      password: adminPassword,
      role: "ADMIN",
      phone: "(11) 99999-0000",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Maria Fernanda",
      email: "cliente@liva.com.br",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "(11) 98888-1234",
      cpf: "111.444.777-35",
      addresses: {
        create: [
          {
            label: "Casa",
            cep: "01310-100",
            street: "Avenida Paulista",
            number: "1000",
            complement: "Apto 52",
            neighborhood: "Bela Vista",
            city: "São Paulo",
            state: "SP",
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log("Criando cupons...");
  await prisma.coupon.createMany({
    data: [
      {
        code: "BEMVINDALIVA",
        type: "percent",
        value: 15,
        firstPurchaseOnly: true,
        active: true,
      },
      {
        code: "LIVA10",
        type: "percent",
        value: 10,
        firstPurchaseOnly: false,
        active: true,
      },
      {
        code: "PRIMEIRACOMPRA",
        type: "percent",
        value: 10,
        firstPurchaseOnly: true,
        active: true,
      },
      {
        code: "FRETEGRATIS",
        type: "shipping",
        value: 100,
        minOrder: 0,
        firstPurchaseOnly: false,
        active: true,
      },
    ],
  });

  console.log("Criando produtos...");
  const createdProducts = [];

  for (const p of PRODUCTS) {
    const images = CATEGORY_IMAGES[p.category];

    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        category: p.category,
        price: p.price,
        promoPrice: p.promoPrice ?? null,
        description: p.description,
        composition: p.composition,
        care: p.care,
        featured: !!p.featured,
        bestseller: !!p.bestseller,
        newArrival: !!p.newArrival,
        rating: Math.round((4.5 + Math.random() * 0.45) * 10) / 10,
        images: {
          create: [
            { url: images.front, alt: `${p.name} — LIVA`, type: "front", order: 0 },
            { url: images.detail, alt: `${p.name} — detalhe do tecido`, type: "detail", order: 1 },
          ],
        },
        variants: {
          create: p.colors.flatMap((color, ci) =>
            p.sizes.map((size, si) => {
              const stockSeed = (ci * 7 + si * 3) % 11;
              const stock = stockSeed === 0 ? 0 : stockSeed < 3 ? stockSeed : stockSeed + 4;
              return {
                color,
                colorHex: colorHex(color),
                size,
                stock,
                sku: `${p.sku}-C${ci}-${size}`,
              };
            })
          ),
        },
      },
    });

    const reviewCount = 2 + Math.floor(Math.random() * 4);
    const authors = pick(REVIEW_AUTHORS, reviewCount);
    const texts = pick(REVIEW_TEXTS, reviewCount);
    await prisma.review.createMany({
      data: authors.map((authorName, i) => ({
        productId: product.id,
        authorName,
        rating: texts[i].rating,
        title: texts[i].title,
        comment: texts[i].comment,
      })),
    });

    await prisma.product.update({
      where: { id: product.id },
      data: { reviewCount },
    });

    createdProducts.push(product);
  }

  console.log("Criando pedido de exemplo...");
  const sampleProduct = createdProducts[0];
  const sampleVariant = await prisma.productVariant.findFirst({
    where: { productId: sampleProduct.id },
  });

  if (sampleVariant) {
    await prisma.order.create({
      data: {
        number: generateOrderNumber(),
        userId: customer.id,
        subtotal: sampleProduct.price,
        shipping: 0,
        discount: 0,
        total: sampleProduct.price,
        paymentMethod: "pix",
        paymentStatus: "aprovado",
        fulfillmentStatus: "entregue",
        customerName: customer.name,
        customerCpf: customer.cpf ?? "",
        customerEmail: customer.email,
        customerPhone: customer.phone ?? "",
        cep: "01310-100",
        street: "Avenida Paulista",
        number_: "1000",
        complement: "Apto 52",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        items: {
          create: [
            {
              productId: sampleProduct.id,
              variantId: sampleVariant.id,
              productName: sampleProduct.name,
              color: sampleVariant.color,
              size: sampleVariant.size,
              quantity: 1,
              unitPrice: sampleProduct.price,
              image: CATEGORY_IMAGES[sampleProduct.category as keyof typeof CATEGORY_IMAGES].front,
            },
          ],
        },
      },
    });
  }

  console.log(`Seed concluído: ${createdProducts.length} produtos criados.`);
  console.log("Login admin: admin@liva.com.br / Liva@Admin123");
  console.log("Login cliente: cliente@liva.com.br / Liva@Cliente123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
