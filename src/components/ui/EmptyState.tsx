import Button from "@/components/ui/Button";

export default function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  icon,
}: {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      {icon && <div className="mb-4 text-black/30">{icon}</div>}
      <p className="font-serif-editorial text-2xl mb-2">{title}</p>
      {description && <p className="text-sm text-black/55 max-w-sm mb-6">{description}</p>}
      {ctaLabel && ctaHref && <Button href={ctaHref}>{ctaLabel}</Button>}
    </div>
  );
}
