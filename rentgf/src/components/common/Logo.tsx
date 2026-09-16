import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  white?: boolean;
}

export default function Logo({ size = "md", href = "/", className, white = false }: LogoProps) {
  const sizes = {
    sm: { icon: "w-7 h-7", text: "text-base", iconInner: "w-4 h-4" },
    md: { icon: "w-8 h-8", text: "text-xl", iconInner: "w-5 h-5" },
    lg: { icon: "w-11 h-11", text: "text-2xl", iconInner: "w-6 h-6" },
  };
  const s = sizes[size];

  const inner = (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      {/* Icon mark */}
      <div className={cn(s.icon, "rounded-xl flex items-center justify-center flex-shrink-0",
        white ? "bg-white/20" : "bg-gradient-to-br from-indigo-500 to-purple-600")}>
        <svg className={s.iconInner} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 2C7.5 2 5.5 3.8 5.5 6c0 1.5.8 2.8 2 3.5L10 18l2.5-8.5c1.2-.7 2-2 2-3.5C14.5 3.8 12.5 2 10 2z" fill="white" opacity="0.9"/>
          <circle cx="10" cy="6" r="2" fill="white"/>
        </svg>
      </div>
      {/* Wordmark */}
      <span className={cn(s.text, "font-bold tracking-tight",
        white ? "text-white" : "text-gray-900")}>
        Rent<span className={white ? "text-indigo-200" : "text-indigo-600"}>GF</span>
      </span>
    </div>
  );

  if (!href) return inner;
  return <Link href={href} className="hover:opacity-90 transition-opacity">{inner}</Link>;
}
