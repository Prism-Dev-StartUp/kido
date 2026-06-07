# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Kido** — Plateforme web éducative Montessori pour enfants (6–12 ans), centrée sur la grammaire française (Nature des mots). Les activités sont inspirées de Montessori, Freinet, Reggio Emilia et de la pédagogie active.

**Stack :** FastAPI (Python 3.12) + React 18 + TypeScript + Phaser.js (jeux 2D) + PostgreSQL (Supabase) / SQLModel.

**Déploiement :** Frontend → Vercel (`kido-tawny.vercel.app`) · Backend → Render (`kido-wbhg.onrender.com`) · DB → Supabase.

## Design system

- **Fond global :** `#faf7f2` (blanc cassé chaud, "papier Montessori")
- **Texte principal :** `#2d2a26` (encre chaude)
- **Police :** **Nunito** (Google Fonts) — arrondie, lisible, adaptée enfants
- **Couleurs des natures de mots (symboles Montessori officiels) :**
  - Nom → `#2d2a26` (triangle noir)
  - Déterminant → `#7c5c2e` (triangle beige)
  - Adjectif → `#1e3a8a` (triangle bleu)
  - Verbe → `#b91c1c` (cercle rouge)
  - Pronom → `#6d28d9` (triangle violet)
  - Adverbe → `#c2410c` (petit cercle orange)
  - Préposition → `#15803d` (demi-cercle vert)
  - Conjonction → `#be185d` (tiret rose)
- **Classes Tailwind utilitaires** (dans `index.css`) : `.page`, `.content`, `.card`, `.card-hover`, `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.input`, `.dot-done`, `.dot-progress`, `.dot-empty`
- **Fond Phaser** : `#0f172a` (bleu nuit, contraste fort pour les jeux)

## Commands

### Backend
```bash
cd backend

# Démarrer le serveur de dev (port obligatoire : 8001)
./venv/bin/uvicorn app.main:app --reload --port 8001

# Tests
./venv/bin/python -m pytest tests/ -v
```

### Frontend
```bash
cd frontend

npm run dev       # Vite dev server → http://localhost:5173
npm run build     # Build de production (vérifie TypeScript)
npm run lint      # ESLint
```

> L'URL de l'API en dev est définie dans `frontend/.env` (`VITE_API_URL=http://localhost:8001/api`). En production, la variable est injectée par Vercel.

## Architecture

### Backend (`backend/app/`)

```
main.py             # Entry point FastAPI, lifespan (create tables + seed), CORS depuis ALLOWED_ORIGINS
seed_data.py        # Seed idempotent appelé au démarrage (ne ré-insère pas si données existent)
core/
  config.py         # Settings (pydantic-settings, .env) — DATABASE_URL, SECRET_KEY
  database.py       # SQLModel engine + get_session() — SSL auto pour PostgreSQL
  security.py       # bcrypt hash/verify + JWT create/decode
models/
  user.py           # Parent ↔ Child (1-to-many)
  game.py           # Skill + Game + Cycle enum
  progress.py       # Progress (child × game : score, completed, attempts)
schemas/            # Schémas Pydantic d'entrée/sortie
api/
  deps.py           # get_current_parent() — dépendance d'auth JWT
  routes/
    auth.py         # POST /api/auth/register, /api/auth/login
    children.py     # CRUD enfants (protégé parent)
    games.py        # GET jeux, POST progression
```

**Variables d'environnement (Render) :**
- `DATABASE_URL` — URL Session Pooler Supabase (`postgresql://postgres.xxx:PWD@pooler.supabase.com:5432/postgres`)
- `SECRET_KEY` — généré automatiquement par Render
- `ALLOWED_ORIGINS` — `https://kido-tawny.vercel.app,http://localhost:5173`

### Frontend (`frontend/src/`)

```
App.tsx                        # Routes React Router v6 (PrivateRoute + ChildRoute)
data/grammar.ts                # Source de vérité : 8 WordTypeConfig + fonctions getProgress/setPhaseProgress
contexts/
  AuthContext.tsx              # Token JWT dans localStorage, login/logout
  ChildContext.tsx             # Enfant actif (mémoire de session, non persisté)
services/api.ts                # Axios + intercepteur Bearer — BASE_URL = VITE_API_URL
types/index.ts                 # Types TypeScript partagés (Child, Game, Progress…)
components/
  GrammarSymbol.tsx            # SVG des 7 symboles Montessori (triangle-lg/md/sm, circle-lg/sm, half-circle, dash)
  Layout.tsx                   # Navbar sticky (logo, enfant actif, progression, déconnexion)
pages/
  LoginPage / RegisterPage     # Auth parent — design épuré papier
  ChildSelectPage              # Sélection / création de profil enfant (remplace Dashboard)
  HomePage                     # Grille des 8 natures de mots avec symboles + dots de progression
  NaturePage                   # 4 phases d'une nature, déverrouillage séquentiel
  ActivityPage                 # Lance React activity ou jeu Phaser, sauvegarde progression
  ProgressPage                 # Tableau ● ◐ ○ pour toutes les natures × 4 phases
activities/
  NomDiscovery.tsx             # Phase découverte du Nom : galerie par catégorie (React, pas Phaser)
games/
  nom/
    NomSortScene.ts            # Drag & drop : trier 16 noms en 4 catégories
    NomMemoryScene.ts          # Mémoire : paires mot ↔ emoji (8 paires, grille 4×4)
    NomHuntScene.ts            # Chasse aux noms : cliquer les noms dans 5 phrases
  verbe/
    VerbAnimScene.ts           # Trouver le verbe dans 8 phrases cliquables
  preposition/
    PrepSpaceScene.ts          # Choisir la bonne préposition selon une scène spatiale
```

### Parcours pédagogique (4 phases par nature)

| Phase | id | Principe Montessori |
|-------|----|---------------------|
| Découverte | `decouverte` | Sensoriel / manipulatoire — concret |
| Entraînement guidé | `guidee` | Pratique avec auto-correction |
| Autonomie | `autonomie` | Libre pratique sans guidage |
| Réinvestissement | `reinvest` | Application dans de vraies phrases |

Les phases se déverrouillent dans l'ordre. La progression est stockée dans `localStorage` sous la clé `kido_progress_${childId}`.

### Ajouter une activité pour une nature de mot

1. **Jeu Phaser** : créer `src/games/<nature>/MonScene.ts` — appeler `(this.game as any).onComplete?.(score)` en fin de partie
2. **Composant React** : créer `src/activities/MaDiscovery.tsx` — recevoir `onComplete: (score: number) => void` en prop
3. Dans `ActivityPage.tsx`, ajouter la clé dans `PHASER_MAP` ou `REACT_MAP`
4. Dans `data/grammar.ts`, mettre à jour le champ `activityKey` de la phase concernée

### Authentification

JWT Bearer stocké dans `localStorage`. Le parent se connecte, sélectionne un enfant (ChildContext en mémoire), puis navigue vers les activités. Toutes les routes backend vérifient l'appartenance via `get_current_parent()`.

### Base de données

PostgreSQL (Supabase) en production. SQLite en dev local (changer `DATABASE_URL` dans `backend/.env`). Le `database.py` ajoute `?sslmode=require` automatiquement pour PostgreSQL. Les tables sont créées et le seed lancé à chaque démarrage du serveur (idempotent).
