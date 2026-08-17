export default function ContentPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
      <h1 className="font-serif-editorial text-3xl md:text-4xl mb-8">{title}</h1>
      <div className="prose-content space-y-5 text-sm text-black/70 leading-relaxed">{children}</div>
    </div>
  );
}
