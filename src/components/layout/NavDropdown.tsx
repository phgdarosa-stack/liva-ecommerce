import Link from "next/link";

export default function NavDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="relative group">
      <Link href={href} className="text-sm tracking-wide hover:text-olive transition-colors py-2">
        {label}
      </Link>
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1
                   group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                   focus-within:opacity-100 focus-within:visible focus-within:translate-y-0
                   transition-all duration-200"
      >
        <div className="bg-white border border-black/10 shadow-lg py-3 min-w-[180px]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-2 text-sm hover:bg-ivory hover:text-olive transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
