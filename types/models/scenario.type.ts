import type { User } from "./user.type";

export interface Scenario {
  id: number | string; // could be local
  languageCode: string;
  name: string;
  isDefault: boolean;
  description: string;
  user: User | null;
  // questions: Question[];
  questionsCount: number;
  themeId?: string | number;
}
