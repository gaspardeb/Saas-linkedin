'use client'

import { RefreshCw, BarChart3 } from 'lucide-react'
import PostCard from './PostCard'
import type { GeneratedPost, PostStyle } from '@/lib/types'
import { STYLE_OPTIONS } from '@/lib/constants'

// ============================================================
// GenerationResult — Displays all generated post versions
// ============================================================

interface GenerationResultProps {
  posts: GeneratedPost[]
  style: PostStyle
  onRegenerateAll: () => void
  onRegenerateOne: (index: number) => void
  isLoading: boolean
}

export default function GenerationResult({
  posts,
  style,
  onRegenerateAll,
  onRegenerateOne,
  isLoading,
}: GenerationResultProps) {
  const styleOption = STYLE_OPTIONS.find((s) => s.id === style)
  const avgScore = posts.length
    ? Math.round((posts.reduce((sum, p) => sum + p.score, 0) / posts.length) * 10) / 10
    : 0

  return (
    <section className="space-y-5 animate-fade-in">

      {/* ── Results Header ── */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg font-semibold text-zinc-100">
            {posts.length} version{posts.length !== 1 ? 's' : ''} générée{posts.length !== 1 ? 's' : ''}
          </h2>
          {styleOption && (
            <p className="text-sm text-zinc-500">
              Style{' '}
              <span className="text-zinc-300 font-medium">
                {styleOption.emoji} {styleOption.label}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Average score */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm">
            <BarChart3 className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-zinc-500">Score moyen :</span>
            <span className="font-bold text-zinc-100">{avgScore}/10</span>
          </div>

          {/* Regenerate all button */}
          <button
            onClick={onRegenerateAll}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900
                       border border-zinc-800 hover:border-zinc-700
                       text-sm text-zinc-300 hover:text-zinc-100
                       transition-all duration-200 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Tout regénérer</span>
          </button>
        </div>
      </div>

      {/* ── Post Cards Grid ── */}
      <div className="grid gap-4">
        {posts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            index={i}
            onRegenerate={() => onRegenerateOne(i)}
            isRegenerating={isLoading}
          />
        ))}
      </div>
    </section>
  )
}
