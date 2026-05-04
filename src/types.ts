export interface CardData {
  id: number;
  cardSeriesId: number;
  name: string;
  description: string; // character name
  charactersId: number;
  rarity: number;
  orderId: number;
  specialAppealSeriesId: number;
  skillSeriesId: number;
  attributeId: number;
  subCards: number[];
}

export interface SkillSeries {
  id: number;
  name: string;
  skillIcon: number;
  skillMainEffect: number;
  isExSpecialAppeal: number;
}

export interface SkillLevel {
  level: number;
  cost: number;
  description: string;
}

export interface DB {
  cards: CardData[];
  skillSeries: Record<string, SkillSeries>;
  skills: Record<string, SkillLevel[]>;
}
