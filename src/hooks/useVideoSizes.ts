import { useWindowDimensions } from "./useWindowDimensions";

const getSizes = (width: number): { tilesCount: number; tileWidth: number; sideSize: number } => {
  if (width >= 1500) {
    return { tilesCount: 6, tileWidth: (3 / 20) * 100, sideSize: (1 / 20) * 100 };
  } else if (width >= 960) {
    return { tilesCount: 4, tileWidth: (3 / 14) * 100, sideSize: (1 / 14) * 100 };
  } else if (width >= 650) {
    return { tilesCount: 3, tileWidth: (6 / 20) * 100, sideSize: (1 / 20) * 100 };
  }
  return { tilesCount: 2, tileWidth: (6 / 14) * 100, sideSize: (1 / 14) * 100 };
};

export const useVideoSizes = (): { width: number; tilesCount: number; tileWidth: number; sideSize: number } => {
  const { width } = useWindowDimensions();
  return { ...getSizes(width), width };
};
