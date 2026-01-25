import callToAdventure from '../assets/story_beats/call-to-adventure_ink.jpg'
import descendIntoAbyss from '../assets/story_beats/descend-into-abyss_ink.png'
import facingTheDragon from '../assets/story_beats/facing-the-dragon_ink.png'
import maiden from '../assets/story_beats/maiden.png'
import strangeOmen from '../assets/story_beats/strange-omen_ink.jpg'
import treasure from '../assets/story_beats/treasure2_ink.png'
import wizard from '../assets/story_beats/wizard.png'
import type { BeatId } from './storyCatalog'

export type StoryBeatCategory =
  | 'Departure'
  | 'Initiation'
  | 'Return'

export type StoryBeat = {
  id: BeatId
  title: string
  src: string
  category: StoryBeatCategory
}

export const storyBeats: StoryBeat[] = [
  {
    id: 'ordinary-world',
    title: 'Ordinary world',
    src: maiden,
    category: 'Departure',
  },
  { id: 'maiden', title: 'Maiden', src: maiden, category: 'Departure' },
  {
    id: 'call-to-adventure',
    title: 'Call to adventure',
    src: callToAdventure,
    category: 'Departure',
  },
  {
    id: 'strange-omen',
    title: 'Strange omen',
    src: strangeOmen,
    category: 'Departure',
  },
  {
    id: 'refusal-of-the-call',
    title: 'Refusal of the call',
    src: strangeOmen,
    category: 'Departure',
  },
  {
    id: 'meeting-the-mentor',
    title: 'Meeting the mentor',
    src: wizard,
    category: 'Departure',
  },
  { id: 'wizard', title: 'Wizard', src: wizard, category: 'Departure' },
  {
    id: 'crossing-the-threshold',
    title: 'Crossing the threshold',
    src: descendIntoAbyss,
    category: 'Departure',
  },
  {
    id: 'tests-allies-enemies',
    title: 'Tests, allies, enemies',
    src: strangeOmen,
    category: 'Initiation',
  },
  {
    id: 'descend-into-abyss',
    title: 'Descend into abyss',
    src: descendIntoAbyss,
    category: 'Initiation',
  },
  {
    id: 'approach-to-the-inmost-cave',
    title: 'Approach to the inmost cave',
    src: descendIntoAbyss,
    category: 'Initiation',
  },
  {
    id: 'ordeal',
    title: 'Ordeal',
    src: facingTheDragon,
    category: 'Initiation',
  },
  {
    id: 'facing-the-dragon',
    title: 'Facing the dragon',
    src: facingTheDragon,
    category: 'Initiation',
  },
  {
    id: 'reward',
    title: 'Reward',
    src: treasure,
    category: 'Initiation',
  },
  { id: 'treasure', title: 'Treasure', src: treasure, category: 'Initiation' },
  {
    id: 'the-road-back',
    title: 'The road back',
    src: treasure,
    category: 'Return',
  },
  {
    id: 'resurrection',
    title: 'Resurrection',
    src: facingTheDragon,
    category: 'Return',
  },
  {
    id: 'return-with-the-elixir',
    title: 'Return with the elixir',
    src: treasure,
    category: 'Return',
  },
  {
    id: 'departure-unknown',
    title: 'The story begins...',
    src: strangeOmen,
    category: 'Departure',
  },
  {
    id: 'initiation-unknown',
    title: 'The journey continues...',
    src: descendIntoAbyss,
    category: 'Initiation',
  },
  {
    id: 'return-unknown',
    title: 'The story unfolds...',
    src: treasure,
    category: 'Return',
  },
]

export const storyBeatMap = new Map(
  storyBeats.map((beat) => [beat.id, beat]),
)
