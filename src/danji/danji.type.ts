import { StockPayload } from '../stock';

export enum Mood {
  HAPPY = 'HAPPY',
  NORMAL = 'NORMAL',
  SAD = 'SAD',
}

export enum DanjiColor {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
}

export interface DanjiPayload {
  id: string;
  userId: string;
  color: DanjiColor;
  name: string;
  volume: string;
  stock: StockPayload;
  createDate: number;
  endDate: number;
  dDay: number;
  mood: Mood;
  index: number;
}

export interface DanjiContentPayload {
  color: DanjiColor;
  name: string;
  stockName: string;
  volume: string;
  mood: Mood;
  endDate: number;
  dDay: number;
}

export interface DanjiCreateResponse {
  index: number;
  danjiId: string;
}
