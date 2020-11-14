export interface Video {
  id: number;
  title: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number;
  themeId?: number;
  projectId?: number;
}
