import { cn } from "@/lib/utils";

export function FGPAiLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 160 28"
      className={cn("fill-current", className)}
      {...props}
    >
      <text x="0" y="22" fontFamily="Playfair Display, serif" fontSize="24" fontWeight="bold">FGP</text>
      <path d="M55 4 L55 24" stroke="currentColor" strokeWidth="1"/>
      <text x="65" y="20" fontFamily="PT Sans, sans-serif" fontSize="16">AI</text>
    </svg>
  );
}
