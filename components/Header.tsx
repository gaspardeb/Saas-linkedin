'use client'

import { Zap, Sparkles } from 'lucide-react'
import { getRemainingFreeGenerations } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { FREE_GENERATIONS_LIMIT } from '@/lib/constants'

// ============================================================
// Header — Top navigation bar with logo + free tier badge
// ============================================================

export default function Header() {
  const [remaining, setRemaining] = useState<number>(FREE_GENERATIONS_LIMIT)

  useEffect(() => {
    setRemaining(getRemainingFreeGenerations())
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Linked<span className="gradient-text">Boost</span>
            <span className="text-zinc-500 font-light ml-1">AI</span>
          </span>
        </div>

        {/* Right side — Free tier counter + CTA */}
        <div className="flex items-center gap-3">
          {/* Free generation counter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <Sparkles className="w-3 h-3 text-brand-400" />
            <span>
              <span className="text-zinc-200 font-medium">{remaining}</span>
              {' '}génération{remaining !== 1 ? 's' : ''} gratuite{remaining !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Upgrade CTA */}
          <button
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-medium
                       hover:from-brand-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-brand-500/20
                       active:scale-95"
          >
            Premium
          </button>
        </div>
      </div>
    </header>
  )
}
