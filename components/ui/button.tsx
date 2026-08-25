import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "[font-family:var(--font-poppins),sans-serif] font-[800] italic uppercase text-[16px] tracking-[-0.02em] leading-[85%] inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none outline-none",
  {
    variants: {
      variant: {
        // Solid buttons with shadows and hover shift
        default: "bg-primary text-white shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#1A1A1A]",
        secondary: "bg-secondary text-white shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#1A1A1A]",
        white: "bg-white text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#1A1A1A]",
        
        // Outline Pill Variations
        "outline-pill-light": "bg-transparent text-white border border-white/40 rounded-full hover:border-white hover:text-white",
        "outline-pill-dark": "bg-transparent text-white/70 border border-white/30 rounded-full hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A]",
        
        outline: "bg-background text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#DEDEDE]",
      },
      size: {
        default: "px-8 py-4 h-[65px] rounded-full",
        sm: "px-6 py-2 h-10 text-xs rounded-full",
        lg: "px-10 py-5 h-20 text-lg rounded-full",
        pill: "px-6 py-3 h-auto rounded-full text-sm font-semibold not-italic",
        icon: "size-12 rounded-full p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };