import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variants = {
  default: "bg-surface-800 text-surface-300 border-surface-700",
  success: "bg-green-900/50 text-green-400 border-green-800",
  warning: "bg-amber-900/50 text-amber-400 border-amber-800",
  danger: "bg-red-900/50 text-red-400 border-red-800",
  info: "bg-blue-900/50 text-blue-400 border-blue-800",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
