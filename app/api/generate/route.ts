import { NextRequest, NextResponse } from 'next/server'
import { generateLinkedInPosts } from '@/lib/openai'
import type { GenerateRequest, GenerateResponse } from '@/lib/types'
import { DEFAULT_GENERATION_COUNT } from '@/lib/constants'

// ============================================================
// POST /api/generate — Generate LinkedIn post versions
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: GenerateRequest = await request.json()
    const { input, style, count = DEFAULT_GENERATION_COUNT } = body

    // Input validation
    if (!input || typeof input !== 'string' || input.trim().length < 10) {
      return NextResponse.json(
        { error: 'Le texte doit faire au moins 10 caractères.' },
        { status: 400 }
      )
    }

    if (!style) {
      return NextResponse.json(
        { error: 'Un style de post est requis.' },
        { status: 400 }
      )
    }

    if (input.trim().length > 5000) {
      return NextResponse.json(
        { error: 'Le texte ne peut pas dépasser 5000 caractères.' },
        { status: 400 }
      )
    }

    // Clamp count between 1 and 5
    const safeCount = Math.min(5, Math.max(1, count))

    // Call OpenAI to generate posts
    const posts = await generateLinkedInPosts(input.trim(), style, safeCount)

    const response: GenerateResponse = {
      posts,
      style,
      inputLength: input.trim().length,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('[API /generate] Error:', error)

    // Surface OpenAI quota errors specifically
    if (error instanceof Error && error.message.includes('quota')) {
      return NextResponse.json(
        { error: 'Limite OpenAI atteinte. Réessayez dans quelques instants.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération. Réessayez.' },
      { status: 500 }
    )
  }
}
