# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Kido** — Plateforme web Montessori pour enfants, proposant les compétences des 3 cycles d'apprentissage (Éveil 0-3 ans, Maternelle 3-6 ans, Primaire 6-12 ans) sous forme de jeux interactifs.

**Stack :** FastAPI (Python 3.12) + React 18 + TypeScript + Phaser.js (jeux 2D) + SQLite/SQLModel.

## Commands

### Backend
```bash
cd backend
source venv/bin/activate

# Démarrer le serveur de dev
uvicorn app.main:app --reload

# Tests
python -m pytest tests/ -v

# Un seul test
python -m pytest tests/test_auth.py::test_register_and_login -v
```

### Frontend
```bash
cd frontend

npm run dev       # Vite dev server → http://localhost:5173
npm run build     # Build de production
npm run lint      # ESLint
```

> Note : Node 18 requis (incompatible avec create-vite v5+ et @tailwindcss/vite). Tailwind v4 est configuré via PostCSS (`postcss.config.js`).

## Architecture

### Backend (`backend/app/`)

```
main.py             # Entry point FastAPI, lifespan, CORS, routeurs
core/
  config.py         # Settings (pydantic-settings, .env)
  database.py       # SQLModel engine + get_session()
  security.py       # bcrypt hash/verify + JWT create/decode
models/
  user.py           # Parent ↔ Child (1-to-many)
  game.py           # Skill + Game + Cycle enum (eveil/maternelle/primaire)
  progress.py       # Progress (child × game : score, completed, attempts)
schemas/            # Schémas Pydantic d'entrée/sortie (ConfigDict, from_attributes)
api/
  deps.py           # get_current_parent() — dépendance d'auth JWT
  routes/
    auth.py         # POST /api/auth/register, /api/auth/login
    children.py     # CRUD enfants (protégé parent)
    games.py        # GET jeux par cycle, POST progression
```

**Modèle de données clé :**
- `Parent` → plusieurs `Child` → chaque `Child` a un `cycle` dérivé de `birth_year`
- `Game` est lié à une `Skill` et a un `phaser_scene_key` qui mappe vers une classe Phaser côté frontend
- `Progress` enregistre le meilleur score et accumule le temps de jeu

### Frontend (`frontend/src/`)

```
App.tsx                   # Routes React Router v6 + PrivateRoute
contexts/
  AuthContext.tsx          # Token JWT dans localStorage, login/logout
  ChildContext.tsx         # Enfant actif (persisté en mémoire de session)
services/api.ts            # Axios + intercepteur Bearer token
types/index.ts             # Types TypeScript partagés (Child, Game, Progress…)
pages/
  LoginPage / RegisterPage # Auth parent
  DashboardPage            # Sélection enfant, ajout enfant
  CyclePage                # Liste des jeux du cycle de l'enfant actif
  GamePage                 # Lance le jeu Phaser, sauvegarde la progression
games/
  GameManager.ts           # Registre des scènes Phaser + instanciation
  eveil/ColorSortScene.ts  # Jeu tri par couleur (drag & drop)
  maternelle/ShapeMatchScene.ts  # Jeu reconnaissance de formes
  primaire/NumberCountScene.ts   # Jeu comptage d'objets
```

**Ajouter un nouveau jeu :**
1. Créer une classe Phaser dans `games/<cycle>/NomScene.ts` — appeler `game.onComplete(score)` à la fin
2. L'enregistrer dans `GameManager.ts` (registre `sceneMap`) et dans `GamePage.tsx` (`sceneMap`)
3. Créer l'entrée en base via l'API ou un seed script avec le bon `phaser_scene_key`

### Authentification
JWT Bearer stocké dans `localStorage`. Le parent s'authentifie, puis choisit quel enfant joue. Toutes les routes de données (enfants, progression) vérifient que l'enfant appartient au parent via `get_current_parent()`.

### Base de données
SQLite par défaut (fichier `backend/montessori.db`). La table est créée automatiquement au démarrage via `create_db_and_tables()`. Pour migrer vers PostgreSQL, changer `DATABASE_URL` dans `.env`.
