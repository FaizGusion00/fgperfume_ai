import { cn } from "@/lib/utils";

export function FGPerfumeLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 20"
      className={cn("fill-current", className)}
      {...props}
    >
      <text x="0" y="15" fontFamily="Playfair Display, serif" fontSize="20" fontWeight="bold">
        FG
      </text>
      <text x="35" y="15" fontFamily="PT Sans, sans-serif" fontSize="16" fontWeight="normal">
        Perfume
      </text>
    </svg>
  );
}
