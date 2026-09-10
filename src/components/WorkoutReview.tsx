import { useMemo, useState } from 'react'
import type { CompletionInput, ExerciseDefinition, WorkoutTemplate } from '../domain/models'

interface Props {
  template: WorkoutTemplate
  definitions: ExerciseDefinition[]
  quickWeights: number[]
  onCancel(): void
  onComplete(inputs: CompletionInput[]): Promise<void>
}

export function WorkoutReview({ template, definitions, quickWeights, onCancel, onComplete }: Props) {
  const initial = useMemo(() => Object.fromEntries(template.exercises.map((item) => [item.id, item.defaultWeight])), [template])
  const [weights, setWeights] = useState<Record<string, number | undefined>>(initial)
  const [custom, setCustom] = useState<Record<string, boolean>>({})
  const [completion, setCompletion] = useState(1)
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setSaving(true)
    const inputs = template.exercises.map((templateExercise) => ({
      templateExercise,
      definition: definitions.find((item) => item.id === templateExercise.exerciseDefinitionId)!,
      weight: weights[templateExercise.id],
      completion,
    })).filter((item) => item.definition)
    await onComplete(inputs)
  }

  return (
    <div className="sheet-backdrop" role="presentation">
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <div className="sheet-handle" />
        <div className="sheet-heading"><div><p className="eyebrow">Ready when you are</p><h2 id="review-title">Review workout</h2></div><button className="icon-button" onClick={onCancel} aria-label="Close">×</button></div>
        <p className="review-name">{template.name}</p>
        <fieldset className="completion-picker"><legend>How much are you doing?</legend>{[1, .75, .5].map((value) => <button key={value} className={completion === value ? 'selected' : ''} onClick={() => setCompletion(value)}>{value * 100}%</button>)}</fieldset>
        <div className="exercise-review-list">
          {template.exercises.map((item) => {
            const definition = definitions.find((candidate) => candidate.id === item.exerciseDefinitionId)
            if (!definition) return null
            const weighted = definition.resistanceType !== 'bodyweight'
            return <article className="exercise-review" key={item.id}>
              <div><h3>{definition.name}</h3><p>{item.sets} sets × {item.reps} reps</p></div>
              {weighted && <><div className="weight-chips" aria-label={`Weight for ${definition.name}`}>
                {quickWeights.map((weight) => <button key={weight} className={!custom[item.id] && weights[item.id] === weight ? 'selected' : ''} onClick={() => { setCustom({ ...custom, [item.id]: false }); setWeights({ ...weights, [item.id]: weight }) }}>{weight} lb</button>)}
                <button className={custom[item.id] ? 'selected' : ''} onClick={() => setCustom({ ...custom, [item.id]: true })}>Custom</button>
              </div>{custom[item.id] && <label className="custom-weight">Weight per dumbbell<input autoFocus type="number" min="0" step="0.5" value={weights[item.id] ?? ''} onChange={(event) => setWeights({ ...weights, [item.id]: Number(event.target.value) })} /> lb</label>}</>}
            </article>
          })}
        </div>
        <button className="primary-button complete-button" disabled={saving} onClick={submit}>{saving ? 'Saving…' : 'Complete workout'} <span>✓</span></button>
      </section>
    </div>
  )
}
