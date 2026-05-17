/**
 * All user-facing copy lives here — edit this file to change anything the user
 * reads during the story flow: greetings, prompts, and every card option.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DimensionId =
  | 'challenge'
  | 'protagonist'
  | 'shift'
  | 'quest'
  | 'allies'
  | 'transformation'
  | 'legacy'

export type DimensionOption = {
  id: string
  title: string
  description: string
  axes: string
  followUpQuestion: string
}

export type DimensionConfig = {
  id: DimensionId
  label: string
  subtitle: string
  followUpFocus: string
  transitionQuestion?: string
  options: DimensionOption[]
}

// ─── Conversational prompts ───────────────────────────────────────────────────

export const OPENING_GREETING =
  "Let's write the story within. What should I call you?"

export const PRONOUNS_QUESTION = 'And what pronouns should I use when telling your story?'

export const CHALLENGE_INTRO =
  'The best stories are shaped by a challenge. What form did this one take?'

export const elaborationPrompt = (name: string) =>
  `${name}, if there's anything else you'd like to share about this journey, type it below. The details will help bring the final story to life.`

// ─── Dimension order ──────────────────────────────────────────────────────────

export const DIMENSION_ORDER: DimensionId[] = [
  'challenge',
  'protagonist',
  'shift',
  'quest',
  'allies',
  'transformation',
  'legacy',
]

// ─── Dimension config & card options ─────────────────────────────────────────

export const DIMENSIONS: Record<DimensionId, DimensionConfig> = {
  challenge: {
    id: 'challenge',
    label: 'Challenge',
    subtitle: 'what opposed you',
    followUpFocus: 'Draw out the specifics of the obstacle itself — its shape, source, and intensity.',
    options: [
      {
        id: 'challenge-external',
        title: 'Dragon',
        description: 'a challenge I had to face head-on',
        axes: 'Source: Outside + Mode: Active',
        followUpQuestion: 'What or who was actively in your way?',
      },
      {
        id: 'challenge-environment',
        title: 'Dark Forest',
        description: 'conditions that were the wrong fit for me',
        axes: 'Source: Outside + Mode: Ambient',
        followUpQuestion: 'What about your environment made it so hard to move or be yourself?',
      },
      {
        id: 'challenge-internal',
        title: 'Shadow',
        description: "something inside me that wouldn't settle",
        axes: 'Source: Inside + Mode: Active',
        followUpQuestion: 'How did you get in your own way?',
      },
      {
        id: 'challenge-gravity',
        title: "Siren's Call",
        description: 'a pull I kept feeling toward something',
        axes: 'Source: Inside + Mode: Ambient',
        followUpQuestion: 'What kept pulling you back toward the life you were leaving?',
      },
    ],
  },

  protagonist: {
    id: 'protagonist',
    label: 'Protagonist',
    subtitle: 'who you were when it started',
    transitionQuestion: 'Before this challenge, I walked as...',
    followUpFocus: 'Draw out who they were before the story began — their identity, assumptions, and default mode.',
    options: [
      {
        id: 'protagonist-world',
        title: 'An Acolyte',
        description: 'shaped by an institution or culture I belonged to',
        axes: 'Origin: Outside + How it operated: Condition',
        followUpQuestion: 'What was the world that shaped you, and what did it teach you to want?',
      },
      {
        id: 'protagonist-role',
        title: 'A Knight',
        description: 'defined by a role I performed for others',
        axes: 'Origin: Outside + How it operated: Behavior',
        followUpQuestion: 'What role were you playing, and who needed you to play it?',
      },
      {
        id: 'protagonist-wound',
        title: 'An Exile',
        description: 'marked by a wound or unmet need I carried',
        axes: 'Origin: Inside + How it operated: Condition',
        followUpQuestion: 'What were you carrying before the story even started?',
      },
      {
        id: 'protagonist-belief',
        title: 'A Pilgrim',
        description: 'living inside a belief that shaped how I saw everything',
        axes: 'Origin: Inside + How it operated: Behavior',
        followUpQuestion: 'What did you believe that organized everything else around it?',
      },
    ],
  },

  shift: {
    id: 'shift',
    label: 'Shift',
    subtitle: 'what disrupted things',
    transitionQuestion: 'My journey began when something...',
    followUpFocus: 'Draw out the event, realization, or pressure that disrupted the ordinary world.',
    options: [
      {
        id: 'shift-broke',
        title: 'Broke',
        description: 'something collapsed, was lost, or betrayed me suddenly',
        axes: 'Source: Outside + Speed: Sudden',
        followUpQuestion: 'What broke, and how suddenly?',
      },
      {
        id: 'shift-accumulated',
        title: 'Accumulated',
        description: 'weight built slowly until I couldn\'t carry it anymore',
        axes: 'Source: Outside + Speed: Gradual',
        followUpQuestion: "What had been building for a long time before you finally couldn't ignore it?",
      },
      {
        id: 'shift-revealed',
        title: 'Revealed Itself',
        description: "I saw something I couldn't unsee",
        axes: 'Source: Inside + Speed: Sudden',
        followUpQuestion: "What did you see that you couldn't unsee?",
      },
      {
        id: 'shift-drifted',
        title: 'Drifted',
        description: 'I quietly grew away from something over time',
        axes: 'Source: Inside + Speed: Gradual',
        followUpQuestion: "When did you notice you'd been growing away from something — without a single moment of departure?",
      },
    ],
  },

  quest: {
    id: 'quest',
    label: 'Quest',
    subtitle: 'what you were actually after',
    transitionQuestion: 'More than anything, I was seeking...',
    followUpFocus: 'Draw out what they were moving toward or away from — the goal, desire, or need that drove the path.',
    options: [
      {
        id: 'quest-escape',
        title: 'Escape',
        description: 'to get free of a role, story, or version of myself',
        axes: 'Direction: Away + Object: Self',
        followUpQuestion: 'What were you trying to get away from?',
      },
      {
        id: 'quest-becoming',
        title: 'Becoming',
        description: 'to find out who I actually am',
        axes: 'Direction: Toward + Object: Self',
        followUpQuestion: 'Who were you trying to become?',
      },
      {
        id: 'quest-justice',
        title: 'Justice',
        description: 'to dismantle or change something for others',
        axes: 'Direction: Away + Object: Other',
        followUpQuestion: 'What were you trying to dismantle or make right?',
      },
      {
        id: 'quest-belonging',
        title: 'Belonging',
        description: 'to be truly known and find where I fit',
        axes: 'Direction: Toward + Object: Other',
        followUpQuestion: 'What kind of connection were you looking for?',
      },
    ],
  },

  allies: {
    id: 'allies',
    label: 'Allies',
    subtitle: 'who or what helped',
    transitionQuestion: 'My greatest ally showed up as...',
    followUpFocus: "Draw out who or what helped and how — the specific gift, presence, or insight they offered.",
    options: [
      {
        id: 'allies-reflects',
        title: 'An Oracle',
        description: 'someone who helped me see myself more clearly',
        axes: 'Function: Reflects',
        followUpQuestion: "Who showed you something about yourself or your situation you couldn't see alone?",
      },
      {
        id: 'allies-expands',
        title: 'A Pathfinder',
        description: 'someone who opened new ground and showed me what was possible',
        axes: 'Function: Expands',
        followUpQuestion: "What opened up a new way of being or doing that hadn't seemed possible before?",
      },
      {
        id: 'allies-holds',
        title: 'A Hearth',
        description: 'someone who held space for me with presence and warmth',
        axes: 'Function: Holds',
        followUpQuestion: 'Who stayed, without needing you to be anything in particular?',
      },
    ],
  },

  transformation: {
    id: 'transformation',
    label: 'Transformation',
    subtitle: 'how change actually happened',
    transitionQuestion: 'The change came through...',
    followUpFocus: 'Draw out the internal change — who they became and how the shift happened.',
    options: [
      {
        id: 'transformation-rupture',
        title: 'Letting Go',
        description: 'releasing what no longer served me',
        axes: 'What changed: Ended + Who drove it: Self',
        followUpQuestion: 'What had to end — by your own action — for this change to happen?',
      },
      {
        id: 'transformation-loss',
        title: 'Surrender',
        description: "accepting what I couldn't control",
        axes: 'What changed: Ended + Who drove it: Relationship',
        followUpQuestion: 'What ended outside your control, and how did that change you?',
      },
      {
        id: 'transformation-integration',
        title: 'Integration',
        description: 'split parts of myself finally coming together',
        axes: 'What changed: Began + Who drove it: Self',
        followUpQuestion: 'What two parts of yourself finally came together?',
      },
      {
        id: 'transformation-contact',
        title: 'Contact',
        description: 'being truly seen, loved, or held by another',
        axes: 'What changed: Began + Who drove it: Relationship',
        followUpQuestion: 'Who saw you clearly, and what did that make possible?',
      },
    ],
  },

  legacy: {
    id: 'legacy',
    label: 'Legacy',
    subtitle: 'what you carry forward',
    transitionQuestion: 'What I carry forward...',
    followUpFocus: 'Draw out what they carry forward and offer to others now.',
    options: [
      {
        id: 'legacy-healing',
        title: 'Healing',
        description: 'embodying the change from the inside out',
        axes: 'Direction: Inward + Mode: Generative',
        followUpQuestion: 'How are you living differently now because of what you went through?',
      },
      {
        id: 'legacy-witnessing',
        title: 'Witnessing',
        description: 'holding and naming my own story',
        axes: 'Direction: Inward + Mode: Corrective',
        followUpQuestion: 'How are you holding and naming what happened to you?',
      },
      {
        id: 'legacy-creating',
        title: 'Creating',
        description: 'building, teaching, or making something from what I went through',
        axes: 'Direction: Outward + Mode: Generative',
        followUpQuestion: 'What are you making out of what you went through?',
      },
      {
        id: 'legacy-resisting',
        title: 'Resisting',
        description: 'standing against what needs to change',
        axes: 'Direction: Outward + Mode: Corrective',
        followUpQuestion: 'What are you still standing against?',
      },
    ],
  },
}
