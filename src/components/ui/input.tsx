import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-[var(--line)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] [color-scheme:light] shadow-sm outline-none transition placeholder:text-[var(--sea-ink-soft)] focus-visible:border-[rgba(70,160,194,0.45)] focus-visible:ring-2 focus-visible:ring-[rgba(70,160,194,0.18)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export { Input }
