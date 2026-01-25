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
] as const

export type TitleOption = (typeof titleOptions)[number]

export const virtueGlyphs: Record<TitleOption, string> = {
  Courage: sunGlyph,
  Growth: sproutGlyph,
  Awakening: moonGlyph,
  Rebirth: birdGlyph,
  Trials: sunGlyph,
}

export const beatIds = [
  'ordinary-world',
  'maiden',
  'call-to-adventure',
  'strange-omen',
  'refusal-of-the-call',
  'meeting-the-mentor',
  'wizard',
  'crossing-the-threshold',
  'tests-allies-enemies',
  'descend-into-abyss',
  'approach-to-the-inmost-cave',
  'ordeal',
  'facing-the-dragon',
  'reward',
  'treasure',
  'the-road-back',
  'resurrection',
  'return-with-the-elixir',
  'departure-unknown',
  'initiation-unknown',
  'return-unknown',
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
