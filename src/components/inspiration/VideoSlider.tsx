import React from "react";

import Typography from "@material-ui/core/Typography";

import { VideoCard } from "src/components/inspiration/VideoCard";
import type { Video } from "types/models/video.type";

interface VideoCarouselProps {
  themeName: string;
  videos: Video[];
  width: number;
  setSelectedVideo(video: Video): void;
}

const getSizes = (width: number): { tilesCount: number; tileWidth: number } => {
  if (width >= 1500) {
    return { tilesCount: 6, tileWidth: (3 / 20) * 100 };
  } else if (width >= 960) {
    return { tilesCount: 4, tileWidth: (3 / 14) * 100 };
  } else if (width >= 650) {
    return { tilesCount: 2, tileWidth: (6 / 14) * 100 };
  }
  return { tilesCount: 1, tileWidth: (6 / 8) * 100 };
};

export const VideoSlider: React.FC<VideoCarouselProps> = ({ themeName, videos, width, setSelectedVideo }: VideoCarouselProps) => {
  const { tileWidth } = getSizes(width);

  const onSelectVideo = (index: number) => () => {
    setSelectedVideo(videos[index]);
  };

  return (
    <>
      <Typography variant="h2" className="video-carousel__title">
        {themeName}
      </Typography>
      <div className="video-carousel__mask" style={{ overflow: "auto", marginTop: "1rem" }}>
        <div className="video-carousel__container">
          {videos.map((video: Video, index: number) => {
            return <VideoCard key={index} width={tileWidth} video={video} onClick={onSelectVideo(index)} />;
          })}
        </div>
      </div>
    </>
  );
};
