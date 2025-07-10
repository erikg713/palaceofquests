import { cn } from "@/lib/utils";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive";
};

export const Button = ({ className, variant = "default", ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-xl font-semibold transition",
        variant === "default" && "bg-purple-600 text-white hover:bg-purple-700",
        variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-100",
        variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...props}
    />
  );
};
