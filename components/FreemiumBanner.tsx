'use client'

import { Crown, Zap } from 'lucide-react'
import { FREE_GENERATIONS_LIMIT } from '@/lib/constants'

// ============================================================
// FreemiumBanner — Shown when user has reached the free limit
// ============================================================

interface FreemiumBannerProps {
  used: number
}

export default function FreemiumBanner({ used }: FreemiumBannerProps) {
  const isAtLimit = used >= FREE_GENERATIONS_LIMIT
  const remaining = Math.max(0, FREE_GENERATIONS_LIMIT - used)

  if (!isAtLimit) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-purple-500/8 to-pink-500/5 p-6">
      {/* Decorative glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl" />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Crown className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-zinc-100">
            Vous avez utilisé vos {FREE_GENERATIONS_LIMIT} générations gratuites
          </h3>
          <p className="text-sm text-zinc-400">
            Passez à Premium pour des générations illimitées, des styles avancés et la sauvegarde de vos posts.
          </p>
        </div>

        {/* CTA */}
        <button
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-semibold
                     hover:from-brand-400 hover:to-purple-500 transition-all duration-200
                     shadow-lg shadow-brand-500/25 active:scale-95"
        >
          <Zap className="w-4 h-4" />
          Passer Premium
        </button>
      </div>
    </div>
  )
}
