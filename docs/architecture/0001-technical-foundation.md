# ADR 0001: Technical foundation

- Status: Accepted
- Date: 2026-09-09

## Context

MuscleMap is an iPhone-friendly personal PWA whose first milestone must work locally, persist historical workouts, update muscle visualizations immediately, and remain evolvable toward authentication, cloud sync, and assisted video import.

## Decision

Use the following initial foundation:

- **UI:** React with strict TypeScript and Vite.
- **PWA:** `vite-plugin-pwa`, with an installable manifest and conservative offline caching. User data lives in the data store, not the service-worker cache.
- **Routing:** React Router with four primary areas: Today, Workouts, History, and Settings.
- **Local persistence:** IndexedDB, preferably through Dexie, isolated behind typed repository interfaces. Persisted schemas are versioned and migrated explicitly.
- **Domain layer:** Framework-independent TypeScript entities and services. Muscle stimulus calculation and daily/weekly aggregation are pure functions.
- **State:** Local component state plus focused context/hooks initially. Add a larger state library only when demonstrated complexity warrants it.
- **Validation:** Zod at persistence/import boundaries so invalid stored or imported data does not leak into the domain.
- **Testing:** Vitest and Testing Library for domain and interaction tests; Playwright for a small mobile completion-flow smoke suite when the vertical slice is operational.
- **Body map:** A locally owned accessible SVG component with stable region IDs. Rendering maps numeric stimulus to a continuous or stepped visual scale while also exposing textual values.

## Data boundaries

The domain must keep these records distinct:

1. `ExerciseDefinition`: reusable meaning and muscle mapping of an exercise.
2. `WorkoutTemplate`: saved repeatable workout metadata.
3. `WorkoutTemplateExercise`: an ordered exercise reference plus template-specific defaults.
4. `WorkoutSession`: one completed workout occurrence.
5. `WorkoutSessionExercise`: an immutable-enough snapshot of what was actually performed.

Completing a template creates a session and session-exercise snapshots in one logical transaction. Historical records retain their actual weight, unit, completion, volume/duration, and muscle contribution snapshot even when the source template or definition later changes.

Use stable string IDs, ISO timestamps, and explicit weight units. The default interpretation for dumbbells is weight per dumbbell; encode this explicitly rather than relying on display text.

## Replaceable services

- `StimulusCalculator`: accepts performed exercises and returns scores by stable muscle-region ID.
- `WorkoutRepository`: manages definitions, templates, sessions, preferences, and atomic completion.
- `VideoWorkoutAnalyzer`: future asynchronous boundary that accepts a source URL and returns an editable draft; V1 may expose no implementation.

## Consequences

The app can ship without a backend and remain useful offline. Repository and analyzer boundaries allow later cloud sync and automated import without coupling UI components to those systems. IndexedDB migrations and snapshot duplication add some discipline and storage overhead, but protect historical accuracy.

## Initial delivery order

1. Scaffold the typed PWA and test tooling.
2. Define domain models, seed placeholder workout data, and implement the stimulus service with tests.
3. Implement versioned IndexedDB repositories and workout-completion transaction tests.
4. Build Today and the accessible front/back muscle map.
5. Build workout review with per-exercise quick weights and completion.
6. Add weekly aggregation, basic history, and template create/edit.
7. Verify the core flow at an iPhone-sized viewport and document run/test commands.

