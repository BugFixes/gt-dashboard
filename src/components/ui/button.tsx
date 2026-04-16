import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[rgba(70,160,194,0.45)]',
  {
    variants: {
      variant: {
        default:
          'bg-[linear-gradient(135deg,#15353b,#1e5661)] text-white shadow-[0_12px_28px_rgba(10,35,40,0.22)] hover:-translate-y-0.5',
        secondary:
          'border border-[var(--line)] bg-white/80 text-[var(--sea-ink)] hover:bg-white',
        outline:
          'border border-[var(--line)] bg-transparent text-[var(--sea-ink)] hover:bg-white/70',
        ghost: 'text-[var(--sea-ink-soft)] hover:bg-white/70 hover:text-[var(--sea-ink)]',
        destructive: 'bg-[#8c2f39] text-white hover:bg-[#7b2630]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
