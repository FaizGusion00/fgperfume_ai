import { cn } from "@/lib/utils";

export function FGPerfumeLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 160 28"
      className={cn("fill-current", className)}
      {...props}
    >
      <text x="30" y="22" fontFamily="Playfair Display, serif" fontSize="24" fontWeight="bold">FG</text>
      <path d="M70 4 L70 24" stroke="currentColor" strokeWidth="1"/>
      <text x="80" y="20" fontFamily="PT Sans, sans-serif" fontSize="16">PERFUME</text>
    </svg>
  );
}
