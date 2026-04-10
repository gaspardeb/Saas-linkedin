# LinkedBoost AI

Transformez vos idées en posts LinkedIn viraux avec GPT-4o.

## Stack

- **Frontend + API** : Next.js 14 (App Router)
- **UI** : Tailwind CSS, dark mode, animations
- **IA** : OpenAI GPT-4o
- **Auth + DB** : Supabase
- **Déploiement** : Vercel

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.local.example .env.local
# → Remplir OPENAI_API_KEY et les clés Supabase

# 3. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Clé API OpenAI (GPT-4o) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service Supabase (API routes) |

## Base de données

Exécuter `supabase/schema.sql` dans l'éditeur SQL Supabase.

## Structure

```
app/
├── page.tsx              # Page principale
├── layout.tsx
├── globals.css
└── api/generate/route.ts # POST /api/generate

components/
├── Header.tsx
├── PostInput.tsx
├── StyleSelector.tsx
├── PostCard.tsx
├── GenerationResult.tsx
├── LoadingSkeleton.tsx
└── FreemiumBanner.tsx

lib/
├── openai.ts             # Intégration OpenAI
├── supabase.ts
├── types.ts
├── constants.ts
└── utils.ts

supabase/schema.sql       # Schéma DB
```

## Fonctionnalités

- 3 versions de post générées en < 10 secondes
- 5 styles : Punchy, Professionnel, Calme, Motivation, Expert
- Score qualité /10, hashtags auto, suggestions d'amélioration
- Copier / Modifier / Regénérer chaque version
- Freemium : 5 générations gratuites

## Déploiement Vercel

```bash
npx vercel --prod
```
