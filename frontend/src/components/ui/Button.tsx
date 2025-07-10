import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
          variant === "default" && "bg-quest-royal text-white hover:bg-purple-800",
          variant === "outline" && "border border-gray-300 text-white hover:bg-gray-800",
          variant === "ghost" && "text-white hover:bg-gray-900",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
