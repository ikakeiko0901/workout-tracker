import { afterEach, describe, expect, it } from 'vitest'
import { IndexedDbWorkoutRepository } from './workoutRepository'

let repository: IndexedDbWorkoutRepository | undefined

afterEach(async () => repository?.deleteDatabase())

describe('IndexedDbWorkoutRepository', () => {
  it('seeds data and snapshots a completed workout without mutating history', async () => {
    repository = new IndexedDbWorkoutRepository(`test-${crypto.randomUUID()}`)
    await repository.initialize()
    const [template] = await repository.listTemplates()
    const definitions = await repository.listExercises()
    const first = template.exercises[0]
    const definition = definitions.find((item) => item.id === first.exerciseDefinitionId)!

    const session = await repository.completeWorkout(template, [{ templateExercise: first, definition, weight: 8, completion: 1 }])
    expect(session.exercises[0].weight).toBe(8)
    expect(session.exercises[0].exerciseNameSnapshot).toBe('Lateral Raise')

    definition.name = 'Renamed later'
    expect((await repository.listSessions())[0].exercises[0].exerciseNameSnapshot).toBe('Lateral Raise')
    expect((await repository.listTemplates())[0].exercises[0].defaultWeight).toBe(8)
  })
})
