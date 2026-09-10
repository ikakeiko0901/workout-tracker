import { muscleRegions, type MuscleRegion } from '../domain/models'
import type { StimulusScores } from '../domain/stimulus'

interface Props { scores: StimulusScores }

const labels: Record<MuscleRegion, string> = {
  chest: 'Chest', back: 'Back', shoulders: 'Shoulders', biceps: 'Biceps', triceps: 'Triceps',
  core: 'Core', glutes: 'Glutes', quadriceps: 'Quadriceps', hamstrings: 'Hamstrings', calves: 'Calves',
}

export function MuscleMap({ scores }: Props) {
  const max = Math.max(...Object.values(scores).map(Number), 1)
  const fill = (muscle: MuscleRegion) => `hsl(158 48% ${88 - ((scores[muscle] ?? 0) / max) * 57}%)`
  const regionProps = (muscle: MuscleRegion) => ({ fill: fill(muscle), 'data-muscle': muscle })

  return (
    <div className="muscle-visual">
      <svg viewBox="0 0 390 340" role="img" aria-labelledby="map-title map-description">
        <title id="map-title">Front and back muscle training stimulus</title>
        <desc id="map-description">Darker areas received more training stimulus in the selected period.</desc>
        <g transform="translate(28 8)">
          <text x="72" y="326" textAnchor="middle">Front</text>
          <circle cx="72" cy="28" r="21" className="body-base" />
          <path d="M48 53 Q72 43 96 53 L105 145 Q91 160 88 198 L56 198 Q53 160 39 145Z" className="body-base" />
          <path d="M40 59 L18 145 L35 151 L58 76Z" {...regionProps('biceps')} />
          <path d="M104 59 L126 145 L109 151 L86 76Z" {...regionProps('biceps')} />
          <path d="M46 55 Q55 44 67 52 L65 76 L44 76Z" {...regionProps('shoulders')} />
          <path d="M98 55 Q89 44 77 52 L79 76 L100 76Z" {...regionProps('shoulders')} />
          <path d="M51 74 Q72 62 93 74 L88 108 Q72 118 56 108Z" {...regionProps('chest')} />
          <path d="M57 110 L87 110 L89 150 L55 150Z" {...regionProps('core')} />
          <path d="M56 199 L71 199 L68 274 L45 274Z" {...regionProps('quadriceps')} />
          <path d="M73 199 L88 199 L99 274 L76 274Z" {...regionProps('quadriceps')} />
          <path d="M45 276 L68 276 L64 315 L48 315Z" {...regionProps('calves')} />
          <path d="M76 276 L99 276 L96 315 L80 315Z" {...regionProps('calves')} />
        </g>
        <g transform="translate(218 8)">
          <text x="72" y="326" textAnchor="middle">Back</text>
          <circle cx="72" cy="28" r="21" className="body-base" />
          <path d="M48 53 Q72 43 96 53 L105 145 Q91 160 88 198 L56 198 Q53 160 39 145Z" className="body-base" />
          <path d="M40 59 L18 145 L35 151 L58 76Z" {...regionProps('triceps')} />
          <path d="M104 59 L126 145 L109 151 L86 76Z" {...regionProps('triceps')} />
          <path d="M46 55 Q55 44 67 52 L65 76 L44 76Z" {...regionProps('shoulders')} />
          <path d="M98 55 Q89 44 77 52 L79 76 L100 76Z" {...regionProps('shoulders')} />
          <path d="M52 72 Q72 60 92 72 L90 145 Q72 155 54 145Z" {...regionProps('back')} />
          <path d="M55 151 Q72 142 89 151 L88 190 Q72 200 56 190Z" {...regionProps('glutes')} />
          <path d="M56 199 L71 199 L68 274 L45 274Z" {...regionProps('hamstrings')} />
          <path d="M73 199 L88 199 L99 274 L76 274Z" {...regionProps('hamstrings')} />
          <path d="M45 276 L68 276 L64 315 L48 315Z" {...regionProps('calves')} />
          <path d="M76 276 L99 276 L96 315 L80 315Z" {...regionProps('calves')} />
        </g>
      </svg>
      <ul className="stimulus-list" aria-label="Training stimulus by muscle">
        {muscleRegions.filter((muscle) => (scores[muscle] ?? 0) > 0).sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)).map((muscle) => (
          <li key={muscle}><span>{labels[muscle]}</span><strong>{scores[muscle]?.toFixed(1)}</strong><span className="bar"><i style={{ width: `${((scores[muscle] ?? 0) / max) * 100}%` }} /></span></li>
        ))}
      </ul>
      {Object.keys(scores).length === 0 && <p className="empty-note">Complete a workout to color your map.</p>}
    </div>
  )
}
