import callToAdventure from '../assets/story_beats/call-to-adventure.png'
import descendIntoAbyss from '../assets/story_beats/descend-into-abyss.png'
import facingTheDragon from '../assets/story_beats/facing-the-dragon.png'
import maiden from '../assets/story_beats/maiden.png'
import strangeOmen from '../assets/story_beats/strange-omen.png'
import treasure from '../assets/story_beats/treasure2.png'
import wizard from '../assets/story_beats/wizard.png'

export type StoryBeat = {
  id: string
  title: string
  src: string
}

export const storyBeats: StoryBeat[] = [
  { id: 'call-to-adventure', title: 'Call to adventure', src: callToAdventure },
  { id: 'strange-omen', title: 'Strange omen', src: strangeOmen },
  { id: 'wizard', title: 'Wizard', src: wizard },
  { id: 'maiden', title: 'Maiden', src: maiden },
  {
    id: 'descend-into-abyss',
    title: 'Descend into abyss',
    src: descendIntoAbyss,
  },
  { id: 'facing-the-dragon', title: 'Facing the dragon', src: facingTheDragon },
  { id: 'treasure', title: 'Treasure', src: treasure },
]

export const storyBeatMap = new Map(
  storyBeats.map((beat) => [beat.id, beat]),
)
