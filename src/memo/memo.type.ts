import { Mood } from 'src/danji/danji.type';

export interface MemoPayload {
  id: string;
  danjiId: string;
  mood: Mood;
  image: string | null;
  text: string;
  date: number;
}

export interface MemoContent {
  mood: Mood;
  image: string | null;
  text: string;
  date: number;
}
