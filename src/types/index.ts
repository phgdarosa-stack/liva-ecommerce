export type ProductImageType = "front" | "lifestyle" | "detail" | "alternate";

export interface ProductVariantDTO {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
  sku: string;
}

export interface ProductImageDTO {
  id: string;
  url: string;
  alt: string;
  type: ProductImageType;
  order: number;
}

export interface ReviewDTO {
  id: string;
  authorName: string;
  rating: number;
  title?: string | null;
  comment: string;
  createdAt: string;
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  category: string;
  subtitle?: string | null;
  description: string;
  composition: string;
  care: string;
  price: number;
  promoPrice?: number | null;
  sku: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
  reviews?: ReviewDTO[];
}

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  promoPrice?: number | null;
  bestseller: boolean;
  newArrival: boolean;
  image: string;
  hoverImage?: string;
  colors: { color: string; colorHex: string }[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface AppliedCoupon {
  code: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
}
