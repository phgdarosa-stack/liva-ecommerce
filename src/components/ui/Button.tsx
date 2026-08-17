import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-black/85 active:bg-black/75",
  secondary: "bg-olive text-white hover:bg-olive-dark active:bg-olive-dark",
  outline: "border border-black text-black hover:bg-black hover:text-white",
  ghost: "text-black hover:bg-black/5",
  link: "text-black underline underline-offset-4 hover:text-olive",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-sm md:text-base px-8 py-4",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
    variantClasses[variant],
    variant !== "link" && "rounded-none",
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
