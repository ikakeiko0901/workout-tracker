import type { ExerciseDefinition, UserPreferences, WorkoutTemplate } from './models'

const now = '2026-09-09T12:00:00.000Z'

export const seedExercises: ExerciseDefinition[] = [
  { id: 'lateral-raise', name: 'Lateral Raise', exerciseType: 'strength', equipment: ['dumbbells'], resistanceType: 'dumbbell', defaultSets: 3, defaultReps: 12, muscleContributions: [{ muscle: 'shoulders', weight: 1, role: 'primary' }, { muscle: 'triceps', weight: 0.2, role: 'secondary' }] },
  { id: 'shoulder-press', name: 'Shoulder Press', exerciseType: 'strength', equipment: ['dumbbells'], resistanceType: 'dumbbell', defaultSets: 3, defaultReps: 10, muscleContributions: [{ muscle: 'shoulders', weight: 1, role: 'primary' }, { muscle: 'triceps', weight: 0.55, role: 'secondary' }] },
  { id: 'biceps-curl', name: 'Biceps Curl', exerciseType: 'strength', equipment: ['dumbbells'], resistanceType: 'dumbbell', defaultSets: 3, defaultReps: 12, muscleContributions: [{ muscle: 'biceps', weight: 1, role: 'primary' }] },
  { id: 'triceps-extension', name: 'Triceps Extension', exerciseType: 'strength', equipment: ['dumbbell'], resistanceType: 'dumbbell', defaultSets: 3, defaultReps: 12, muscleContributions: [{ muscle: 'triceps', weight: 1, role: 'primary' }, { muscle: 'shoulders', weight: 0.15, role: 'secondary' }] },
  { id: 'front-raise', name: 'Front Raise', exerciseType: 'strength', equipment: ['dumbbells'], resistanceType: 'dumbbell', defaultSets: 3, defaultReps: 10, muscleContributions: [{ muscle: 'shoulders', weight: 1, role: 'primary' }, { muscle: 'chest', weight: 0.2, role: 'secondary' }] },
]

export const seedTemplate: WorkoutTemplate = {
  id: 'growingannanas-arms-shoulders-placeholder',
  name: 'growingannanas — 20 Min Arms + Shoulders',
  notes: 'Example exercises only — not extracted from the source video.',
  isPlaceholderData: true,
  createdAt: now,
  updatedAt: now,
  exercises: seedExercises.map((exercise, order) => ({
    id: `template-${exercise.id}`,
    exerciseDefinitionId: exercise.id,
    order,
    defaultWeight: [5, 8, 10, 8, 5][order],
    weightUnit: 'lb',
    weightBasis: 'per_dumbbell',
    sets: exercise.defaultSets,
    reps: exercise.defaultReps,
  })),
}

export const defaultPreferences: UserPreferences = { id: 'preferences', weightUnit: 'lb', quickWeights: [2, 3, 5, 8, 10] }
