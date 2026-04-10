import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SCORE_COLORS, FREE_GENERATIONS_KEY, FREE_GENERATIONS_LIMIT } from './constants'

// ============================================================
// LinkedBoost AI — Utility Functions
// ============================================================

/**
 * Merges Tailwind CSS classes safely, resolving conflicts.
 * Combines clsx (conditional classes) + tailwind-merge (dedup).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns Tailwind color classes based on a post quality score.
 */
export function getScoreColor(score: number): { color: string; bg: string } {
  if (score >= SCORE_COLORS.high.min)   return { color: SCORE_COLORS.high.color,   bg: SCORE_COLORS.high.bg }
  if (score >= SCORE_COLORS.medium.min) return { color: SCORE_COLORS.medium.color, bg: SCORE_COLORS.medium.bg }
  return                                        { color: SCORE_COLORS.low.color,    bg: SCORE_COLORS.low.bg }
}

/**
 * Formats a score as a percentage bar width (0-100%).
 */
export function scoreToPercent(score: number): number {
  return Math.round((score / 10) * 100)
}

/**
 * Copies text to clipboard and returns a boolean indicating success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

/**
 * Reads the number of free generations used from localStorage.
 */
export function getFreeGenerationsUsed(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(FREE_GENERATIONS_KEY)
  return stored ? parseInt(stored, 10) : 0
}

/**
 * Increments the free generations counter in localStorage.
 */
export function incrementFreeGenerations(): number {
  const current = getFreeGenerationsUsed()
  const next = current + 1
  localStorage.setItem(FREE_GENERATIONS_KEY, String(next))
  return next
}

/**
 * Checks whether a free user has exceeded their generation limit.
 */
export function hasReachedFreeLimit(): boolean {
  return getFreeGenerationsUsed() >= FREE_GENERATIONS_LIMIT
}

/**
 * Returns the number of remaining free generations.
 */
export function getRemainingFreeGenerations(): number {
  return Math.max(0, FREE_GENERATIONS_LIMIT - getFreeGenerationsUsed())
}

/**
 * Truncates a string to a max length, adding ellipsis if needed.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Formats a character count with LinkedIn's 3000-char limit in mind.
 * Returns a color class: green (ok), yellow (near limit), red (over).
 */
export function getCharCountColor(count: number, limit = 3000): string {
  const ratio = count / limit
  if (ratio > 1)    return 'text-red-400'
  if (ratio > 0.85) return 'text-yellow-400'
  return 'text-zinc-500'
}
