import { describe, expect, it } from 'vitest'
import { aggregateStimulus, calculateExerciseStimulus } from './stimulus'

describe('training stimulus', () => {
  it('weights primary and secondary muscle contribution transparently', () => {
    const scores = calculateExerciseStimulus({
      muscleContributionsSnapshot: [
        { muscle: 'shoulders', weight: 1, role: 'primary' },
        { muscle: 'triceps', weight: 0.5, role: 'secondary' },
      ],
      sets: 3,
      reps: 10,
      weight: 10,
      completion: 1,
    })
    expect(scores.shoulders).toBe(4.5)
    expect(scores.triceps).toBe(2.25)
  })

  it('scales partial completion and aggregates exercises', () => {
    const partial = calculateExerciseStimulus({
      muscleContributionsSnapshot: [{ muscle: 'biceps', weight: 1, role: 'primary' }],
      sets: 2,
      reps: 10,
      completion: 0.5,
    })
    expect(aggregateStimulus([{ stimulus: partial }, { stimulus: { biceps: 2, chest: 1 } }])).toEqual({ biceps: 3, chest: 1 })
  })
})
