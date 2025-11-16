export type BeatCategory = 'departure' | 'descent' | 'return';

export interface BeatTemplate {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: BeatCategory;
}

export interface StoryBeat {
  id: string;
  templateId: string;
  title: string;
  imageUrl: string;
  category: BeatCategory;
  notes: string;
}

export interface Story {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  beats: StoryBeat[];
}
