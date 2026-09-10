# MuscleMap repository guide

This file is the durable handoff entry point for Codex sessions and human contributors.

## Required reading

Before changing product behavior or architecture, read:

- `docs/PRODUCT_SPEC.md` — authoritative V1 product requirements.
- `docs/architecture/0001-technical-foundation.md` — accepted initial technical direction.

## Product guardrails

- Optimize the repeat-workout path for a few taps and minimal typing.
- Preserve the five-entity distinction: `ExerciseDefinition`, `WorkoutTemplate`, `WorkoutTemplateExercise`, `WorkoutSession`, and `WorkoutSessionExercise`.
- Store resistance per exercise, never only at workout level.
- Treat completed session data as historical snapshots. Editing definitions or templates must not rewrite history.
- Keep muscle stimulus calculation in a replaceable, pure domain module. Describe results as training stimulus/load, not muscle growth, calorie burn, or medical advice.
- Keep video import behind an editable future interface; do not make automated video analysis a V1 dependency.
- Ask the user before materially simplifying or removing a requirement from the product specification.

## Engineering conventions

- Use strict TypeScript and keep domain logic independent of React and persistence libraries.
- Access persistence through repository interfaces so IndexedDB can later be replaced by cloud storage.
- Use stable IDs and explicit schema versions/migrations for persisted data.
- Store a snapshot of exercise name, muscle contributions, performed configuration, and resistance on each session exercise.
- Make mobile accessibility a feature: large touch targets, clear selected states, semantic controls, and front/back map alternatives for non-visual access.
- Add automated tests for stimulus calculations, aggregation, persistence migrations, and the workout-completion flow.
- Never commit secrets, local databases, generated build output, or dependency folders.

## Working process

At the beginning of a session:

1. Run `git status --short --branch` and preserve unrelated user changes.
2. Read the required documents above and inspect recent commits.
3. Check the current implementation and tests rather than assuming the roadmap is current.

Before handing off:

1. Run the relevant checks and report any that could not run.
2. Update `README.md` if setup commands or project status changed.
3. Add or supersede an ADR when a consequential architecture choice changes.
4. Commit only when the user requests it or when establishing an explicitly requested repository baseline.

