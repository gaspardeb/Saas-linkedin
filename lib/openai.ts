import OpenAI from 'openai'
import type { GeneratedPost, PostStyle } from './types'
import { STYLE_PROMPT_MAP } from './constants'

// ============================================================
// LinkedBoost AI — Groq API Integration (via OpenAI-compatible SDK)
// Groq offre une inférence ultra-rapide sur Llama 3.3 70B
// ============================================================

// Lazy Groq client — initialisé à la première requête, pas au build
let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (!_client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is not set')
    }
    // Le SDK OpenAI supporte Groq via baseURL (API 100% compatible)
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  }
  return _client
}

/**
 * Prompt système — cœur de la génération LinkedBoost AI.
 * Instrumente le modèle pour produire des posts LinkedIn optimisés.
 */
function buildSystemPrompt(): string {
  return `Tu es un expert en personal branding sur LinkedIn avec plus de 10 ans d'expérience.
Tu as aidé des centaines de professionnels à multiplier leur engagement par 10.

Ton objectif est de transformer une idée brute en un post LinkedIn extrêmement performant.

RÈGLES ABSOLUES :
- Hook PUISSANT et INATTENDU dès la première ligne (jamais commencer par "Je" seul)
- Paragraphes très courts (1-2 lignes maximum)
- Sauts de ligne entre chaque paragraphe pour la lisibilité mobile
- Ton humain, naturel, jamais robotique ni corporate
- Optimisé pour l'engagement (likes, commentaires, partages)
- Terminer avec une question ouverte OU un CTA fort
- Emojis utilisés avec parcimonie (2-5 max, pertinents)
- Jamais de hashtags DANS le texte (les hashtags sont générés séparément)
- Longueur idéale : 150-300 mots

FORMAT DE RÉPONSE (JSON strict) :
Tu dois retourner un objet JSON avec une clé "posts" contenant un tableau :
{
  "posts": [
    {
      "content": "le texte complet du post LinkedIn",
      "score": 8,
      "suggestions": ["suggestion 1", "suggestion 2"],
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
    }
  ]
}

SCORING (score /10) :
- Hook mémorable : +2 pts
- Structure lisible : +2 pts
- Valeur/originalité : +2 pts
- CTA/question finale : +2 pts
- Ton approprié au style demandé : +2 pts`
}

/**
 * Prompt utilisateur — injecte le style et le contenu brut.
 */
function buildUserPrompt(input: string, style: PostStyle, count: number): string {
  const styleDescription = STYLE_PROMPT_MAP[style] || 'PROFESSIONNEL'

  return `Génère exactement ${count} versions différentes d'un post LinkedIn.

TON DEMANDÉ : ${styleDescription}

IDÉE / POST À AMÉLIORER :
"${input}"

IMPORTANT :
- Chaque version doit être significativement différente des autres
- Respecte strictement le format JSON demandé avec la clé "posts"
- Les hashtags doivent être pertinents et populaires sur LinkedIn (3-5 par post)
- Les suggestions doivent être actionnables et spécifiques
- Score calculé honnêtement selon les critères fournis`
}

/**
 * Génère plusieurs versions d'un post LinkedIn via Groq (Llama 3.3 70B).
 * Retourne un tableau de posts avec score, hashtags et suggestions.
 */
export async function generateLinkedInPosts(
  input: string,
  style: PostStyle,
  count: number = 3
): Promise<GeneratedPost[]> {
  try {
    const client = getClient()

    const response = await client.chat.completions.create({
      // Llama 3.3 70B — meilleur rapport qualité/vitesse sur Groq
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user',   content: buildUserPrompt(input, style, count) },
      ],
      // JSON mode pour garantir une réponse parseable
      response_format: { type: 'json_object' },
      temperature: 0.85,
      max_tokens: 4000,
      top_p: 0.95,
    })

    const rawContent = response.choices[0]?.message?.content
    if (!rawContent) {
      throw new Error('Réponse vide du modèle')
    }

    // Parser et valider le JSON
    const parsed = JSON.parse(rawContent)

    // Accepter { posts: [...] } ou directement [...]
    const postsArray: unknown[] = Array.isArray(parsed)
      ? parsed
      : parsed.posts || parsed.versions || []

    if (!Array.isArray(postsArray) || postsArray.length === 0) {
      throw new Error('Format de réponse invalide')
    }

    // Normaliser chaque post vers notre type GeneratedPost
    return postsArray.map((post, index): GeneratedPost => {
      const p = post as Record<string, unknown>
      return {
        id: `post-${Date.now()}-${index}`,
        content:     String(p.content || ''),
        score:       Math.min(10, Math.max(0, Number(p.score) || 7)),
        suggestions: Array.isArray(p.suggestions) ? p.suggestions.map(String) : [],
        hashtags:    Array.isArray(p.hashtags)    ? p.hashtags.map(String)    : [],
        charCount:   String(p.content || '').length,
      }
    })
  } catch (error) {
    console.error('[Groq] Generation error:', error)
    throw error
  }
}
