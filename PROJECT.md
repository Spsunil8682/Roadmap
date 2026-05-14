# Developer Roadmaps — Project Documentation

An interactive learning platform that helps developers pick a career path, follow a structured roadmap, track their progress, and test their knowledge with topic-wise quizzes and LeetCode problems.

---

## 1. Problem Statement — What this project solves

Self-learners struggle with three concrete things:

1. **"What do I learn next?"** — The web has unlimited tutorials but no clear sequence. Beginners burn weeks bouncing between articles without knowing what depends on what.
2. **"Am I making progress?"** — Without a checklist or tracker, learning feels endless and motivation drops.
3. **"Do I actually know this?"** — Reading docs ≠ understanding. Most resources don't give learners a way to validate retention before moving on.

**This project solves all three by providing:**

- **Curated, ordered roadmaps** (role-based like Frontend / Backend / Full-Stack, and skill-based like JavaScript / DSA) that act as a single source of truth for "what to learn, in what order."
- **Per-step progress tracking** persisted in the browser, so a learner can close the tab and resume exactly where they left off.
- **Topic-locked quizzes** — interview-style MCQs that unlock only after the learner marks a step "Completed," forcing self-assessment instead of skipping ahead.
- **Hand-picked LeetCode problems** mapped to each DSA topic, so theory immediately connects to practice.
- **A clean, distraction-free UI** with dark mode, search, filtering by difficulty / category, and smooth animations.

---

## 2. Tech Stack Used

| Layer | Technology | Why it was used |
|---|---|---|
| Framework | **Next.js 15** (App Router, Turbopack) | File-based routing, dynamic routes (`/roadmap/[id]`), fast dev server via Turbopack, built-in font optimization. |
| Language | **TypeScript 5** | Strong typing for roadmap/node/quiz data structures (see `src/types/index.ts`) — catches data shape mistakes at compile time. |
| UI library | **React 19** | Latest concurrent features, hooks-based state management. |
| Styling | **Tailwind CSS v4** (via `@tailwindcss/postcss`) | Utility-first styling, dark mode via `dark:` variants, consistent spacing/colour system without writing custom CSS. |
| Animations | **Framer Motion 12** | Page transitions, staggered card reveals, hover/tap micro-interactions, modal enter/exit, pulsing "current step" indicator. |
| Icons | **Lucide React** | Lightweight, tree-shakeable SVG icon set (Search, Filter, ArrowRight, CheckCircle2, GraduationCap, etc.). |
| Fonts | **next/font (Inter)** | Self-hosted, zero-layout-shift font loading. |
| Linting | **ESLint 9** + `eslint-config-next` | Catches React/Next.js anti-patterns. |
| Package manager | **Bun** (lockfile committed) | Fast install and dev startup. |
| Data storage | **JSON files in `src/data/`** + `localStorage` | No backend needed; all roadmaps/quizzes are static JSON, and user progress is stored client-side. |

---

## 3. Folder Structure

```
roadmap-website/
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (Header + Footer + theme init)
│   │   ├── page.tsx            # Home page — roadmap grid + search/filter
│   │   ├── globals.css         # Tailwind base + theme vars
│   │   ├── roadmap/[id]/       # Dynamic page per roadmap
│   │   ├── roadmaps/           # All roadmaps listing
│   │   ├── guides/             # Guides listing
│   │   ├── projects/           # Practice projects listing
│   │   ├── resources/          # Curated external resources
│   │   ├── blog/               # Blog index
│   │   ├── about/              # About Us
│   │   └── contact/            # Contact Us
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Sticky nav, dark-mode toggle, mobile menu
│   │   │   └── Footer.tsx
│   │   └── roadmap/
│   │       ├── RoadmapVisualization.tsx  # Vertical timeline of steps
│   │       ├── NodeModal.tsx             # Full-detail node view
│   │       └── QuizModal.tsx             # Quiz runner with scoring
│   ├── data/                   # Static JSON datasets
│   │   ├── roadmaps.json
│   │   ├── roadmaps-fullstack.json
│   │   ├── javascript-roadmap.json
│   │   ├── dsa-roadmap.json
│   │   ├── quizzes.json
│   │   ├── leetcode-problems.json
│   │   ├── guides.json
│   │   ├── projects.json
│   │   ├── resources.json
│   │   ├── blogs.json
│   │   └── about.json
│   └── types/index.ts          # Roadmap, RoadmapNode, QuizQuestion, etc.
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── package.json
```

---

## 4. Features Built

### 4.1 Home page (`/`)
- Hero section with gradient headline and stats (10k+ devs, 50+ roadmaps).
- **Live search** across roadmap title, description, and tags.
- **Category filter** — All / Role-based / Skill-based, each with a live count.
- **Difficulty filter** — Beginner / Intermediate / Advanced.
- Responsive 1/2/3-column grid of roadmap cards with hover lift animation.
- Empty state when no results match.

### 4.2 Roadmap detail page (`/roadmap/[id]`)
- Pulls a roadmap by ID from `roadmaps.json`.
- **Progress bar** computed from completed nodes.
- **Vertical timeline visualization** (`RoadmapVisualization.tsx`) — each step is collapsible, shows difficulty badge, current-step pulse animation, resources list, sub-topics, and a status switcher.
- **Status workflow** — `not-started` → `in-progress` → `completed` / `skipped`, persisted to `localStorage` under `roadmap-progress-{id}`.
- **Locked steps** — steps after the current "in-progress" step are visually locked to enforce sequential learning.
- **Quiz card** appears for steps with quizzes — disabled until the step is marked Completed.
- **LeetCode problems card** appears for DSA steps, with per-problem difficulty badges (Easy / Medium / Hard) and direct links.
- **Node modal** for a focused full-detail view of any step.

### 4.3 Quiz system (`QuizModal.tsx`)
- Question-by-question navigation (Next / Previous).
- Tracks answers in local state.
- Score computed on submit, with per-question correctness, explanations, and a final trophy screen.
- Esc-to-close keyboard support.
- Restart-quiz functionality.

### 4.4 Theme system
- **Persisted dark mode** — checks `localStorage.theme` first, falls back to `prefers-color-scheme`.
- Theme is applied **inline in `<head>`** via a small script in `layout.tsx` to prevent a flash of incorrect theme (FOIT) on first paint.
- Header has a Sun/Moon toggle that updates both the DOM class and `localStorage`.

### 4.5 Other pages
- **About / Contact** — static informational pages.
- **Guides / Projects / Resources / Blog** — listing pages backed by their respective JSON datasets.

---

## 5. Problems Solved (Technical)

| # | Problem | How it was solved |
|---|---|---|
| 1 | Users lose progress when they close the tab. | All node progress is keyed by roadmap ID and saved to `localStorage` in `roadmap/[id]/page.tsx`. Re-opening the same roadmap rehydrates state via `useEffect`. |
| 2 | Dark mode "flash" on initial paint (white screen → dark). | Theme is resolved and `dark` class is applied synchronously inside an inline `<script>` in `layout.tsx` **before** React hydrates. |
| 3 | Learners skip ahead before mastering basics. | Steps beyond the current "in-progress" step are visually locked, and quizzes are disabled until a step is marked Completed. |
| 4 | "Where am I?" overwhelm on long roadmaps. | A pulsing **"Start here"** marker highlights the next pending step, computed dynamically with `useMemo`. |
| 5 | No backend, but data needs to be queryable. | Static JSON datasets are imported directly and filtered client-side with `useEffect` + `useState`. Keeps deployment to a simple static-friendly Next.js build. |
| 6 | Type safety across roadmaps / quizzes / problems. | Centralized TS interfaces in `src/types/index.ts` (`Roadmap`, `RoadmapNode`, `QuizQuestion`, `LeetCodeProblem`, etc.) — every JSON file is cast through these. |
| 7 | Inconsistent UI on mobile vs. desktop. | Tailwind responsive utilities + dedicated mobile menu (animated with `AnimatePresence`) in `Header.tsx`. |
| 8 | Theory without practice. | DSA roadmap nodes are joined to `leetcode-problems.json` by node ID, so each topic surfaces hand-picked problems with difficulty badges. |

---

## 6. How to Run

```bash
# install
bun install        # or npm install

# dev (Turbopack)
bun dev            # opens http://localhost:3000

# build
bun run build

# production server
bun start

# lint
bun run lint
```

---

## 7. Future Improvements (not yet implemented)

- User accounts + server-side progress sync (currently `localStorage`-only).
- Roadmap authoring UI (currently JSON-edited).
- Search across guides / projects / resources from a global command palette.
- SEO metadata per roadmap detail page.
- Unit + e2e tests.
