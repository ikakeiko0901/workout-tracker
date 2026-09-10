import Dexie, { type EntityTable } from 'dexie'
import type {
  CompletionInput,
  ExerciseDefinition,
  UserPreferences,
  WorkoutSession,
  WorkoutSessionExercise,
  WorkoutTemplate,
} from '../domain/models'
import { calculateExerciseStimulus } from '../domain/stimulus'
import { defaultPreferences, seedExercises, seedTemplate } from '../domain/seed'

class MuscleMapDatabase extends Dexie {
  exercises!: EntityTable<ExerciseDefinition, 'id'>
  templates!: EntityTable<WorkoutTemplate, 'id'>
  sessions!: EntityTable<WorkoutSession, 'id'>
  preferences!: EntityTable<UserPreferences, 'id'>

  constructor(name: string) {
    super(name)
    this.version(1).stores({
      exercises: 'id, name, resistanceType',
      templates: 'id, updatedAt',
      sessions: 'id, completedAt, workoutTemplateId',
      preferences: 'id',
    })
  }
}

export interface WorkoutRepository {
  initialize(): Promise<void>
  listExercises(): Promise<ExerciseDefinition[]>
  listTemplates(): Promise<WorkoutTemplate[]>
  listSessions(): Promise<WorkoutSession[]>
  getPreferences(): Promise<UserPreferences>
  saveTemplate(template: WorkoutTemplate): Promise<void>
  completeWorkout(template: WorkoutTemplate, inputs: CompletionInput[], completedAt?: Date): Promise<WorkoutSession>
}

export class IndexedDbWorkoutRepository implements WorkoutRepository {
  private readonly db: MuscleMapDatabase

  constructor(databaseName = 'musclemap-v1') {
    this.db = new MuscleMapDatabase(databaseName)
  }

  async initialize(): Promise<void> {
    await this.db.transaction('rw', this.db.exercises, this.db.templates, this.db.preferences, async () => {
      if ((await this.db.exercises.count()) === 0) await this.db.exercises.bulkAdd(seedExercises)
      if ((await this.db.templates.count()) === 0) await this.db.templates.add(seedTemplate)
      if (!(await this.db.preferences.get('preferences'))) await this.db.preferences.add(defaultPreferences)
    })
  }

  listExercises(): Promise<ExerciseDefinition[]> {
    return this.db.exercises.orderBy('name').toArray()
  }

  listTemplates(): Promise<WorkoutTemplate[]> {
    return this.db.templates.orderBy('updatedAt').reverse().toArray()
  }

  listSessions(): Promise<WorkoutSession[]> {
    return this.db.sessions.orderBy('completedAt').reverse().toArray()
  }

  async getPreferences(): Promise<UserPreferences> {
    return (await this.db.preferences.get('preferences')) ?? defaultPreferences
  }

  saveTemplate(template: WorkoutTemplate): Promise<void> {
    return this.db.templates.put(structuredClone(template)).then(() => undefined)
  }

  async completeWorkout(template: WorkoutTemplate, inputs: CompletionInput[], completedAt = new Date()): Promise<WorkoutSession> {
    const sessionId = crypto.randomUUID()
    const exercises: WorkoutSessionExercise[] = inputs
      .filter((input) => input.completion > 0)
      .map((input) => {
        const sessionExercise: WorkoutSessionExercise = {
          id: crypto.randomUUID(),
          sessionId,
          exerciseDefinitionId: input.definition.id,
          templateExerciseId: input.templateExercise.id,
          exerciseNameSnapshot: input.definition.name,
          muscleContributionsSnapshot: structuredClone(input.definition.muscleContributions),
          resistanceTypeSnapshot: input.definition.resistanceType,
          weight: input.weight,
          weightUnit: input.templateExercise.weightUnit,
          weightBasis: input.templateExercise.weightBasis,
          sets: input.templateExercise.sets,
          reps: input.templateExercise.reps,
          durationSeconds: input.templateExercise.durationSeconds,
          completion: input.completion,
          stimulus: {},
        }
        sessionExercise.stimulus = calculateExerciseStimulus(sessionExercise)
        return sessionExercise
      })
    const session: WorkoutSession = {
      id: sessionId,
      workoutTemplateId: template.id,
      workoutNameSnapshot: template.name,
      completedAt: completedAt.toISOString(),
      overallCompletion: inputs.length ? inputs.reduce((sum, item) => sum + item.completion, 0) / inputs.length : 0,
      exercises,
    }
    const updatedTemplate: WorkoutTemplate = {
      ...template,
      updatedAt: completedAt.toISOString(),
      exercises: template.exercises.map((exercise) => {
        const performed = inputs.find((item) => item.templateExercise.id === exercise.id)
        return performed?.weight === undefined ? exercise : { ...exercise, defaultWeight: performed.weight }
      }),
    }
    await this.db.transaction('rw', this.db.sessions, this.db.templates, async () => {
      await this.db.sessions.add(structuredClone(session))
      await this.db.templates.put(structuredClone(updatedTemplate))
    })
    return session
  }

  async deleteDatabase(): Promise<void> {
    this.db.close()
    await Dexie.delete(this.db.name)
  }
}
