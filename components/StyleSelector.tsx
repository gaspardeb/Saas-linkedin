'use client'

import { cn } from '@/lib/utils'
import { STYLE_OPTIONS } from '@/lib/constants'
import type { PostStyle } from '@/lib/types'

// ============================================================
// StyleSelector — Selectable writing style/tone cards
// ============================================================

interface StyleSelectorProps {
  value: PostStyle
  onChange: (style: PostStyle) => void
  disabled?: boolean
}

export default function StyleSelector({ value, onChange, disabled }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-300">
        Choisissez votre style
      </label>

      {/* Style grid — responsive 2 cols on mobile, 5 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = value === style.id

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => !disabled && onChange(style.id)}
              disabled={disabled}
              className={cn(
                // Base styles
                'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200',
                'text-center cursor-pointer select-none',
                // Disabled state
                disabled && 'opacity-50 cursor-not-allowed',
                // Unselected state — apply style's theme colors
                !isSelected && style.bgColor,
                !isSelected && 'text-zinc-400',
                // Selected state — bright highlight
                isSelected && 'border-brand-500 bg-brand-500/15 text-zinc-100 ring-1 ring-brand-500/40',
                // Hover (non-selected)
                !isSelected && !disabled && 'hover:text-zinc-200',
              )}
              aria-pressed={isSelected}
              aria-label={`Style ${style.label} — ${style.description}`}
            >
              {/* Emoji icon */}
              <span className="text-2xl leading-none" role="img" aria-hidden>
                {style.emoji}
              </span>

              {/* Style name */}
              <span className={cn(
                'text-xs font-semibold leading-tight',
                isSelected ? 'text-zinc-100' : style.color,
              )}>
                {style.label}
              </span>

              {/* Description — hidden on mobile */}
              <span className="hidden sm:block text-[10px] leading-tight text-zinc-500 text-center">
                {style.description}
              </span>

              {/* Selected indicator dot */}
              {isSelected && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-400" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
