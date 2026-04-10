'use client'

import { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { cn, getCharCountColor } from '@/lib/utils'
import { LINKEDIN_CHAR_LIMIT } from '@/lib/constants'
import { AlertCircle } from 'lucide-react'

// ============================================================
// PostInput — Auto-resizing textarea for raw post idea
// ============================================================

interface PostInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
}

export default function PostInput({ value, onChange, disabled, error }: PostInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const charCount = value.length
  const charColor = getCharCountColor(charCount, LINKEDIN_CHAR_LIMIT)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">
          Votre idée ou post brut
        </label>
        {/* Character counter */}
        <span className={cn('text-xs tabular-nums transition-colors', charColor)}>
          {charCount.toLocaleString('fr-FR')} / {LINKEDIN_CHAR_LIMIT.toLocaleString('fr-FR')}
        </span>
      </div>

      {/* Textarea wrapper — styled like a card */}
      <div
        className={cn(
          'relative rounded-xl border transition-all duration-200',
          'bg-zinc-900/60 hover:bg-zinc-900',
          error
            ? 'border-red-500/50 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/30'
            : 'border-zinc-800 focus-within:border-brand-500/60 focus-within:ring-1 focus-within:ring-brand-500/20',
          disabled && 'opacity-60 cursor-not-allowed',
        )}
      >
        <TextareaAutosize
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Ex: J'ai appris que l'échec est important dans l'entrepreneuriat. J'ai raté 3 fois avant de réussir et voici ce que ça m'a appris…"
          minRows={5}
          maxRows={14}
          className={cn(
            'w-full resize-none bg-transparent px-4 py-3.5',
            'text-sm text-zinc-100 placeholder:text-zinc-600',
            'focus:outline-none leading-relaxed',
            disabled && 'cursor-not-allowed',
          )}
          aria-label="Entrez votre idée ou post LinkedIn"
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
        />

        {/* Gradient fade at bottom when content is long */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-900/80 to-transparent rounded-b-xl pointer-events-none" />
      </div>

      {/* Error message */}
      {error && (
        <div id="input-error" className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tip */}
      <p className="text-xs text-zinc-600">
        Collez un post existant ou décrivez une idée brute. L'IA s'occupe du reste.
      </p>
    </div>
  )
}
