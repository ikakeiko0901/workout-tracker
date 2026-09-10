# MuscleMap

MuscleMap is a mobile-first personal workout tracking PWA. It is designed to make repeat workout logging fast and to translate completed exercises into a front/back muscle training-stimulus map.

The repository contains a working first V1 vertical slice based on [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md).

## Start here

1. Read [`AGENTS.md`](AGENTS.md) for project rules and the handoff checklist.
2. Read [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) for the authoritative V1 requirements.
3. Read [`docs/architecture/0001-technical-foundation.md`](docs/architecture/0001-technical-foundation.md) before scaffolding the app.
4. Record consequential technical decisions as additional ADRs in `docs/architecture/`.

## Current status

- Git repository initialized on `main`.
- Product specification captured.
- Initial stack and architectural boundaries documented.
- Mobile-first React/TypeScript PWA scaffolded.
- Versioned IndexedDB persistence and immutable workout-session snapshots implemented.
- Today/week muscle stimulus map, quick workout completion, history, and basic workout create/edit implemented.
- The seeded growingannanas workout is explicitly labeled as placeholder example data.
- Remote configured as `origin`.

## Planned stack

React + TypeScript + Vite, with a PWA plugin, IndexedDB behind a repository interface, and Vitest/Testing Library. See ADR 0001 for rationale and constraints.

## Run locally

Prerequisites: Node.js 20+ and pnpm.

```powershell
pnpm install
pnpm dev
```

Open the local URL printed by Vite. Data persists in the browser's IndexedDB.

## Verify

```powershell
pnpm test
pnpm lint
pnpm build
```

The current automated suite covers the stimulus formula, aggregation, database seeding, transactional completion, recent-weight persistence, and historical snapshot behavior.

## Next V1 increments

- Exercise-level partial completion controls (the model already supports per-exercise completion).
- Editable quick-weight and unit preferences.
- A richer exercise library editor and finer muscle-region SVG.
- Mobile Playwright smoke tests and install icons for production deployment.

## Make changes available on another computer

After creating an empty private repository on your preferred Git host, run:

```powershell
git add .
git commit -m "describe your change"
git push -u origin main
```

On another computer, clone that remote and open the cloned folder in Codex. Do not commit personal secrets or exported workout data.
