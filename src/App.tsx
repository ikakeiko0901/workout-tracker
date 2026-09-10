import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { MuscleMap } from './components/MuscleMap'
import { WorkoutReview } from './components/WorkoutReview'
import { IndexedDbWorkoutRepository } from './data/workoutRepository'
import type { CompletionInput, ExerciseDefinition, UserPreferences, WorkoutSession, WorkoutTemplate } from './domain/models'
import { aggregateStimulus } from './domain/stimulus'

const repository = new IndexedDbWorkoutRepository()

export function App() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [definitions, setDefinitions] = useState<ExerciseDefinition[]>([])
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>({ id: 'preferences', weightUnit: 'lb', quickWeights: [2, 3, 5, 8, 10] })
  const [review, setReview] = useState<WorkoutTemplate>()
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [nextTemplates, nextDefinitions, nextSessions, nextPreferences] = await Promise.all([
      repository.listTemplates(), repository.listExercises(), repository.listSessions(), repository.getPreferences(),
    ])
    setTemplates(nextTemplates); setDefinitions(nextDefinitions); setSessions(nextSessions); setPreferences(nextPreferences)
  }, [])

  useEffect(() => { repository.initialize().then(refresh).finally(() => setLoading(false)) }, [refresh])

  const complete = async (inputs: CompletionInput[]) => {
    if (!review) return
    await repository.completeWorkout(review, inputs)
    setReview(undefined)
    await refresh()
  }

  if (loading) return <main className="loading"><span className="brand-mark">M</span><p>Preparing your map…</p></main>

  return <div className="app-shell">
    <Routes>
      <Route path="/" element={<Today templates={templates} definitions={definitions} sessions={sessions} onStart={setReview} />} />
      <Route path="/workouts" element={<Workouts templates={templates} definitions={definitions} onStart={setReview} onSave={async (template) => { await repository.saveTemplate(template); await refresh() }} />} />
      <Route path="/history" element={<History sessions={sessions} />} />
      <Route path="/settings" element={<Settings preferences={preferences} />} />
    </Routes>
    <nav className="bottom-nav" aria-label="Primary navigation">
      <NavLink to="/" end><span>⌂</span>Today</NavLink>
      <NavLink to="/workouts"><span>◇</span>Workouts</NavLink>
      <NavLink to="/history"><span>↗</span>History</NavLink>
      <NavLink to="/settings"><span>⚙</span>Settings</NavLink>
    </nav>
    {review && <WorkoutReview template={review} definitions={definitions} quickWeights={preferences.quickWeights} onCancel={() => setReview(undefined)} onComplete={complete} />}
  </div>
}

function Header({ title, subtitle }: { title: string, subtitle?: string }) {
  return <header className="topbar"><div><span className="brand-mark">M</span><div><p className="eyebrow">MuscleMap</p><h1>{title}</h1></div></div>{subtitle && <p>{subtitle}</p>}</header>
}

function Today({ templates, definitions, sessions, onStart }: { templates: WorkoutTemplate[], definitions: ExerciseDefinition[], sessions: WorkoutSession[], onStart(template: WorkoutTemplate): void }) {
  const [period, setPeriod] = useState<'today' | 'week'>('today')
  const now = new Date()
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startWeek = new Date(startToday); startWeek.setDate(startToday.getDate() - ((startToday.getDay() + 6) % 7))
  const relevant = sessions.filter((session) => new Date(session.completedAt) >= (period === 'today' ? startToday : startWeek))
  const scores = aggregateStimulus(relevant.flatMap((session) => session.exercises))
  const total = Object.values(scores).reduce((sum, score) => sum + (score ?? 0), 0)
  const top = Object.entries(scores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0]

  return <main>
    <Header title="Good evening" subtitle={now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} />
    <section className="hero-card">
      <div className="section-heading"><div><p className="eyebrow">Training stimulus</p><h2>Your muscle map</h2></div><div className="period-toggle"><button className={period === 'today' ? 'selected' : ''} onClick={() => setPeriod('today')}>Today</button><button className={period === 'week' ? 'selected' : ''} onClick={() => setPeriod('week')}>Week</button></div></div>
      <MuscleMap scores={scores} />
      <div className="insight"><span>✦</span><p>{top ? `Your ${top} received the most training stimulus ${period === 'today' ? 'today' : 'this week'}.` : `No training logged ${period === 'today' ? 'today' : 'this week'} yet.`}</p><strong>{total.toFixed(1)}</strong></div>
    </section>
    <section className="content-section">
      <div className="section-heading"><div><p className="eyebrow">Quick start</p><h2>My workouts</h2></div><NavLink to="/workouts">See all</NavLink></div>
      <div className="workout-cards">{templates.map((template) => <WorkoutCard key={template.id} template={template} definitions={definitions} onStart={() => onStart(template)} />)}</div>
    </section>
    <section className="content-section"><div className="section-heading"><div><p className="eyebrow">Logged</p><h2>Today</h2></div><strong>{relevant.length} session{relevant.length === 1 ? '' : 's'}</strong></div>{relevant.length === 0 ? <p className="empty-card">Your completed workouts will appear here.</p> : relevant.slice(0, 3).map((session) => <SessionRow key={session.id} session={session} />)}</section>
  </main>
}

function WorkoutCard({ template, definitions, onStart }: { template: WorkoutTemplate, definitions: ExerciseDefinition[], onStart(): void }) {
  const muscles = [...new Set(template.exercises.flatMap((item) => definitions.find((definition) => definition.id === item.exerciseDefinitionId)?.muscleContributions.map((part) => part.muscle) ?? []))]
  return <article className="workout-card"><div className="workout-art"><span>MM</span></div><div className="workout-info">{template.isPlaceholderData && <span className="tag">Example data</span>}<h3>{template.name}</h3><p>{template.exercises.length} exercises · about 20 min</p><div className="muscle-tags">{muscles.slice(0, 3).map((muscle) => <span key={muscle}>{muscle}</span>)}</div></div><button className="start-button" onClick={onStart} aria-label={`Start ${template.name}`}>▶</button></article>
}

function Workouts({ templates, definitions, onStart, onSave }: { templates: WorkoutTemplate[], definitions: ExerciseDefinition[], onStart(template: WorkoutTemplate): void, onSave(template: WorkoutTemplate): Promise<void> }) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState<WorkoutTemplate | 'new'>()
  return <main><Header title="Workouts" subtitle={`${templates.length} saved`} /><section className="content-section page-intro"><h2>Built for repeat days.</h2><p>Choose a set, check your weights, and you’re moving.</p><button className="primary-button" onClick={() => setEditing('new')}>＋ Create workout</button></section><section className="content-section"><div className="workout-cards">{templates.map((template) => <div key={template.id}><WorkoutCard template={template} definitions={definitions} onStart={() => onStart(template)} /><button className="text-button" onClick={() => setEditing(template)}>Edit workout</button></div>)}</div></section>{editing && <TemplateEditor template={editing === 'new' ? undefined : editing} definitions={definitions} onCancel={() => setEditing(undefined)} onSave={async (value) => { await onSave(value); setEditing(undefined); navigate('/workouts') }} />}</main>
}

function TemplateEditor({ template, definitions, onCancel, onSave }: { template?: WorkoutTemplate, definitions: ExerciseDefinition[], onCancel(): void, onSave(template: WorkoutTemplate): Promise<void> }) {
  const [name, setName] = useState(template?.name ?? '')
  const [selected, setSelected] = useState(() => new Set(template?.exercises.map((item) => item.exerciseDefinitionId) ?? []))
  const submit = async () => {
    const timestamp = new Date().toISOString()
    await onSave({ id: template?.id ?? crypto.randomUUID(), name: name.trim(), createdAt: template?.createdAt ?? timestamp, updatedAt: timestamp, sourceVideoUrl: template?.sourceVideoUrl, exercises: definitions.filter((item) => selected.has(item.id)).map((definition, order) => template?.exercises.find((item) => item.exerciseDefinitionId === definition.id) ?? { id: crypto.randomUUID(), exerciseDefinitionId: definition.id, order, defaultWeight: 5, weightUnit: 'lb', weightBasis: definition.resistanceType === 'dumbbell' ? 'per_dumbbell' : 'not_applicable', sets: definition.defaultSets, reps: definition.defaultReps }) })
  }
  return <div className="sheet-backdrop"><section className="sheet editor" role="dialog" aria-modal="true" aria-labelledby="editor-title"><div className="sheet-heading"><h2 id="editor-title">{template ? 'Edit workout' : 'Create workout'}</h2><button className="icon-button" onClick={onCancel}>×</button></div><label className="field">Workout name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Morning strength" /></label><fieldset className="exercise-options"><legend>Exercises</legend>{definitions.map((definition) => <label key={definition.id}><input type="checkbox" checked={selected.has(definition.id)} onChange={() => { const next = new Set(selected); if (next.has(definition.id)) next.delete(definition.id); else next.add(definition.id); setSelected(next) }} /><span><strong>{definition.name}</strong><small>{definition.muscleContributions[0].muscle}</small></span></label>)}</fieldset><button className="primary-button complete-button" disabled={!name.trim() || selected.size === 0} onClick={submit}>Save workout</button></section></div>
}

function History({ sessions }: { sessions: WorkoutSession[] }) {
  const allScores = useMemo(() => aggregateStimulus(sessions.flatMap((session) => session.exercises)), [sessions])
  return <main><Header title="History" subtitle="Your work, preserved" /><section className="hero-card compact-map"><div className="section-heading"><div><p className="eyebrow">All time</p><h2>Training overview</h2></div><strong>{sessions.length} workouts</strong></div><MuscleMap scores={allScores} /></section><section className="content-section"><div className="section-heading"><h2>Recent sessions</h2></div>{sessions.length === 0 ? <p className="empty-card">Complete your first workout to begin your history.</p> : sessions.map((session) => <SessionRow key={session.id} session={session} detailed />)}</section></main>
}

function SessionRow({ session, detailed = false }: { session: WorkoutSession, detailed?: boolean }) {
  return <article className="session-row"><div className="date-block"><strong>{new Date(session.completedAt).getDate()}</strong><span>{new Date(session.completedAt).toLocaleDateString(undefined, { month: 'short' })}</span></div><div><h3>{session.workoutNameSnapshot}</h3><p>{session.exercises.length} exercises · {Math.round(session.overallCompletion * 100)}% complete</p>{detailed && <ul>{session.exercises.map((exercise) => <li key={exercise.id}>{exercise.exerciseNameSnapshot}{exercise.weight !== undefined ? ` · ${exercise.weight} ${exercise.weightUnit}` : ''}</li>)}</ul>}</div><span className="done-mark">✓</span></article>
}

function Settings({ preferences }: { preferences: UserPreferences }) {
  return <main><Header title="Settings" subtitle="Make it yours" /><section className="content-section settings-card"><div><p className="eyebrow">Units</p><h2>Weight</h2><p>Pounds (lb)</p></div><div><p className="eyebrow">Quick weights</p><h2>Your buttons</h2><div className="weight-chips">{preferences.quickWeights.map((weight) => <span key={weight}>{weight} lb</span>)}</div><p className="muted">Editing preferences is planned for the next V1 increment.</p></div></section></main>
}
