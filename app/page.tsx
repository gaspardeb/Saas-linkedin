'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Sparkles, Zap, TrendingUp, Clock } from 'lucide-react'

import Header from '@/components/Header'
import PostInput from '@/components/PostInput'
import StyleSelector from '@/components/StyleSelector'
import GenerationResult from '@/components/GenerationResult'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import FreemiumBanner from '@/components/FreemiumBanner'

import type { GeneratedPost, PostStyle, GenerateResponse } from '@/lib/types'
import {
  incrementFreeGenerations,
  getFreeGenerationsUsed,
  hasReachedFreeLimit,
} from '@/lib/utils'

// ============================================================
// LinkedBoost AI — Main Page
// ============================================================

export default function HomePage() {
  // ── Form state ──
  const [input, setInput] = useState('')
  const [style, setStyle] = useState<PostStyle>('punchy')
  const [inputError, setInputError] = useState<string | undefined>()

  // ── Generation state ──
  const [posts, setPosts] = useState<GeneratedPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [freeUsed, setFreeUsed] = useState(getFreeGenerationsUsed)

  // ── Generate posts via API ──
  const generate = useCallback(async (overrideInput?: string, overrideStyle?: PostStyle) => {
    const currentInput = (overrideInput ?? input).trim()
    const currentStyle = overrideStyle ?? style

    // Client-side validation
    if (currentInput.length < 10) {
      setInputError('Entrez au moins 10 caractères pour continuer.')
      return
    }
    setInputError(undefined)

    // Freemium gate — check limit BEFORE generating
    if (hasReachedFreeLimit()) {
      toast.error('Limite gratuite atteinte. Passez à Premium pour continuer.', {
        icon: '👑',
        duration: 4000,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: currentInput,
          style: currentStyle,
          count: 3,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(err.error || `Erreur HTTP ${response.status}`)
      }

      const data: GenerateResponse = await response.json()
      setPosts(data.posts)
      setHasGenerated(true)

      // Increment free usage counter
      const newCount = incrementFreeGenerations()
      setFreeUsed(newCount)

      toast.success(`${data.posts.length} versions générées !`, { icon: '🚀' })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur lors de la génération'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [input, style])

  // ── Regenerate a single post slot ──
  const handleRegenerateOne = useCallback((index: number) => {
    // For individual regen, we call the API for 1 post and replace at the index
    generate()
  }, [generate])

  // ── Stats for hero ──
  const stats = [
    { icon: Zap,       label: 'Génération',  value: '< 10s' },
    { icon: TrendingUp, label: 'Engagement', value: '+3x'   },
    { icon: Clock,     label: 'Temps économisé', value: '2h/sem' },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* ── Hero Section ── */}
          <section className="text-center space-y-5 pt-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Propulsé par GPT-4o
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Transformez vos idées en{' '}
              <span className="gradient-text">posts viraux</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Entrez une idée brute, choisissez votre style.
              L'IA génère 3 versions optimisées pour LinkedIn en quelques secondes.
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 pt-2">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Icon className="w-4 h-4 text-brand-400" />
                  <span className="text-zinc-100 font-semibold">{value}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Input Form ── */}
          <section className="glass-card p-6 space-y-6">

            {/* Text input */}
            <PostInput
              value={input}
              onChange={setInput}
              disabled={isLoading}
              error={inputError}
            />

            {/* Style selector */}
            <StyleSelector
              value={style}
              onChange={setStyle}
              disabled={isLoading}
            />

            {/* Generate button */}
            <button
              onClick={() => generate()}
              disabled={isLoading || !input.trim()}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl
                         font-semibold text-white text-sm
                         bg-gradient-to-r from-brand-500 via-purple-500 to-brand-600
                         hover:from-brand-400 hover:via-purple-400 hover:to-brand-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-brand-500/20
                         transition-all duration-200 active:scale-[0.98]"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Génération en cours…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Générer mes posts LinkedIn
                </>
              )}
            </button>

            {/* Freemium counter — shown inside form */}
            {freeUsed < 5 && (
              <p className="text-center text-xs text-zinc-600">
                {5 - freeUsed} génération{5 - freeUsed !== 1 ? 's' : ''} gratuite{5 - freeUsed !== 1 ? 's' : ''} restante{5 - freeUsed !== 1 ? 's' : ''}
              </p>
            )}
          </section>

          {/* ── Freemium Limit Banner ── */}
          <FreemiumBanner used={freeUsed} />

          {/* ── Loading Skeleton ── */}
          {isLoading && <LoadingSkeleton />}

          {/* ── Generated Results ── */}
          {!isLoading && hasGenerated && posts.length > 0 && (
            <GenerationResult
              posts={posts}
              style={style}
              onRegenerateAll={() => generate()}
              onRegenerateOne={handleRegenerateOne}
              isLoading={isLoading}
            />
          )}

          {/* ── Empty state after first load ── */}
          {!isLoading && !hasGenerated && (
            <section className="text-center py-10 space-y-4 animate-fade-in">
              {/* Feature teaser cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {[
                  {
                    emoji: '🎯',
                    title: 'Score de qualité',
                    desc: 'Chaque post est noté /10 selon son hook, sa lisibilité et son engagement potentiel.',
                  },
                  {
                    emoji: '#️⃣',
                    title: 'Hashtags auto',
                    desc: 'Des hashtags LinkedIn populaires générés automatiquement pour chaque post.',
                  },
                  {
                    emoji: '💡',
                    title: 'Suggestions IA',
                    desc: 'Des conseils actionnables pour améliorer encore votre post avant de publier.',
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2"
                  >
                    <span className="text-2xl">{feature.emoji}</span>
                    <h3 className="text-sm font-semibold text-zinc-200">{feature.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ── Ambient glow ── */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
        aria-hidden
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full
                        bg-brand-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full
                        bg-purple-500/5 blur-3xl" />
      </div>
    </>
  )
}
