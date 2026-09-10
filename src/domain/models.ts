export const muscleRegions = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'core', 'glutes', 'quadriceps', 'hamstrings', 'calves',
] as const

export type MuscleRegion = (typeof muscleRegions)[number]
export type ResistanceType = 'dumbbell' | 'bodyweight' | 'band' | 'machine' | 'cardio' | 'other'
export type WeightUnit = 'lb' | 'kg'

export interface MuscleContribution {
  muscle: MuscleRegion
  weight: number
  role: 'primary' | 'secondary'
}

export interface ExerciseDefinition {
  id: string
  name: string
  exerciseType: 'strength' | 'cardio' | 'mobility' | 'other'
  equipment: string[]
  resistanceType: ResistanceType
  muscleContributions: MuscleContribution[]
  defaultSets?: number
  defaultReps?: number
  defaultDurationSeconds?: number
}

export interface WorkoutTemplateExercise {
  id: string
  exerciseDefinitionId: string
  order: number
  defaultWeight?: number
  weightUnit?: WeightUnit
  weightBasis?: 'per_dumbbell' | 'total' | 'not_applicable'
  sets?: number
  reps?: number
  durationSeconds?: number
}

export interface WorkoutTemplate {
  id: string
  name: string
  sourceVideoUrl?: string
  notes?: string
  isPlaceholderData?: boolean
  createdAt: string
  updatedAt: string
  exercises: WorkoutTemplateExercise[]
}

export interface WorkoutSessionExercise {
  id: string
  sessionId: string
  exerciseDefinitionId: string
  templateExerciseId?: string
  exerciseNameSnapshot: string
  muscleContributionsSnapshot: MuscleContribution[]
  resistanceTypeSnapshot: ResistanceType
  weight?: number
  weightUnit?: WeightUnit
  weightBasis?: 'per_dumbbell' | 'total' | 'not_applicable'
  sets?: number
  reps?: number
  durationSeconds?: number
  completion: number
  stimulus: Partial<Record<MuscleRegion, number>>
}

export interface WorkoutSession {
  id: string
  workoutTemplateId?: string
  workoutNameSnapshot: string
  completedAt: string
  overallCompletion: number
  exercises: WorkoutSessionExercise[]
}

export interface UserPreferences {
  id: 'preferences'
  weightUnit: WeightUnit
  quickWeights: number[]
}

export interface CompletionInput {
  templateExercise: WorkoutTemplateExercise
  definition: ExerciseDefinition
  weight?: number
  completion: number
}
