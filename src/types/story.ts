export type BeatCategory = 'departure' | 'descent' | 'return';
export type StoryCoverCategory = 'ego' | 'soul' | 'self';

export interface BeatTemplate {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: BeatCategory;
}

export interface StoryCoverTemplate {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: StoryCoverCategory;
}

export interface StoryBeat {
  id: string;
  templateId?: string;
  title: string;
  imageUrl: string;
  category?: BeatCategory;
  notes: string;
}

export interface Story {
  id: string;
  title: string;
  imageUrl: string;
  coverTemplateId?: string;
  coverCategory?: StoryCoverCategory;
  notes: string;
  createdAt: string;
  beats: StoryBeat[];
  isDraft?: boolean;
}
