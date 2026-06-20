import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/30 active:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-brand text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-hover",
        hero:
          "shimmer bg-gradient-brand text-primary-foreground shadow-card hover:-translate-y-1 hover:scale-[1.04] hover:shadow-hover",
        accent:
          "bg-gradient-cool text-accent-foreground shadow-soft hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-card",
        sunny:
          "bg-gradient-sunny text-sunny-foreground shadow-soft hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-card",
        outline:
          "border-2 border-primary/25 bg-card text-foreground hover:border-primary/60 hover:bg-secondary/60 hover:-translate-y-0.5 hover:scale-[1.02]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:-translate-y-0.5",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-5 text-sm [&_svg:not([class*='size-'])]:size-4",
        xs: "h-8 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 gap-2 px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        xl: "h-14 gap-2 px-8 text-base font-semibold [&_svg:not([class*='size-'])]:size-5",
        icon: "size-11 [&_svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
