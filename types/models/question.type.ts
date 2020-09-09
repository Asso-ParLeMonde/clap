export interface Question {
  id: number;
  question: string;
  isDefault: boolean;
  scenarioId: number | string;
  languageCode: string;
  index: number;
}
