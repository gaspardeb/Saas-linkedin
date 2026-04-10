'use client'

// ============================================================
// LoadingSkeleton — Animated placeholders during generation
// ============================================================

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        {/* Spinner */}
        <div className="w-5 h-5 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-300">L'IA génère vos posts...</p>
          <p className="text-xs text-zinc-600">Environ 5-10 secondes</p>
        </div>
      </div>

      {/* Skeleton cards */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="glass-card p-5 space-y-4"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-4 w-16 rounded bg-zinc-800 animate-pulse" />
              <div className="h-4 w-12 rounded-full bg-zinc-800 animate-pulse" />
            </div>
            <div className="h-4 w-14 rounded bg-zinc-800 animate-pulse" />
          </div>

          {/* Score bar skeleton */}
          <div className="h-1.5 rounded-full bg-zinc-800 animate-pulse" />

          {/* Content skeleton — multiple lines */}
          <div className="space-y-2">
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-full" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-11/12" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-4/5" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-0" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-full" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-9/12" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-0" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-2/3" />
          </div>

          {/* Button skeletons */}
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded-lg bg-zinc-800 animate-pulse" />
            <div className="h-7 w-18 rounded-lg bg-zinc-800 animate-pulse" />
            <div className="h-7 w-20 rounded-lg bg-zinc-800 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
