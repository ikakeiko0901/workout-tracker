# MuscleMap

MuscleMap is a mobile-first personal workout tracking PWA. It is designed to make repeat workout logging fast and to translate completed exercises into a front/back muscle training-stimulus map.

The repository currently contains the product and architecture baseline. The first implementation milestone is the vertical slice described in [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md).

## Start here

1. Read [`AGENTS.md`](AGENTS.md) for project rules and the handoff checklist.
2. Read [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) for the authoritative V1 requirements.
3. Read [`docs/architecture/0001-technical-foundation.md`](docs/architecture/0001-technical-foundation.md) before scaffolding the app.
4. Record consequential technical decisions as additional ADRs in `docs/architecture/`.

## Current status

- Git repository initialized on `main`.
- Product specification captured.
- Initial stack and architectural boundaries documented.
- Application scaffolding and feature implementation have not started.
- No remote is configured yet.

## Planned stack

React + TypeScript + Vite, with a PWA plugin, IndexedDB behind a repository interface, and Vitest/Testing Library. See ADR 0001 for rationale and constraints.

## Make it available on another computer

After creating an empty private repository on your preferred Git host, run:

```powershell
git add .
git commit -m "chore: establish MuscleMap project baseline"
git remote add origin <your-repository-url>
git push -u origin main
```

On another computer, clone that remote and open the cloned folder in Codex. Do not commit personal secrets or exported workout data.
