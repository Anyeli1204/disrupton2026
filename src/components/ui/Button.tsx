import Link from "next/link";

type Variant = "primary" | "secondary" | "danger" | "dark";

const VARIANT: Record<Variant, string> = {
  primary: "bg-zhenda text-white shadow-sm hover:bg-[#165a3b]",
  secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-zhenda/30 hover:bg-emerald-50/70",
  danger: "bg-red-700 text-white shadow-sm hover:bg-red-800",
  dark: "bg-[#0e1a14] text-white shadow-sm hover:bg-[#16241c]",
};

export function Button({
  variant = "secondary",
  href,
  className = "",
  children,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition ${VARIANT[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  );
}
