import { useSnackbar } from "notistack";
import { isMobile, BrowserView, MobileView } from "react-device-detect";
import ReactPlayer from "react-player";
import React from "react";

import Typography from "@material-ui/core/Typography";

import { VideoCarousel } from "src/components/inspiration/VideoCarousel";
import { VideoSlider } from "src/components/inspiration/VideoSlider";
import { useVideoSizes } from "src/hooks/useVideoSizes";
import { useThemes } from "src/services/useThemes";
import type { Theme } from "types/models/theme.type";
import type { Video } from "types/models/video.type";

interface InspirationProps {
  selectedVideo: Video;
  setSelectedVideo(video: Video): void;
}

type ThemeWithVideos = Theme & { videos: Video[] };

export const InspirationNoSSR: React.FC<InspirationProps> = ({ selectedVideo, setSelectedVideo }: InspirationProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { themes } = useThemes({ user: false, isDefault: true });
  const videos: Video[] = []; // TODO
  const { width, tilesCount, tileWidth, sideSize } = useVideoSizes();

  const onError = () => {
    setSelectedVideo(null);
    enqueueSnackbar("Une erreur de lecture est survenue...", {
      variant: "error",
    });
  };

  const videosPerTheme: ThemeWithVideos[] = React.useMemo(() => {
    const videosBuck: { [videoIndex: number]: boolean } = {};
    const themesWithVideos = themes.map((theme) => {
      const videosOfTheme = videos.filter((v) => v.themeId === theme.id);
      videosOfTheme.forEach((v) => {
        videosBuck[v.id] = true;
      });
      return { ...theme, videos: videosOfTheme };
    });
    const otherVideos = videos.filter((v) => !videosBuck[v.id]);
    themesWithVideos.push({
      id: -1,
      order: 0,
      isDefault: true,
      names: { fr: "Autre vidéos" },
      image: null,
      videos: otherVideos,
    });
    return themesWithVideos.filter((t) => t.videos.length > 0);
  }, [themes, videos]);

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
      {videosPerTheme.map((t) => (
        <>
          <BrowserView key={t.id}>
            <VideoCarousel themeName={t.names.fr} videos={t.videos} tilesCount={tilesCount} tileWidth={tileWidth} sideSize={sideSize} setSelectedVideo={setSelectedVideo} />
          </BrowserView>
          <MobileView key={`mobile_${t.id}`}>
            <VideoSlider themeName={t.names.fr} videos={t.videos} width={width} setSelectedVideo={setSelectedVideo} />
          </MobileView>
        </>
      ))}
    </div>
  );
};
