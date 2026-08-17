"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";
import Rating from "@/components/ui/Rating";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ReviewDTO } from "@/types";

export default function ReviewsSection({
  productId,
  rating,
  reviewCount,
  reviews,
}: {
  productId: string;
  rating: number;
  reviewCount: number;
  reviews: ReviewDTO[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      router.push(`/entrar?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating: stars, title, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      const data = await res.json();
      setLocalReviews([
        {
          id: data.review.id,
          authorName: data.review.authorName,
          rating: data.review.rating,
          title: data.review.title,
          comment: data.review.comment,
          createdAt: data.review.createdAt,
        },
        ...localReviews,
      ]);
      setShowForm(false);
      setComment("");
      setTitle("");
      toast.success("Obrigada pela avaliação!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="font-serif-editorial text-2xl mb-1">Avaliações</h2>
          <Rating value={rating} count={reviewCount} />
        </div>
        <Button variant="outline" onClick={() => setShowForm((v) => !v)}>
          Avaliar produto
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-black/15 p-5 mb-8 max-w-lg">
          <p className="text-xs uppercase tracking-wider text-black/50 mb-2">Sua nota</p>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setStars(i + 1)} aria-label={`${i + 1} estrelas`}>
                <Star
                  size={22}
                  className={cn(i + 1 <= stars ? "fill-black text-black" : "fill-none text-black/25")}
                />
              </button>
            ))}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (opcional)"
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black mb-3"
          />
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte como foi sua experiência com o produto"
            rows={3}
            className="w-full border border-black/25 px-3 py-2.5 text-sm outline-none focus:border-black mb-4 resize-none"
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar avaliação"}
          </Button>
        </form>
      )}

      {localReviews.length === 0 ? (
        <p className="text-sm text-black/50">Esse produto ainda não tem avaliações.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-6">
          {localReviews.map((r) => (
            <li key={r.id} className="border-b border-black/10 pb-5">
              <Rating value={r.rating} size={12} className="mb-2" />
              {r.title && <p className="text-sm font-medium mb-1">{r.title}</p>}
              <p className="text-sm text-black/70 leading-relaxed">{r.comment}</p>
              <p className="text-xs text-black/40 mt-2">{r.authorName}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
