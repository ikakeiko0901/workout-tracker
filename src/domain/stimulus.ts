import type { MuscleRegion, WorkoutSessionExercise } from './models'

export type StimulusScores = Partial<Record<MuscleRegion, number>>

type StimulusInput = Pick<
  WorkoutSessionExercise,
  'muscleContributionsSnapshot' | 'weight' | 'sets' | 'reps' | 'durationSeconds' | 'completion'
>

export function calculateExerciseStimulus(input: StimulusInput): StimulusScores {
  const volume = input.durationSeconds
    ? Math.max(input.durationSeconds / 60, 1)
    : Math.max((input.sets ?? 1) * (input.reps ?? 10) / 10, 1)
  const resistanceFactor = input.weight ? 1 + Math.min(input.weight / 20, 1.5) : 1
  const completion = Math.min(Math.max(input.completion, 0), 1)

  return input.muscleContributionsSnapshot.reduce<StimulusScores>((scores, contribution) => {
    scores[contribution.muscle] = round(contribution.weight * volume * resistanceFactor * completion)
    return scores
  }, {})
}

export function aggregateStimulus(exercises: Array<Pick<WorkoutSessionExercise, 'stimulus'>>): StimulusScores {
  const total: StimulusScores = {}
  for (const exercise of exercises) {
    for (const [muscle, score] of Object.entries(exercise.stimulus)) {
      const region = muscle as MuscleRegion
      total[region] = round((total[region] ?? 0) + (score ?? 0))
    }
  }
  return total
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}
