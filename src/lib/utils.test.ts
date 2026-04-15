import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('merges tailwind classes predictably', () => {
    expect(cn('px-2 py-1', 'px-4', false && 'hidden')).toBe('py-1 px-4')
  })
})
