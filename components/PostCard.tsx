'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw, Edit3, ChevronDown, ChevronUp, Hash, Lightbulb, Star } from 'lucide-react'
import { cn, getScoreColor, scoreToPercent, copyToClipboard } from '@/lib/utils'
import { LINKEDIN_CHAR_LIMIT } from '@/lib/constants'
import type { GeneratedPost } from '@/lib/types'
import toast from 'react-hot-toast'

// ============================================================
// PostCard — Displays a single generated LinkedIn post version
// ============================================================

interface PostCardProps {
  post: GeneratedPost
  index: number              // Display order (Version 1, 2, 3…)
  onRegenerate?: () => void  // Callback to regenerate this card
  isRegenerating?: boolean
}

export default function PostCard({ post, index, onRegenerate, isRegenerating }: PostCardProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)
  const [showDetails, setShowDetails] = useState(false)

  const { color: scoreColor, bg: scoreBg } = getScoreColor(post.score)
  const displayContent = isEditing ? editedContent : post.content
  const charCount = displayContent.length

  // --- Copy handler ---
  async function handleCopy() {
    const success = await copyToClipboard(displayContent)
    if (success) {
      setCopied(true)
      toast.success('Post copié dans le presse-papiers !')
      setTimeout(() => setCopied(false), 2500)
    } else {
      toast.error('Échec de la copie. Sélectionnez le texte manuellement.')
    }
  }

  // --- Save edit handler ---
  function handleSaveEdit() {
    setIsEditing(false)
    toast.success('Modifications sauvegardées')
  }

  return (
    <article
      className={cn(
        'glass-card p-5 flex flex-col gap-4 transition-all duration-300',
        'animate-slide-up hover:border-zinc-700',
        isRegenerating && 'opacity-60 pointer-events-none',
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Version badge */}
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Version {index + 1}
          </span>

          {/* Quality score badge */}
          <span
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
              scoreBg, scoreColor,
            )}
          >
            <Star className="w-3 h-3" />
            {post.score}/10
          </span>
        </div>

        {/* Character count */}
        <span className={cn(
          'text-xs tabular-nums',
          charCount > LINKEDIN_CHAR_LIMIT ? 'text-red-400' : 'text-zinc-600',
        )}>
          {charCount.toLocaleString('fr-FR')} car.
        </span>
      </div>

      {/* ── Score bar ── */}
      <div className="score-bar -mt-2">
        <div
          className={cn(
            'score-bar-fill',
            post.score >= 8
              ? 'bg-gradient-to-r from-green-500 to-emerald-400'
              : post.score >= 6
              ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
              : 'bg-gradient-to-r from-red-500 to-rose-400',
          )}
          style={{ width: `${scoreToPercent(post.score)}%` }}
        />
      </div>

      {/* ── Post Content ── */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className={cn(
            'w-full min-h-[200px] resize-y rounded-lg p-3',
            'bg-zinc-800/60 border border-zinc-700',
            'text-sm text-zinc-100 leading-relaxed',
            'focus:outline-none focus:border-brand-500/60',
          )}
          autoFocus
        />
      ) : (
        <div className="post-content">{post.content}</div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
            'transition-all duration-200 active:scale-95',
            copied
              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
          )}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copié !' : 'Copier'}
        </button>

        {/* Edit / Save */}
        <button
          onClick={isEditing ? handleSaveEdit : () => setIsEditing(true)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
            'transition-all duration-200 active:scale-95',
            isEditing
              ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
          )}
        >
          <Edit3 className="w-3.5 h-3.5" />
          {isEditing ? 'Sauvegarder' : 'Modifier'}
        </button>

        {/* Regenerate this version */}
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
              'transition-all duration-200 active:scale-95',
              isRegenerating && 'opacity-50 cursor-not-allowed',
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRegenerating && 'animate-spin')} />
            Regénérer
          </button>
        )}

        {/* Toggle details */}
        <button
          onClick={() => setShowDetails((v) => !v)}
          className="ml-auto flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
        >
          {showDetails ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Masquer</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Détails</>
          )}
        </button>
      </div>

      {/* ── Collapsible Details ── */}
      {showDetails && (
        <div className="space-y-3 pt-2 border-t border-zinc-800 animate-fade-in">

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <Hash className="w-3.5 h-3.5 text-brand-400" />
                Hashtags suggérés
              </div>
              <div className="flex flex-wrap gap-1.5">
                {post.hashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => copyToClipboard(`#${tag}`).then(() => toast.success(`#${tag} copié`))}
                    className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 text-xs
                               border border-brand-500/20 hover:border-brand-500/40 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {post.suggestions.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                Suggestions d'amélioration
              </div>
              <ul className="space-y-1">
                {post.suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-zinc-500"
                  >
                    <span className="text-yellow-500 mt-0.5 flex-shrink-0">→</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
