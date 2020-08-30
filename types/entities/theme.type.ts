import type { Image } from "./image.type";

export interface Theme {
  id: number | string;
  order: number;
  isPublished: boolean;
  names: { [key: string]: string };
  image: Image | null;
}
