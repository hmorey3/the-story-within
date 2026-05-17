import birdGlyph from '../assets/glyphs/archive/bird.jpg'
import moonGlyph from '../assets/glyphs/archive/moon.jpg'
import sproutGlyph from '../assets/glyphs/archive/sprout.jpg'
import sunGlyph from '../assets/glyphs/archive/sun.jpg'

export const titleOptions = [
  'Courage',
  'Growth',
  'Awakening',
  'Rebirth',
  'Trials',
  'Becoming',
  'The Return',
  'Surrender',
  'Threshold',
  'Descent',
  'Reckoning',
  'Emergence',
  'Liberation',
  'Endurance',
  'Homecoming',
  'Resilience',
  'The Crossing',
  'Breaking Open',
  'Solitude',
  'Reclaiming',
] as const

export type TitleOption = (typeof titleOptions)[number]

export const virtueGlyphs: Record<TitleOption, string> = {
  Courage: sunGlyph,
  Growth: sproutGlyph,
  Awakening: moonGlyph,
  Rebirth: birdGlyph,
  Trials: sunGlyph,
  Becoming: sproutGlyph,
  'The Return': birdGlyph,
  Surrender: birdGlyph,
  Threshold: moonGlyph,
  Descent: moonGlyph,
  Reckoning: sunGlyph,
  Emergence: sproutGlyph,
  Liberation: moonGlyph,
  Endurance: sunGlyph,
  Homecoming: sproutGlyph,
  Resilience: birdGlyph,
  'The Crossing': moonGlyph,
  'Breaking Open': birdGlyph,
  Solitude: moonGlyph,
  Reclaiming: sproutGlyph,
}

export type StoryBeatCategory =
  | 'Protagonist'
  | 'Shift'
  | 'Quest'
  | 'Allies'
  | 'Challenge'
  | 'Transformation'
  | 'Legacy'

export const beatIds = [
  // Protagonist — identity before the story began
  'protagonist-world',
  'protagonist-role',
  'protagonist-wound',
  'protagonist-belief',
  // Shift — the disruption that changed the ordinary world
  'shift-broke',
  'shift-accumulated',
  'shift-revealed',
  'shift-drifted',
  // Quest — what they were actually after
  'quest-escape',
  'quest-becoming',
  'quest-justice',
  'quest-belonging',
  // Allies — who or what helped
  'allies-reflects',
  'allies-expands',
  'allies-holds',
  // Challenge — what opposed them
  'challenge-external',
  'challenge-environment',
  'challenge-internal',
  'challenge-gravity',
  // Transformation — how change happened
  'transformation-rupture',
  'transformation-loss',
  'transformation-integration',
  'transformation-contact',
  // Legacy — what they carry forward
  'legacy-healing',
  'legacy-witnessing',
  'legacy-creating',
  'legacy-resisting',
] as const

export type BeatId = (typeof beatIds)[number]

export const isBeatId = (value: string): value is BeatId =>
  beatIds.includes(value as BeatId)

export type DefaultBeatEntry = {
  id: BeatId
  note: string
}

export type DefaultBook = {
  id: string
  title: TitleOption
  beats: DefaultBeatEntry[]
}

export type DefaultsConfig = {
  books: DefaultBook[]
}
