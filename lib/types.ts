// ============================================================
// LinkedBoost AI — Core TypeScript Types
// ============================================================

/**
 * The available writing styles/tones for post generation.
 * Each style maps to a specific prompt modifier in the AI call.
 */
export type PostStyle =
  | 'punchy'
  | 'professional'
  | 'calm'
  | 'motivational'
  | 'expert'

/** Metadata for each style option displayed in the UI */
export interface StyleOption {
  id: PostStyle
  label: string
  emoji: string
  description: string
  color: string           // Tailwind color classes for accent
  bgColor: string         // Tailwind bg classes for card
}

/** A single AI-generated LinkedIn post version */
export interface GeneratedPost {
  id: string
  content: string
  score: number           // Quality score out of 10
  suggestions: string[]   // List of improvement suggestions
  hashtags: string[]      // Auto-generated hashtags
  charCount: number       // Character count (LinkedIn limit: 3000)
}

/** The full response from the /api/generate endpoint */
export interface GenerateResponse {
  posts: GeneratedPost[]
  style: PostStyle
  inputLength: number
  generatedAt: string     // ISO timestamp
}

/** The request body sent to /api/generate */
export interface GenerateRequest {
  input: string
  style: PostStyle
  count?: number          // Number of versions to generate (default: 3)
}

/** A saved post from the user's history (requires auth) */
export interface SavedPost {
  id: string
  userId: string
  originalInput: string
  content: string
  style: PostStyle
  score: number
  hashtags: string[]
  createdAt: string
  isFavorite: boolean
}

/** User profile from Supabase */
export interface UserProfile {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  plan: 'free' | 'premium'
  generationsUsed: number
  generationsLimit: number
  createdAt: string
}

/** App-level state for generation flow */
export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'
