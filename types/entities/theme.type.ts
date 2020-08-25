export interface Theme {
  id: number;
  order: number;
  isPublished: boolean;
  names: { [key: string]: string };
}
