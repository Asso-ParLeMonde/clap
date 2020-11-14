import { useSnackbar } from "notistack";
import { isMobile, BrowserView, MobileView } from "react-device-detect";
import ReactPlayer from "react-player";
import React from "react";

import Typography from "@material-ui/core/Typography";

import { VideoCarousel } from "src/components/inspiration/VideoCarousel";
import { VideoSlider } from "src/components/inspiration/VideoSlider";
import { useVideoSizes } from "src/hooks/useVideoSizes";
import type { Video } from "types/models/video.type";

const videos: any = [
  {
    id: 0,
    title: "My first video!",
    videoUrl: "https://www.youtube.com/watch?v=d46Azg3Pm4c",
    thumbnailUrl: "https://i.vimeocdn.com/video/726047953_640.jpg",
    duration: 76,
  },
  {
    id: 1,
    title: "Video 2",
    videoUrl: "https://www.youtube.com/watch?v=tRFOjLIl7G0",
    thumbnailUrl: "",
    duration: 7600,
  },
  {
    id: 2,
    title: "Video 4",
    videoUrl: "https://vimeo.com/90509568",
    thumbnailUrl: null,
    duration: 6,
  },
  {
    id: 0,
    title: "My first video!",
    videoUrl: "https://vimeo.com/169599296",
    thumbnailUrl: "https://i.vimeocdn.com/video/726047953_640.jpg",
    duration: 76,
  },
  {
    id: 1,
    title: "My first video!",
    videoUrl: "hoho",
    thumbnailUrl: "",
    duration: 76,
  },
];

interface InspirationProps {
  selectedVideo: Video;
  setSelectedVideo(video: Video): void;
}

export const InspirationNoSSR: React.FC<InspirationProps> = ({ selectedVideo, setSelectedVideo }: InspirationProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { width, tilesCount, tileWidth, sideSize } = useVideoSizes();

  const onError = () => {
    setSelectedVideo(null);
    enqueueSnackbar("Une erreur de lecture est survenue...", {
      variant: "error",
    });
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {selectedVideo !== null && (
        <>
          <div className="player_wrapper_1" style={{ marginLeft: isMobile ? "0" : `${sideSize}%`, marginRight: isMobile ? "0" : `${sideSize}%` }}>
            <div className="player_wrapper_2">
              <div className="player_wrapper_3">
                <div className="player_container">
                  <ReactPlayer url={selectedVideo.videoUrl} width="100%" height="100%" controls={true} playing={true} onError={onError} />
                </div>
              </div>
            </div>
          </div>
          <Typography color="primary" variant="h2" style={{ marginLeft: isMobile ? "0" : `${sideSize}%`, marginRight: isMobile ? "0" : `${sideSize}%`, marginTop: "0.5rem", marginBottom: "2rem" }}>
            {selectedVideo.title}
          </Typography>
        </>
      )}
      <BrowserView>
        <VideoCarousel themeName="Ma classe" videos={videos} width={width} tilesCount={tilesCount} tileWidth={tileWidth} sideSize={sideSize} setSelectedVideo={setSelectedVideo} />
      </BrowserView>
      <MobileView>
        <VideoSlider themeName="Jeux vidéos" videos={videos} width={width} setSelectedVideo={setSelectedVideo} />
      </MobileView>
    </div>
  );
};
