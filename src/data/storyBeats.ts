import callToAdventure from '../assets/story_beats/call-to-adventure_ink.jpg'
import descendIntoAbyss from '../assets/story_beats/descend-into-abyss_ink.png'
import facingTheDragon from '../assets/story_beats/facing-the-dragon_ink.png'
import maiden from '../assets/story_beats/maiden.png'
import strangeOmen from '../assets/story_beats/strange-omen_ink.jpg'
import treasure from '../assets/story_beats/treasure2_ink.png'
import wizard from '../assets/story_beats/wizard.png'
import type { BeatId, StoryBeatCategory } from './storyCatalog'

export type { StoryBeatCategory }

export type StoryBeat = {
  id: BeatId
  title: string
  src: string
  category: StoryBeatCategory
}

export const storyBeats: StoryBeat[] = [
  // --- Protagonist ---
  { id: 'protagonist-world',   title: 'World',   src: maiden, category: 'Protagonist' },
  { id: 'protagonist-role',    title: 'Role',    src: maiden, category: 'Protagonist' },
  { id: 'protagonist-wound',   title: 'Wound',   src: maiden, category: 'Protagonist' },
  { id: 'protagonist-belief',  title: 'Belief',  src: maiden, category: 'Protagonist' },

  // --- Shift ---
  { id: 'shift-broke',       title: 'Broke',       src: strangeOmen, category: 'Shift' },
  { id: 'shift-accumulated', title: 'Accumulated', src: strangeOmen, category: 'Shift' },
  { id: 'shift-revealed',    title: 'Revealed',    src: strangeOmen, category: 'Shift' },
  { id: 'shift-drifted',     title: 'Drifted',     src: strangeOmen, category: 'Shift' },

  // --- Quest ---
  { id: 'quest-escape',     title: 'Escape',     src: descendIntoAbyss, category: 'Quest' },
  { id: 'quest-becoming',   title: 'Becoming',   src: descendIntoAbyss, category: 'Quest' },
  { id: 'quest-justice',    title: 'Justice',    src: descendIntoAbyss, category: 'Quest' },
  { id: 'quest-belonging',  title: 'Belonging',  src: descendIntoAbyss, category: 'Quest' },

  // --- Allies ---
  { id: 'allies-reflects', title: 'Reflects', src: wizard, category: 'Allies' },
  { id: 'allies-expands',  title: 'Expands',  src: wizard, category: 'Allies' },
  { id: 'allies-holds',    title: 'Holds',    src: wizard, category: 'Allies' },

  // --- Challenge ---
  { id: 'challenge-external',     title: 'External',     src: facingTheDragon, category: 'Challenge' },
  { id: 'challenge-environment',  title: 'Environment',  src: facingTheDragon, category: 'Challenge' },
  { id: 'challenge-internal',     title: 'Internal',     src: facingTheDragon, category: 'Challenge' },
  { id: 'challenge-gravity',      title: 'Gravity',      src: facingTheDragon, category: 'Challenge' },

  // --- Transformation ---
  { id: 'transformation-rupture',     title: 'Rupture',     src: callToAdventure, category: 'Transformation' },
  { id: 'transformation-loss',        title: 'Loss',        src: callToAdventure, category: 'Transformation' },
  { id: 'transformation-integration', title: 'Integration', src: callToAdventure, category: 'Transformation' },
  { id: 'transformation-contact',     title: 'Contact',     src: callToAdventure, category: 'Transformation' },

  // --- Legacy ---
  { id: 'legacy-healing',    title: 'Healing',    src: treasure, category: 'Legacy' },
  { id: 'legacy-witnessing', title: 'Witnessing', src: treasure, category: 'Legacy' },
  { id: 'legacy-creating',   title: 'Creating',   src: treasure, category: 'Legacy' },
  { id: 'legacy-resisting',  title: 'Resisting',  src: treasure, category: 'Legacy' },
]

export const storyBeatMap = new Map(
  storyBeats.map((beat) => [beat.id, beat]),
)
