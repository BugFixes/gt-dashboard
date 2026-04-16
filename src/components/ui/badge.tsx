import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition',
  {
    variants: {
      variant: {
        default: 'border-[var(--line)] bg-white/80 text-[var(--sea-ink)]',
        good: 'border-[#2a8457]/25 bg-[#dff6ea] text-[#145c38]',
        warn: 'border-[#d8a037]/25 bg-[#fff2d8] text-[#8a5a00]',
        critical: 'border-[#d95662]/25 bg-[#ffe1e5] text-[#8e2430]',
        neutral: 'border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
