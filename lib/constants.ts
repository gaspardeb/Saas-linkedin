import type { StyleOption } from './types'

// ============================================================
// LinkedBoost AI — Application Constants
// ============================================================

/** Available post writing styles with their UI metadata */
export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'punchy',
    label: 'Punchy',
    emoji: '🔥',
    description: 'Engageant, viral, dynamique',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50',
  },
  {
    id: 'professional',
    label: 'Professionnel',
    emoji: '💼',
    description: 'Corporate, propre, crédible',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
  },
  {
    id: 'calm',
    label: 'Calme',
    emoji: '😌',
    description: 'Posé, storytelling, authentique',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20 hover:border-green-500/50',
  },
  {
    id: 'motivational',
    label: 'Motivation',
    emoji: '🚀',
    description: 'Inspirant, énergisant',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50',
  },
  {
    id: 'expert',
    label: 'Expert',
    emoji: '🧠',
    description: 'Autorité, insights, valeur',
    color: 'text-brand-400',
    bgColor: 'bg-brand-500/10 border-brand-500/20 hover:border-brand-500/50',
  },
]

/** Style descriptors used inside the AI prompt */
export const STYLE_PROMPT_MAP: Record<string, string> = {
  punchy:       'PUNCHY et VIRAL (phrases courtes, choc émotionnel, dynamique, accrocheur)',
  professional: 'PROFESSIONNEL et CRÉDIBLE (ton corporate, structuré, sobre, autorité)',
  calm:         'CALME et AUTHENTIQUE (storytelling, posé, humain, narration personnelle)',
  motivational: 'MOTIVANT et INSPIRANT (énergie positive, appel à l\'action, uplift)',
  expert:       'EXPERT et AUTHORITY (insights profonds, données, point de vue unique, valeur éducative)',
}

/** LinkedIn character limit for posts */
export const LINKEDIN_CHAR_LIMIT = 3000

/** Score thresholds for quality indicator color */
export const SCORE_COLORS = {
  high:   { min: 8, color: 'text-green-400',  bg: 'bg-green-500/10' },
  medium: { min: 6, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  low:    { min: 0, color: 'text-red-400',    bg: 'bg-red-500/10' },
}

/** Number of post versions to generate by default */
export const DEFAULT_GENERATION_COUNT = 3

/** Local storage key for tracking free generations */
export const FREE_GENERATIONS_KEY = 'linkedboost_free_count'

/** Default free generation limit */
export const FREE_GENERATIONS_LIMIT = 5
